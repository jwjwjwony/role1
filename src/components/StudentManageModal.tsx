import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  AlertCircle,
  RefreshCcw,
  Sparkles,
  Search,
} from 'lucide-react';
import { Student } from '../types/growth';
import { AVATAR_OPTIONS } from '../utils/storage';

interface StudentManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onResetToSampleData: () => void;
  onClearAllStudents: () => void;
}

export const StudentManageModal: React.FC<StudentManageModalProps> = ({
  isOpen,
  onClose,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onResetToSampleData,
  onClearAllStudents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState<number>(students.length + 1);
  const [avatar, setAvatar] = useState('rabbit');
  const [cheerMessage, setCheerMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Student Delete Confirmation
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  if (!isOpen) return null;

  const filteredStudents = students
    .filter(
      (s) =>
        s.name.includes(searchTerm.trim()) ||
        String(s.studentNumber).includes(searchTerm.trim())
    )
    .sort((a, b) => a.studentNumber - b.studentNumber);

  const startAddStudent = () => {
    setName('');
    const nextNumber =
      students.length > 0 ? Math.max(...students.map((s) => s.studentNumber)) + 1 : 1;
    setStudentNumber(nextNumber);
    setAvatar('rabbit');
    setCheerMessage('');
    setErrorMsg(null);
    setEditingStudentId(null);
    setIsAdding(true);
  };

  const startEditStudent = (s: Student) => {
    setName(s.name);
    setStudentNumber(s.studentNumber);
    setAvatar(s.avatar || 'rabbit');
    setCheerMessage(s.cheerMessage || '');
    setErrorMsg(null);
    setIsAdding(false);
    setEditingStudentId(s.id);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('학생 이름을 입력해 주세요.');
      return;
    }

    if (studentNumber <= 0) {
      setErrorMsg('출석 번호는 1번 이상이어야 합니다.');
      return;
    }

    const duplicate = students.find(
      (s) => s.studentNumber === studentNumber && s.id !== editingStudentId
    );
    if (duplicate) {
      setErrorMsg(`이미 ${studentNumber}번에 '${duplicate.name}' 학생이 있습니다. 다른 번호를 입력해 주세요.`);
      return;
    }

    if (editingStudentId) {
      const existing = students.find((s) => s.id === editingStudentId);
      if (existing) {
        onUpdateStudent({
          ...existing,
          name: name.trim(),
          studentNumber,
          avatar,
          cheerMessage: cheerMessage.trim(),
        });
      }
      setEditingStudentId(null);
    } else {
      onAddStudent({
        name: name.trim(),
        studentNumber,
        avatar,
        cheerMessage: cheerMessage.trim(),
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFF5F7] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-pink-300 my-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 border border-pink-300">
              <Users size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">우리 반 학생 명단 관리</h2>
                <span className="text-xs font-extrabold bg-pink-200 text-pink-800 px-2.5 py-0.5 rounded-full">
                  총 {students.length}명
                </span>
              </div>
              <p className="text-xs text-slate-500">
                24명 학생 정보를 수정하거나 추가하고, 필요시 초기화할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-pink-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="이름 또는 번호 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {!isAdding && !editingStudentId && (
              <button
                onClick={startAddStudent}
                className="px-3.5 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus size={15} />
                <span>학생 등록</span>
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('기본 24명 학생 및 샘플 칭찬 기록으로 복원할까요? 기존 데이터는 대체됩니다.')) {
                  onResetToSampleData();
                }
              }}
              className="px-2.5 py-2 bg-white hover:bg-pink-50 text-slate-700 border border-pink-200 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              title="기본 24명 학생 복원"
            >
              <RefreshCcw size={13} className="text-pink-600" />
              <span>기본 24명 복원</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('정말 모든 학생 명단과 기록을 비울까요? (실제 학급 운영 시 깨끗이 시작할 때 사용)')) {
                  onClearAllStudents();
                }
              }}
              className="px-2.5 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              title="모든 학생 비우기"
            >
              <Trash2 size={13} />
              <span>전체 비우기</span>
            </button>
          </div>
        </div>

        {/* Add / Edit Form Panel */}
        {(isAdding || editingStudentId) && (
          <form
            onSubmit={handleSaveStudent}
            className="p-4 bg-white rounded-2xl border-2 border-pink-300 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <span className="text-xs font-bold text-pink-700 flex items-center gap-1">
                <Sparkles size={14} />
                {editingStudentId ? '학생 정보 수정' : '새로운 학생 추가'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingStudentId(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                닫기
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  학생 이름 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예) 김민준"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  출석 번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                대표 캐릭터 아바타 선택
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatar(opt.id)}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                      avatar === opt.id
                        ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                        : 'bg-[#FFF5F7] text-slate-700 border-pink-200 hover:bg-pink-100'
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                선생님의 응원 메시지 (선택)
              </label>
              <input
                type="text"
                placeholder="예) 언제나 밝은 미소로 수업을 빛내주는 멋진 학생!"
                value={cheerMessage}
                onChange={(e) => setCheerMessage(e.target.value)}
                maxLength={60}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle size={15} className="shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingStudentId(null);
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs"
              >
                <Check size={14} />
                <span>{editingStudentId ? '수정 완료' : '학생 추가'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Students List (24명) */}
        <div className="bg-white rounded-2xl border border-pink-200 overflow-hidden max-h-80 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">등록된 학생이 없습니다.</p>
          ) : (
            <div className="divide-y divide-pink-100">
              {filteredStudents.map((s) => {
                const avatarDef =
                  AVATAR_OPTIONS.find((a) => a.id === s.avatar) || AVATAR_OPTIONS[0];

                return (
                  <div
                    key={s.id}
                    className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-pink-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl ${avatarDef.bg} flex items-center justify-center text-xl shadow-inner shrink-0`}
                      >
                        {avatarDef.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">{s.studentNumber}번</span>
                          <span className="text-sm font-bold text-slate-900">{s.name}</span>
                        </div>
                        {s.cheerMessage && (
                          <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                            "{s.cheerMessage}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditStudent(s)}
                        className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-100 rounded-xl transition-colors"
                        title="학생 정보 수정"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(s)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="학생 삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Student Confirmation Dialog */}
        {studentToDelete && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-800 text-sm font-bold">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>정말 '{studentToDelete.name}' 학생을 삭제할까요?</span>
            </div>
            <p className="text-xs text-rose-700">
              학생을 삭제하면 해당 학생에게 등록된 모든 칭찬 기록도 함께 정리됩니다.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-1.5 bg-white border border-rose-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                삭제 확인
              </button>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
