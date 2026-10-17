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
  Copy,
  ExternalLink,
  Table,
  Check,
  Send,
} from 'lucide-react';
import { ClassSettings, PraiseRecord, Student, StudentGrowthSummary } from '../types/growth';
import {
  exportBackupJson,
  parseBackupJson,
  exportStudentsSummaryCsv,
  exportRecordsCsv,
  clearAllData,
} from '../utils/storage';
import {
  GOOGLE_APPS_SCRIPT_CODE,
  testGoogleSheetConnection,
  batchSyncToGoogleSheet,
} from '../utils/googleSheets';

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
  const [googleSheetUrlInput, setGoogleSheetUrlInput] = useState(settings.googleSheetUrl || '');
  const [autoSyncInput, setAutoSyncInput] = useState(settings.autoSyncToSheet ?? true);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Google Sheet actions state
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetTestResult, setSheetTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncAllResult, setSyncAllResult] = useState<string | null>(null);
  const [showCodePreview, setShowCodePreview] = useState(false);

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
      googleSheetUrl: googleSheetUrlInput.trim(),
      autoSyncToSheet: autoSyncInput,
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2000);
  };

  const handleExportJson = () => {
    exportBackupJson(students, records, settings);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTestSheet = async () => {
    if (!googleSheetUrlInput.trim()) {
      setSheetTestResult({ success: false, message: '먼저 구글 웹 앱 URL을 입력해 주세요.' });
      return;
    }
    setIsTestingSheet(true);
    setSheetTestResult(null);
    const result = await testGoogleSheetConnection(googleSheetUrlInput.trim());
    setSheetTestResult(result);
    setIsTestingSheet(false);
  };

  const handleSyncAllRecords = async () => {
    if (!googleSheetUrlInput.trim()) {
      alert('먼저 구글 웹 앱 URL을 입력하고 저장해 주세요.');
      return;
    }
    if (records.length === 0) {
      alert('동기화할 칭찬 기록이 없습니다.');
      return;
    }
    if (window.confirm(`현재 저장된 총 ${records.length}건의 칭찬 기록을 구글 시트로 전송할까요?`)) {
      setIsSyncingAll(true);
      setSyncAllResult(null);
      const res = await batchSyncToGoogleSheet(googleSheetUrlInput.trim(), records, students);
      setSyncAllResult(res.message);
      setIsSyncingAll(false);
    }
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
        setGoogleSheetUrlInput(result.data.settings.googleSheetUrl || '');
        setAutoSyncInput(result.data.settings.autoSyncToSheet ?? true);
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFF5F7] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-pink-300 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 border border-pink-300">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">데이터 백업 &amp; 구글 시트 연동 설정</h2>
              <p className="text-xs text-slate-500">
                24명 학생 기록 관리, 구글 스프레드시트 자동 연동 및 데이터 백업을 설정합니다.
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

        {/* 1. Class Info & Google Sheet URL Form */}
        <form
          onSubmit={handleSaveSettings}
          className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 block">학급 기본 정보</span>
            {savedSettingsSuccess && (
              <span className="text-xs text-pink-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> 설정이 저장되었습니다!
              </span>
            )}
          </div>

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

          <div className="pt-2 border-t border-pink-100">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Table size={15} className="text-pink-600" />
                <span>구글 스프레드시트 웹 앱 URL</span>
              </label>
              <span className="text-[10px] text-pink-600 font-semibold">
                (번호, 학생이름, 칭찬내용, 칭찬포인트 자동 기록)
              </span>
            </div>
            <input
              type="url"
              value={googleSheetUrlInput}
              onChange={(e) => setGoogleSheetUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 font-mono"
            />
            
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSyncInput}
                  onChange={(e) => setAutoSyncInput(e.target.checked)}
                  className="rounded-sm border-pink-300 text-pink-600 focus:ring-pink-400 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-700">
                  칭찬 등록 시 구글 시트에 자동으로 추가 전송하기
                </span>
              </label>

              <button
                type="submit"
                className="py-1.5 px-4 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                설정 저장
              </button>
            </div>
          </div>
        </form>

        {/* 2. Google Apps Script (code.gs) Guide & Action Card */}
        <div className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table size={18} className="text-pink-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">구글 시트 연동 스크립트 (code.gs)</span>
                <span className="text-[11px] text-slate-500">
                  스프레드시트 탭 구성: <strong className="text-pink-700">(번호, 학생이름, 칭찬내용, 칭찬포인트)</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-900 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors border border-pink-200 shadow-xs"
            >
              {copiedCode ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedCode ? '복사 완료!' : 'code.gs 복사하기'}</span>
            </button>
          </div>

          {/* Quick Guide Steps */}
          <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 text-[11px] text-slate-700 space-y-1 leading-relaxed">
            <p className="font-bold text-pink-900">📌 3분 만에 구글 시트 연동하는 방법:</p>
            <p>1. 구글 스프레드시트 새 문서를 열고, 상단 <strong>[확장 프로그램] &gt; [Apps Script]</strong>를 클릭합니다.</p>
            <p>2. 위의 <strong>[code.gs 복사하기]</strong> 버튼을 눌러 스크립트 창에 그대로 붙여넣습니다.</p>
            <p>3. 우측 상단 <strong>[배포] &gt; [새 배포]</strong> 클릭 후 유형을 <strong>'웹 앱'</strong>으로 선택합니다.</p>
            <p>4. ⚠️ <strong>'액세스 권한: 모든 사용자(Anyone)'</strong>로 설정 후 배포하고, 발급된 <strong>웹 앱 URL</strong>을 위 입력칸에 넣고 저장하세요!</p>
          </div>

          {/* Action buttons: Test Connection & Full Sync */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleTestSheet}
              disabled={isTestingSheet}
              className="py-1.5 px-3 bg-white border border-pink-300 hover:bg-pink-50 text-pink-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={13} />
              <span>{isTestingSheet ? '연결 확인 중...' : '연동 테스트'}</span>
            </button>

            <button
              onClick={handleSyncAllRecords}
              disabled={isSyncingAll}
              className="py-1.5 px-3 bg-pink-50 hover:bg-pink-100 border border-pink-300 text-pink-900 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shadow-xs"
            >
              <Send size={13} className="text-pink-600" />
              <span>{isSyncingAll ? '시트로 전송 중...' : `현재 칭찬 기록(${records.length}건) 전체 시트 전송`}</span>
            </button>

            <button
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-auto"
            >
              {showCodePreview ? '코드 닫기' : 'code.gs 전체 코드 미리보기'}
            </button>
          </div>

          {/* Test or Sync Result Toast */}
          {sheetTestResult && (
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                sheetTestResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {sheetTestResult.success ? (
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle size={15} className="text-rose-600 shrink-0" />
              )}
              <span>{sheetTestResult.message}</span>
            </div>
          )}

          {syncAllResult && (
            <div className="p-2.5 rounded-xl text-xs font-semibold bg-pink-50 text-pink-900 border border-pink-200 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-pink-600 shrink-0" />
              <span>{syncAllResult}</span>
            </div>
          )}

          {/* Code.gs Code Viewer */}
          {showCodePreview && (
            <div className="mt-2 p-3 bg-slate-900 text-pink-200 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto border border-pink-300">
              <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
            </div>
          )}
        </div>

        {/* 3. Backup & Restore (JSON) */}
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
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {restoreStatus.type === 'success' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-rose-600 shrink-0" />
              )}
              <span>{restoreStatus.message}</span>
            </div>
          )}
        </div>

        {/* 4. CSV Spreadsheet Export */}
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

        {/* 5. Privacy Notice */}
        <div className="p-3.5 bg-pink-50/70 rounded-2xl border border-pink-200 flex items-start gap-2.5">
          <HelpCircle size={16} className="text-pink-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>개인정보 및 보안 안내:</strong> 본 앱은 승인되지 않은 외부 서버로 데이터를 전송하지 않으며, 전적으로 선생님의 브라우저 로컬 저장소(localStorage) 및 선생님이 직접 지정한 구글 스프레드시트에만 안전하게 기록됩니다.
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
