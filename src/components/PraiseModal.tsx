import React, { useState } from 'react';
import {
  Sparkles,
  X,
  PlusCircle,
  MinusCircle,
  AlertCircle,
  Heart,
  BookOpen,
  Flame,
  CheckCircle2,
  Trophy,
  Handshake,
  MessageSquare,
  Search,
} from 'lucide-react';
import { PraiseCategory, PraiseRecord, Student } from '../types/growth';
import { PRESET_PRAISES, AVATAR_OPTIONS, calculateStudentPoints } from '../utils/storage';

interface PraiseModalProps {
  students: Student[];
  records: PraiseRecord[];
  initialStudentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<PraiseRecord, 'id' | 'timestamp'>) => void;
}

export const PraiseModal: React.FC<PraiseModalProps> = ({
  students,
  records,
  initialStudentId,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students.length > 0 ? students[0].id : '')
  );
  const [isDeductionMode, setIsDeductionMode] = useState<boolean>(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Custom inputs
  const [customReason, setCustomReason] = useState<string>('');
  const [customPoints, setCustomPoints] = useState<number>(2);
  const [memo, setMemo] = useState<string>('');
  const [studentSearch, setStudentSearch] = useState<string>('');

  // Deduct inputs
  const [deductReason, setDeductReason] = useState<string>('');
  const [deductPoints, setDeductPoints] = useState<number>(1);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const currentTotalPoints = currentStudent ? calculateStudentPoints(records, currentStudent.id) : 0;

  const filteredStudents = students.filter(
    (s) =>
      s.name.includes(studentSearch.trim()) ||
      String(s.studentNumber).includes(studentSearch.trim())
  );

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart size={18} className="text-pink-500 fill-pink-300 shrink-0" />;
      case 'book-open':
        return <BookOpen size={18} className="text-rose-500 shrink-0" />;
      case 'flame':
        return <Flame size={18} className="text-fuchsia-500 shrink-0" />;
      case 'check-circle-2':
        return <CheckCircle2 size={18} className="text-pink-600 shrink-0" />;
      case 'trophy':
        return <Trophy size={18} className="text-amber-500 shrink-0" />;
      case 'handshake':
        return <Handshake size={18} className="text-rose-500 shrink-0" />;
      default:
        return <Sparkles size={18} className="text-pink-500 shrink-0" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);

    if (!selectedStudentId || !currentStudent) {
      setErrorMessage('학생을 먼저 선택해 주세요.');
      return;
    }

    if (isDeductionMode) {
      if (!deductReason.trim()) {
        setErrorMessage('포인트를 차감할 때는 사유를 반드시 입력해야 합니다.');
        return;
      }

      if (deductPoints <= 0) {
        setErrorMessage('차감할 포인트는 1점 이상이어야 합니다.');
        return;
      }

      if (currentTotalPoints - deductPoints < 0) {
        setErrorMessage(
          `현재 학생의 포인트는 ${currentTotalPoints}P 입니다. ${deductPoints}P를 차감하면 0점 미만(음수)이 되므로 처리할 수 없습니다.`
        );
        return;
      }

      setIsSubmitting(true);
      onSave({
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        reason: `[포인트 조정] ${deductReason.trim()}`,
        category: 'adjustment',
        points: -deductPoints,
        memo: memo.trim(),
      });
      setIsSubmitting(false);
      onClose();
      return;
    }

    let reason = '';
    let points = 2;
    let category: PraiseCategory = 'custom';

    if (isCustomMode) {
      if (!customReason.trim()) {
        setErrorMessage('칭찬 사유를 입력해 주세요.');
        return;
      }
      if (customPoints <= 0) {
        setErrorMessage('지급할 포인트는 1점 이상이어야 합니다.');
        return;
      }
      reason = customReason.trim();
      points = customPoints;
      category = 'custom';
    } else {
      if (selectedPresetIndex === null) {
        setErrorMessage('칭찬 항목을 선택해 주세요.');
        return;
      }
      const preset = PRESET_PRAISES[selectedPresetIndex];
      reason = preset.reason;
      points = preset.points;
      category = preset.category;
    }

    setIsSubmitting(true);
    onSave({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      reason,
      category,
      points,
      memo: memo.trim(),
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFF5F7] rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-pink-300 my-8 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-200/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 border border-pink-300">
              {isDeductionMode ? <MinusCircle size={22} /> : <Sparkles size={22} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isDeductionMode ? '포인트 차감 및 조정' : '핑크빛 칭찬 선물하기'}
              </h2>
              <p className="text-xs text-slate-500">
                {isDeductionMode
                  ? '부득이한 경우 점수를 차감하거나 수정합니다 (사유 필수)'
                  : '좋은 행동과 노력에 따뜻한 사랑과 응원을 전해 주세요.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-pink-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Toggle Bar (Pink Theme) */}
        <div className="flex items-center justify-between p-1 bg-pink-100/70 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setIsDeductionMode(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              !isDeductionMode
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle size={16} />
            <span>칭찬하기 (+포인트)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDeductionMode(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              isDeductionMode
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MinusCircle size={16} />
            <span>점수 차감/수정 (-포인트)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Student Selection (24 Students) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-slate-700">
                학생 선택 <span className="text-pink-600 text-xs font-normal">(24명 명단)</span>
              </label>
              {currentStudent && (
                <span className="text-xs font-semibold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">
                  현재 누적 {currentTotalPoints}P
                </span>
              )}
            </div>

            {/* Quick Filter Search */}
            <div className="relative mb-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="학생 이름 또는 번호 검색 (예: 12 또는 수아)..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Student Chips (24명 스크롤) */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-white/80 rounded-2xl border border-pink-200">
              {filteredStudents.length === 0 ? (
                <p className="text-xs text-slate-400 p-3">검색된 학생이 없습니다.</p>
              ) : (
                filteredStudents.map((s) => {
                  const avatarDef = AVATAR_OPTIONS.find((a) => a.id === s.avatar) || AVATAR_OPTIONS[0];
                  const isSelected = selectedStudentId === s.id;
                  const pts = calculateStudentPoints(records, s.id);

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setErrorMessage(null);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'bg-pink-500 text-white border-pink-600 shadow-xs scale-102'
                          : 'bg-white text-slate-700 border-pink-200 hover:bg-pink-50'
                      }`}
                    >
                      <span className="text-sm">{avatarDef.emoji}</span>
                      <span>
                        {s.studentNumber}번 {s.name}
                      </span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-700'}`}>
                        {pts}P
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. Praise Mode or Deduction Mode */}
          {!isDeductionMode ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">칭찬 항목 선택</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(!isCustomMode);
                    setSelectedPresetIndex(null);
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 underline underline-offset-2"
                >
                  {isCustomMode ? '기본 항목 목록 보기' : '직접 입력하기'}
                </button>
              </div>

              {!isCustomMode ? (
                /* Preset Praise Items */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_PRAISES.map((preset, idx) => {
                    const isSelected = selectedPresetIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedPresetIndex(idx);
                          setErrorMessage(null);
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                          isSelected
                            ? 'bg-pink-100/90 border-pink-400 ring-2 ring-pink-400 text-slate-900 font-bold shadow-xs'
                            : 'bg-white border-pink-200 text-slate-700 hover:bg-pink-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {getPresetIcon(preset.icon)}
                          <span className="text-xs sm:text-sm truncate">{preset.reason}</span>
                        </div>
                        <span className="shrink-0 text-xs font-extrabold px-2 py-0.5 rounded-lg bg-pink-100 text-pink-700 border border-pink-200">
                          +{preset.points}P
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Custom Praise Input */
                <div className="p-3.5 bg-white rounded-2xl border border-pink-200 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      칭찬 사유 직접 입력
                    </label>
                    <input
                      type="text"
                      placeholder="예) 급식실에서 차례를 잘 지켰어요, 친구를 도와주었어요"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      maxLength={50}
                      className="w-full px-3 py-2 text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      지급 포인트 설정
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 5].map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setCustomPoints(pt)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            customPoints === pt
                              ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                              : 'bg-[#FFF5F7] text-slate-700 border-pink-200 hover:bg-pink-100'
                          }`}
                        >
                          +{pt}점
                        </button>
                      ))}
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customPoints}
                        onChange={(e) => setCustomPoints(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1.5 text-xs text-center font-bold bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Deduction Mode Form */
            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
              <div>
                <label className="text-xs font-bold text-rose-900 block mb-1">
                  차감/수정 사유 <span className="text-rose-600">* (필수 입력)</span>
                </label>
                <input
                  type="text"
                  placeholder="예) 이전 칭찬 포인트 오지급으로 인한 정정"
                  value={deductReason}
                  onChange={(e) => setDeductReason(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2 text-sm bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-rose-900 block mb-1">
                  차감 포인트 선택 (최대 현재 점수: {currentTotalPoints}P)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setDeductPoints(pt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        deductPoints === pt
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      -{pt}점
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, currentTotalPoints)}
                    value={deductPoints}
                    onChange={(e) => setDeductPoints(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-18 px-2 py-1.5 text-xs text-center font-bold bg-white border border-rose-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Teacher Memo */}
          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <MessageSquare size={15} className="text-pink-600" />
              <span>선생님의 응원 메모 (선택)</span>
            </label>
            <input
              type="text"
              placeholder="예) 오늘 발표하는 목소리가 씩씩하고 멋졌어!"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={80}
              className="w-full px-3 py-2 text-sm bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-white border border-pink-200 hover:bg-pink-50 text-slate-700 font-bold text-sm rounded-xl transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${
                isDeductionMode
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-pink-500 hover:bg-pink-600 text-white'
              }`}
            >
              {isSubmitting ? (
                <span>저장 중...</span>
              ) : isDeductionMode ? (
                <>
                  <MinusCircle size={18} />
                  <span>포인트 차감 적용</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>칭찬 저장하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
