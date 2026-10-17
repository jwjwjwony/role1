import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  AlertTriangle,
  X,
  Check,
  Calendar,
  Download,
  BookOpen,
} from 'lucide-react';
import { PraiseRecord, Student } from '../types/growth';
import { calculateStudentPoints, exportRecordsCsv } from '../utils/storage';

interface RecordLogbookViewProps {
  records: PraiseRecord[];
  students: Student[];
  onUpdateRecord: (updatedRecord: PraiseRecord) => boolean;
  onDeleteRecord: (recordId: string) => boolean;
}

export const RecordLogbookView: React.FC<RecordLogbookViewProps> = ({
  records,
  students,
  onUpdateRecord,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'praise' | 'adjustment'>('all');

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<PraiseRecord | null>(null);
  const [editReason, setEditReason] = useState('');
  const [editPoints, setEditPoints] = useState(2);
  const [editMemo, setEditMemo] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Delete Confirm State
  const [recordToDelete, setRecordToDelete] = useState<PraiseRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filtering Logic
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneWeekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  const filteredRecords = records
    .filter((r) => {
      if (selectedStudentId !== 'all' && r.studentId !== selectedStudentId) return false;
      if (typeFilter === 'praise' && r.points <= 0) return false;
      if (typeFilter === 'adjustment' && r.points >= 0) return false;

      const recordTime = new Date(r.timestamp).getTime();
      if (dateFilter === 'today' && recordTime < startOfToday) return false;
      if (dateFilter === 'week' && recordTime < oneWeekAgo) return false;
      if (dateFilter === 'month' && recordTime < oneMonthAgo) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = r.studentName.toLowerCase().includes(query);
        const matchesReason = r.reason.toLowerCase().includes(query);
        const matchesMemo = r.memo.toLowerCase().includes(query);
        if (!matchesName && !matchesReason && !matchesMemo) return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const openEditModal = (rec: PraiseRecord) => {
    setEditingRecord(rec);
    setEditReason(rec.reason);
    setEditPoints(rec.points);
    setEditMemo(rec.memo || '');
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setEditError(null);

    if (!editReason.trim()) {
      setEditError('사유를 입력해 주세요.');
      return;
    }

    if (editPoints === 0) {
      setEditError('포인트는 0이 될 수 없습니다.');
      return;
    }

    const currentTotal = calculateStudentPoints(records, editingRecord.studentId);
    const diff = editPoints - editingRecord.points;
    if (currentTotal + diff < 0) {
      setEditError(
        `점수를 수정하면 해당 학생의 총점이 음수(${currentTotal + diff}P)가 됩니다. 최소 ${
          -(currentTotal - editingRecord.points)
        }P 이상이어야 합니다.`
      );
      return;
    }

    const updated: PraiseRecord = {
      ...editingRecord,
      reason: editReason.trim(),
      points: editPoints,
      memo: editMemo.trim(),
    };

    const success = onUpdateRecord(updated);
    if (success) {
      setEditingRecord(null);
    }
  };

  const confirmDelete = (rec: PraiseRecord) => {
    setDeleteError(null);
    const currentTotal = calculateStudentPoints(records, rec.studentId);
    if (currentTotal - rec.points < 0) {
      setDeleteError(
        `이 기록을 삭제하면 해당 학생의 총 포인트가 음수(${currentTotal - rec.points}P)가 되므로 삭제할 수 없습니다.`
      );
    }
    setRecordToDelete(rec);
  };

  const handleExecuteDelete = () => {
    if (!recordToDelete) return;
    const success = onDeleteRecord(recordToDelete.id);
    if (success) {
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Export (Pink Theme) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-pink-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-pink-600" />
            <h2 className="text-xl font-bold text-slate-900">성장 기록장</h2>
          </div>
          <p className="text-xs text-slate-500">
            총 24명 학생에게 지급된 모든 칭찬과 조정 내역을 투명하게 확인하고 관리합니다. (총 {records.length}건)
          </p>
        </div>

        <button
          onClick={() => exportRecordsCsv(records)}
          className="px-4 py-2.5 bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs border border-pink-200"
        >
          <Download size={16} />
          <span>전체 기록 CSV 다운로드</span>
        </button>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pink-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="학생 이름, 칭찬 사유, 메모 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm font-semibold bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 text-slate-800"
            >
              <option value="all">전체 학생 (24명)</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentNumber}번 {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Type Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-pink-100">
          <div className="flex items-center gap-1 p-1 bg-pink-50 rounded-xl border border-pink-200">
            <span className="text-[11px] font-bold text-pink-700 px-2 flex items-center gap-1">
              <Calendar size={12} /> 기간:
            </span>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'all' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'today' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'week' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              최근 7일
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === 'month' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              최근 30일
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-pink-50 rounded-xl border border-pink-200">
            <span className="text-[11px] font-bold text-pink-700 px-2 flex items-center gap-1">
              <Filter size={12} /> 종류:
            </span>
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'all' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              모두
            </button>
            <button
              onClick={() => setTypeFilter('praise')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'praise' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              칭찬 (+)
            </button>
            <button
              onClick={() => setTypeFilter('adjustment')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === 'adjustment' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              차감/조정 (-)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Records List / Table */}
      <div className="bg-white rounded-3xl border border-pink-200/80 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen size={36} className="mx-auto text-pink-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">해당 조건에 맞는 기록이 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">검색어나 필터를 조정해 보세요.</p>
          </div>
        ) : (
          <div className="divide-y divide-pink-100">
            {filteredRecords.map((rec) => {
              const formattedDate = new Date(rec.timestamp).toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              });
              const isPositive = rec.points > 0;

              return (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 hover:bg-pink-50/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-slate-900 bg-pink-100 px-2.5 py-0.5 rounded-md border border-pink-200">
                        {rec.studentName}
                      </span>
                      <span className="text-xs text-slate-400">{formattedDate}</span>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-lg tabular-nums ${
                          isPositive
                            ? 'bg-pink-100 text-pink-700 border border-pink-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPositive ? `+${rec.points}` : rec.points}P
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-800">
                      {rec.reason}
                    </div>

                    {rec.memo && (
                      <p className="text-xs text-slate-500 italic bg-[#FFF5F7] p-2 rounded-xl border border-pink-100 max-w-xl">
                        "{rec.memo}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openEditModal(rec)}
                      className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-100/60 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="기록 수정"
                    >
                      <Edit2 size={15} />
                      <span className="hidden sm:inline">수정</span>
                    </button>

                    <button
                      onClick={() => confirmDelete(rec)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="기록 삭제"
                    >
                      <Trash2 size={15} />
                      <span className="hidden sm:inline">삭제</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#FFF5F7] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-pink-300">
            <div className="flex items-center justify-between pb-3 border-b border-pink-200 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                칭찬 기록 수정 ({editingRecord.studentName})
              </h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">칭찬/조정 사유</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  포인트 (양수는 칭찬, 음수는 차감)
                </label>
                <input
                  type="number"
                  value={editPoints}
                  onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">교사 메모</label>
                <textarea
                  value={editMemo}
                  onChange={(e) => setEditMemo(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
                  {editError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 py-2.5 bg-white border border-pink-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  <span>수정 내용 저장</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Record Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">이 기록을 삭제할까요?</h3>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-bold text-slate-700">{recordToDelete.studentName}</span>의 '
                {recordToDelete.reason}' ({recordToDelete.points > 0 ? `+${recordToDelete.points}` : recordToDelete.points}P)
                기록이 삭제되며 포인트 합계가 즉시 갱신됩니다.
              </p>
            </div>

            {deleteError ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
                {deleteError}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                취소
              </button>
              <button
                onClick={handleExecuteDelete}
                disabled={Boolean(deleteError)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
