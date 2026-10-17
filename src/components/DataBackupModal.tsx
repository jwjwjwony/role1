import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  X,
  AlertTriangle,
  CheckCircle2,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { ClassSettings, PraiseRecord, Student, StudentGrowthSummary } from '../types/growth';
import {
  exportBackupJson,
  parseBackupJson,
  exportStudentsSummaryCsv,
  exportRecordsCsv,
  clearAllData,
} from '../utils/storage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  records: PraiseRecord[];
  settings: ClassSettings;
  summaries: StudentGrowthSummary[];
  onUpdateSettings: (newSettings: ClassSettings) => void;
  onRestoreBackup: (backup: {
    students: Student[];
    records: PraiseRecord[];
    settings: ClassSettings;
  }) => void;
  onDataReset: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  students,
  records,
  settings,
  summaries,
  onUpdateSettings,
  onRestoreBackup,
  onDataReset,
}) => {
  const [classNameInput, setClassNameInput] = useState(settings.className);
  const [teacherNameInput, setTeacherNameInput] = useState(settings.teacherName);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      className: classNameInput.trim() || '우리 반',
      teacherName: teacherNameInput.trim() || '선생님',
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2000);
  };

  const handleExportJson = () => {
    exportBackupJson(students, records, settings);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = parseBackupJson(content);

      if (!result.success || !result.data) {
        setRestoreStatus({
          type: 'error',
          message: result.message,
        });
        return;
      }

      if (
        window.confirm(
          `백업 파일 정보를 확인했습니다:\n- 학생: ${result.data.students.length}명\n- 기록: ${result.data.records.length}건\n\n기존 데이터를 이 백업 파일 내용으로 덮어쓸까요?`
        )
      ) {
        onRestoreBackup(result.data);
        setRestoreStatus({
          type: 'success',
          message: '성공적으로 백업 데이터를 복원했습니다!',
        });
        setClassNameInput(result.data.settings.className);
        setTeacherNameInput(result.data.settings.teacherName);
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFF5F7] rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-pink-300 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 border border-pink-300">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">데이터 백업 및 학급 설정</h2>
              <p className="text-xs text-slate-500">
                개인정보 보호를 위해 24명 학생 데이터는 선생님 브라우저에만 안전하게 보관됩니다.
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

        {/* 1. Class & Teacher Info Form */}
        <form
          onSubmit={handleSaveSettings}
          className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3"
        >
          <span className="text-xs font-bold text-slate-700 block">학급 기본 정보</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">학급 이름</label>
              <input
                type="text"
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                placeholder="예) 사랑가득 3학년 2반"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">선생님 성함</label>
              <input
                type="text"
                value={teacherNameInput}
                onChange={(e) => setTeacherNameInput(e.target.value)}
                placeholder="예) 김민주 선생님"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {savedSettingsSuccess ? (
              <span className="text-xs text-pink-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> 설정이 저장되었습니다!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="py-1.5 px-4 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              학급 정보 저장
            </button>
          </div>
        </form>

        {/* 2. Backup & Restore (JSON) */}
        <div className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-700 block">전체 데이터 백업 및 복원 (JSON)</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              기기 변경이나 브라우저 데이터 청소 전 24명 학생 기록을 JSON 파일로 안전하게 다운로드하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleExportJson}
              className="p-3 bg-pink-50 hover:bg-pink-100/90 text-pink-900 border border-pink-300 rounded-2xl flex items-center justify-between gap-2 transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <FileJson size={20} className="text-pink-600" />
                <div className="text-left">
                  <span className="text-xs font-bold block">전체 백업 파일 다운로드</span>
                  <span className="text-[10px] text-pink-700">.json 형식 파일 저장</span>
                </div>
              </div>
              <Download size={16} className="text-pink-600" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-2xl flex items-center justify-between gap-2 transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Upload size={20} className="text-rose-600" />
                <div className="text-left">
                  <span className="text-xs font-bold block">백업 파일 불러오기</span>
                  <span className="text-[10px] text-rose-700">기존 데이터 복원하기</span>
                </div>
              </div>
              <Download size={16} className="text-rose-600 rotate-180" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {restoreStatus.type && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                restoreStatus.type === 'success'
                  ? 'bg-pink-50 text-pink-800 border border-pink-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {restoreStatus.type === 'success' ? (
                <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-rose-600 shrink-0" />
              )}
              <span>{restoreStatus.message}</span>
            </div>
          )}
        </div>

        {/* 3. CSV Spreadsheet Export */}
        <div className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-700 block">엑셀/스프레드시트 내보내기 (CSV)</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              생활기록부 참고자료, 통지표 작성 시 엑셀에서 바로 열리는 UTF-8 BOM 파일입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => exportStudentsSummaryCsv(summaries)}
              className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-2xl flex items-center justify-between transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-pink-600" />
                <div className="text-left">
                  <span className="text-xs font-bold block">학생별 요약 CSV (24명)</span>
                  <span className="text-[10px] text-pink-700">점수·단계·배지·응원</span>
                </div>
              </div>
              <Download size={15} />
            </button>

            <button
              onClick={() => exportRecordsCsv(records)}
              className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-2xl flex items-center justify-between transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-pink-600" />
                <div className="text-left">
                  <span className="text-xs font-bold block">전체 칭찬 기록 CSV</span>
                  <span className="text-[10px] text-pink-700">날짜·사유·점수·메모</span>
                </div>
              </div>
              <Download size={15} />
            </button>
          </div>
        </div>

        {/* 4. Privacy Notice */}
        <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-pink-200 flex items-start gap-2.5">
          <HelpCircle size={16} className="text-pink-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>개인정보 및 보안 안내:</strong> 본 앱은 서버나 클라우드로 학생 정보를 절대 전송하지 않으며, 전적으로 선생님의 브라우저 로컬 저장소(localStorage)에만 보관됩니다. 학기 말이나 기기 변경 시 '전체 백업 파일 다운로드'를 활용해 주세요.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => {
              if (
                window.confirm(
                  '정말 모든 데이터를 완전히 초기화할까요? 복구할 수 없으므로 필요한 경우 미리 백업해 주세요.'
                )
              ) {
                clearAllData();
                onDataReset();
                onClose();
              }
            }}
            className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline underline-offset-2"
          >
            데이터 완전 초기화
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
