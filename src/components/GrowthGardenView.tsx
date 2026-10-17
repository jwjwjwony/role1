import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Check,
  Heart,
  Star,
  ShieldCheck,
  Sprout,
  Plus,
} from 'lucide-react';
import { PraiseRecord, Student, StudentGrowthSummary } from '../types/growth';
import { AVATAR_OPTIONS, calculateStageProgress } from '../utils/storage';
import { GrowthTree } from './GrowthTree';

interface GrowthGardenViewProps {
  students: Student[];
  records: PraiseRecord[];
  summaries: StudentGrowthSummary[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
  onOpenPraiseModal: (studentId: string) => void;
  onUpdateCheerMessage: (studentId: string, newMessage: string) => void;
}

export const GrowthGardenView: React.FC<GrowthGardenViewProps> = ({
  students,
  records,
  summaries,
  selectedStudentId,
  onSelectStudent,
  onOpenPraiseModal,
  onUpdateCheerMessage,
}) => {
  const [isEditingCheer, setIsEditingCheer] = useState(false);
  const [cheerInput, setCheerInput] = useState('');

  const currentSummary =
    summaries.find((s) => s.student.id === selectedStudentId) || summaries[0];

  if (!currentSummary) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-pink-200">
        <Sprout size={48} className="mx-auto text-pink-300 mb-3" />
        <h3 className="text-lg font-bold text-slate-800">등록된 학생이 없습니다.</h3>
        <p className="text-xs text-slate-500 mt-1">학생을 추가하여 첫 성장 정원을 만들어 보세요.</p>
      </div>
    );
  }

  const { student, totalPoints, stage, earnedBadges } = currentSummary;
  const progressInfo = calculateStageProgress(totalPoints);
  const avatarDef = AVATAR_OPTIONS.find((a) => a.id === student.avatar) || AVATAR_OPTIONS[0];

  const studentRecords = records
    .filter((r) => r.studentId === student.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Handle student index navigation
  const currentIndex = students.findIndex((s) => s.id === student.id);
  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      onSelectStudent(students[currentIndex - 1].id);
      setIsEditingCheer(false);
    }
  };
  const handleNextStudent = () => {
    if (currentIndex < students.length - 1) {
      onSelectStudent(students[currentIndex + 1].id);
      setIsEditingCheer(false);
    }
  };

  const startEditCheer = () => {
    setCheerInput(student.cheerMessage || '');
    setIsEditingCheer(true);
  };

  const saveCheer = () => {
    onUpdateCheerMessage(student.id, cheerInput.trim());
    setIsEditingCheer(false);
  };

  const cheerPresets = [
    '언제나 최선을 다하는 네가 정말 자랑스러워!',
    '친구들을 따뜻하게 배려하는 예쁜 마음이 빛나요.',
    '어려운 일도 포기하지 않는 멋진 용기!',
    '작은 노력들이 모여 예쁜 꽃나무로 자라나고 있단다.',
    '오늘도 환한 미소로 교실을 밝혀줘서 고마워.',
  ];

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <Heart size={20} className="text-pink-500 fill-pink-300" />;
      case 'sparkles':
        return <Sparkles size={20} className="text-rose-500" />;
      case 'star':
        return <Star size={20} className="text-fuchsia-500 fill-fuchsia-300" />;
      case 'shield-check':
        return <ShieldCheck size={20} className="text-pink-600" />;
      default:
        return <Award size={20} className="text-pink-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Student Switcher Bar (Pink Theme) */}
      <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-3xl border border-pink-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevStudent}
            disabled={currentIndex <= 0}
            className="p-2 rounded-xl text-slate-600 hover:bg-pink-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="이전 학생"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl ${avatarDef.bg} flex items-center justify-center text-xl shadow-inner`}>
              {avatarDef.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">{student.studentNumber}번</span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{student.name}</h2>
              </div>
              <span className="text-xs text-pink-600 font-semibold">{stage.name} 단계</span>
            </div>
          </div>

          <button
            onClick={handleNextStudent}
            disabled={currentIndex >= students.length - 1}
            className="p-2 rounded-xl text-slate-600 hover:bg-pink-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="다음 학생"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Quick Student Selector Dropdown (24명) */}
        <div className="flex items-center gap-2">
          <select
            value={student.id}
            onChange={(e) => {
              onSelectStudent(e.target.value);
              setIsEditingCheer(false);
            }}
            className="text-xs sm:text-sm font-semibold bg-[#FFF5F7] border border-pink-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-400"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.studentNumber}번 {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onOpenPraiseModal(student.id)}
            className="px-3.5 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">이 학생 칭찬하기</span>
            <span className="sm:hidden">칭찬</span>
          </button>
        </div>
      </div>

      {/* 2. Main Stage: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Growth Tree Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-pink-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">성장 정원 캔버스</span>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{student.name}의 {stage.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  {stage.badgeTitle}
                </span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-pink-600 tabular-nums">{totalPoints}P</span>
            </div>
          </div>

          {/* Dynamic Interactive SVG Tree */}
          <GrowthTree stageId={stage.id} points={totalPoints} studentName={student.name} />

          <p className="text-xs text-slate-500 text-center font-medium">
            {stage.description}
          </p>

          {/* Progress to Next Stage Bar */}
          <div className="pt-2 border-t border-pink-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">
                {progressInfo.isMaxLevel ? '최고 단계 도달!' : `다음 단계까지 ${progressInfo.pointsToNext}P 남음`}
              </span>
              <span className="text-pink-600 tabular-nums font-bold">{progressInfo.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-600 rounded-full transition-all duration-700 ease-out shadow-xs"
                style={{ width: `${progressInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>새싹 (0P)</span>
              <span>어린 나무 (10P)</span>
              <span>큰 나무 (25P)</span>
              <span>꽃나무 (50P+)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Teacher's Cheer Note (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Teacher's Cheer Note */}
          <div className="bg-gradient-to-br from-pink-50/90 via-white to-rose-50/60 rounded-3xl p-5 border border-pink-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Heart size={16} className="text-pink-500 fill-pink-300" />
                <span>선생님의 핑크빛 응원 한마디</span>
              </h4>
              {!isEditingCheer && (
                <button
                  onClick={startEditCheer}
                  className="text-xs text-pink-600 font-bold flex items-center gap-1 hover:text-pink-800"
                >
                  <Edit3 size={13} />
                  <span>수정</span>
                </button>
              )}
            </div>

            {isEditingCheer ? (
              <div className="space-y-2">
                <textarea
                  value={cheerInput}
                  onChange={(e) => setCheerInput(e.target.value)}
                  placeholder="아이에게 전하고 싶은 따뜻한 응원 글을 적어주세요."
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 bg-white border border-pink-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />

                <div className="flex flex-wrap gap-1">
                  {cheerPresets.slice(0, 3).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCheerInput(preset)}
                      className="text-[11px] px-2 py-1 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-lg transition-colors text-left truncate max-w-full"
                    >
                      💖 {preset}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingCheer(false)}
                    className="flex-1 py-1.5 px-3 bg-white border border-pink-200 text-slate-600 text-xs font-semibold rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveCheer}
                    className="flex-1 py-1.5 px-3 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check size={14} />
                    <span>저장</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/80 rounded-2xl border border-pink-100 text-slate-700 text-xs sm:text-sm leading-relaxed shadow-inner">
                {student.cheerMessage ? (
                  <p className="italic font-medium text-pink-950">"{student.cheerMessage}"</p>
                ) : (
                  <p className="text-slate-400">
                    아직 등록된 응원 메시지가 없어요. '수정' 버튼을 눌러 메시지를 남겨보세요!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Earned Badges Section */}
          <div className="bg-white rounded-3xl p-5 border border-pink-200/80 shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Award size={16} className="text-pink-500" />
                <span>획득한 칭찬 배지</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                해당 행동을 3회 이상 실천하면 자동으로 배지를 획득해요.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {earnedBadges.map(({ badge, count, isEarned }) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isEarned
                      ? 'bg-pink-50/80 border-pink-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center shadow-xs bg-white border border-pink-100">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <h5 className="text-xs font-bold text-slate-800">{badge.name}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{badge.description}</p>

                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-center gap-1 text-[11px] font-bold">
                    {isEarned ? (
                      <span className="text-pink-600 flex items-center gap-1">
                        <Sparkles size={12} /> 달성 완료!
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        {count} / {badge.targetCount}회
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Student's Recent Praise Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-pink-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900">
            {student.name} 학생의 칭찬 히스토리 ({studentRecords.length}건)
          </h4>
          <button
            onClick={() => onOpenPraiseModal(student.id)}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            <Plus size={14} />
            <span>칭찬 추가</span>
          </button>
        </div>

        {studentRecords.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">아직 등록된 기록이 없습니다.</p>
        ) : (
          <div className="space-y-2.5">
            {studentRecords.map((rec) => {
              const formattedDate = new Date(rec.timestamp).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const isPositive = rec.points > 0;

              return (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-[#FFF5F7] border border-pink-100 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {rec.reason}
                      </span>
                      <span className="text-[11px] text-slate-400">{formattedDate}</span>
                    </div>
                    {rec.memo && (
                      <p className="text-xs text-slate-600 italic">
                        "{rec.memo}"
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl tabular-nums shrink-0 ${
                      isPositive
                        ? 'bg-pink-100 text-pink-700 border border-pink-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isPositive ? `+${rec.points}` : rec.points}P
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
