import { useState, useMemo } from 'react';
import {
  Student,
  PraiseRecord,
  ClassSettings,
} from './types/growth';
import {
  loadStudents,
  saveStudents,
  loadRecords,
  saveRecords,
  loadSettings,
  saveSettings,
  getStudentGrowthSummary,
  resetToSampleData,
  clearAllData,
} from './utils/storage';
import { sendRecordToGoogleSheet } from './utils/googleSheets';
import { TopBar, ActiveTab } from './components/TopBar';
import { ClassHome } from './components/ClassHome';
import { PraiseModal } from './components/PraiseModal';
import { GrowthGardenView } from './components/GrowthGardenView';
import { RecordLogbookView } from './components/RecordLogbookView';
import { StudentManageModal } from './components/StudentManageModal';
import { DataBackupModal } from './components/DataBackupModal';
import { StarCelebration } from './components/StarCelebration';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  // 1. Persistent State (24 students by default)
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [records, setRecords] = useState<PraiseRecord[]>(() => loadRecords());
  const [settings, setSettings] = useState<ClassSettings>(() => loadSettings());

  // 2. UI Navigation & Selection State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedGardenStudentId, setSelectedGardenStudentId] = useState<string>(() => {
    const list = loadStudents();
    return list.length > 0 ? list[0].id : '';
  });

  // 3. Modals State
  const [isPraiseModalOpen, setIsPraiseModalOpen] = useState(false);
  const [praiseTargetStudentId, setPraiseTargetStudentId] = useState<string | undefined>(undefined);
  const [isStudentManageOpen, setIsStudentManageOpen] = useState(false);
  const [isDataBackupOpen, setIsDataBackupOpen] = useState(false);

  // 4. Celebration Animation State
  const [celebrationData, setCelebrationData] = useState<{
    studentName: string;
    points: number;
    reason: string;
  } | null>(null);

  // 5. Computed Summaries (Always in sync with records)
  const summaries = useMemo(() => {
    return students.map((s) =>
      getStudentGrowthSummary(s, records, settings.badgeThresholds)
    );
  }, [students, records, settings.badgeThresholds]);

  // Handler: Add praise or deduction record
  const handleSavePraise = (newRec: Omit<PraiseRecord, 'id' | 'timestamp'>) => {
    const record: PraiseRecord = {
      ...newRec,
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    const nextRecords = [record, ...records];
    setRecords(nextRecords);
    saveRecords(nextRecords);

    // If positive points, trigger joyful pink celebration animation!
    if (record.points > 0) {
      setCelebrationData({
        studentName: record.studentName,
        points: record.points,
        reason: record.reason,
      });
    }

    // Google Sheets Auto Sync
    if (settings.googleSheetUrl && (settings.autoSyncToSheet ?? true)) {
      const student = students.find((s) => s.id === record.studentId);
      sendRecordToGoogleSheet(
        settings.googleSheetUrl,
        record,
        student?.studentNumber
      ).catch((err) => {
        console.error('Google Sheet auto-sync error:', err);
      });
    }
  };

  // Handler: Update existing record
  const handleUpdateRecord = (updatedRecord: PraiseRecord): boolean => {
    const otherPoints = records
      .filter((r) => r.studentId === updatedRecord.studentId && r.id !== updatedRecord.id)
      .reduce((sum, r) => sum + r.points, 0);

    if (otherPoints + updatedRecord.points < 0) {
      alert('점수를 변경하면 학생의 누적 점수가 0점 미만(음수)이 되므로 수정할 수 없습니다.');
      return false;
    }

    const nextRecords = records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r));
    setRecords(nextRecords);
    saveRecords(nextRecords);
    return true;
  };

  // Handler: Delete record
  const handleDeleteRecord = (recordId: string): boolean => {
    const target = records.find((r) => r.id === recordId);
    if (!target) return false;

    const remainingPoints = records
      .filter((r) => r.studentId === target.studentId && r.id !== recordId)
      .reduce((sum, r) => sum + r.points, 0);

    if (remainingPoints < 0) {
      alert('이 기록을 삭제하면 학생의 누적 점수가 0점 미만(음수)이 되므로 삭제할 수 없습니다.');
      return false;
    }

    const nextRecords = records.filter((r) => r.id !== recordId);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    return true;
  };

  // Handler: Add Student
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };

    const nextStudents = [...students, newStudent].sort(
      (a, b) => a.studentNumber - b.studentNumber
    );
    setStudents(nextStudents);
    saveStudents(nextStudents);

    if (!selectedGardenStudentId) {
      setSelectedGardenStudentId(newStudent.id);
    }
  };

  // Handler: Update Student
  const handleUpdateStudent = (updatedStudent: Student) => {
    const nextStudents = students
      .map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      .sort((a, b) => a.studentNumber - b.studentNumber);
    setStudents(nextStudents);
    saveStudents(nextStudents);

    const nextRecords = records.map((r) =>
      r.studentId === updatedStudent.id ? { ...r, studentName: updatedStudent.name } : r
    );
    setRecords(nextRecords);
    saveRecords(nextRecords);
  };

  // Handler: Delete Student
  const handleDeleteStudent = (studentId: string) => {
    const nextStudents = students.filter((s) => s.id !== studentId);
    setStudents(nextStudents);
    saveStudents(nextStudents);

    const nextRecords = records.filter((r) => r.studentId !== studentId);
    setRecords(nextRecords);
    saveRecords(nextRecords);

    if (selectedGardenStudentId === studentId) {
      setSelectedGardenStudentId(nextStudents.length > 0 ? nextStudents[0].id : '');
    }
  };

  // Handler: Update Cheer Message
  const handleUpdateCheerMessage = (studentId: string, newMessage: string) => {
    const nextStudents = students.map((s) =>
      s.id === studentId ? { ...s, cheerMessage: newMessage } : s
    );
    setStudents(nextStudents);
    saveStudents(nextStudents);
  };

  // Handler: Update Class Settings
  const handleUpdateSettings = (newSettings: ClassSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Handler: Restore backup from JSON
  const handleRestoreBackup = (data: {
    students: Student[];
    records: PraiseRecord[];
    settings: ClassSettings;
  }) => {
    setStudents(data.students);
    saveStudents(data.students);
    setRecords(data.records);
    saveRecords(data.records);
    setSettings(data.settings);
    saveSettings(data.settings);
    if (data.students.length > 0) {
      setSelectedGardenStudentId(data.students[0].id);
    }
  };

  // Handler: Reset to 24 sample students
  const handleResetToSample = () => {
    const result = resetToSampleData();
    setStudents(result.students);
    setRecords(result.records);
    setSettings(result.settings);
    setSelectedGardenStudentId(result.students[0].id);
  };

  // Handler: Clear all data
  const handleClearAll = () => {
    const result = clearAllData();
    setStudents(result.students);
    setRecords(result.records);
    setSettings(result.settings);
    setSelectedGardenStudentId('');
  };

  // Quick action: Open praise modal for a student
  const openPraiseForStudent = (studentId?: string) => {
    setPraiseTargetStudentId(studentId || (students.length > 0 ? students[0].id : undefined));
    setIsPraiseModalOpen(true);
  };

  // View specific student's garden
  const viewStudentGarden = (studentId: string) => {
    setSelectedGardenStudentId(studentId);
    setActiveTab('garden');
  };

  // Handle clicking the "칭찬하기" tab in navigation
  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'praise') {
      openPraiseForStudent(selectedGardenStudentId || (students[0]?.id));
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-slate-800 flex flex-col font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* 1. Global Navigation Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        classNameTitle={settings.className}
        onOpenStudentManage={() => setIsStudentManageOpen(true)}
        onOpenDataBackup={() => setIsDataBackupOpen(true)}
        onQuickPraise={() => openPraiseForStudent()}
      />

      {/* 2. Main Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <ClassHome
            students={students}
            records={records}
            summaries={summaries}
            classNameTitle={settings.className}
            teacherName={settings.teacherName}
            onOpenPraiseModal={openPraiseForStudent}
            onViewStudentGarden={viewStudentGarden}
            onNavigateToTab={(t) => handleSelectTab(t)}
            onOpenStudentManage={() => setIsStudentManageOpen(true)}
          />
        )}

        {activeTab === 'garden' && (
          <GrowthGardenView
            students={students}
            records={records}
            summaries={summaries}
            selectedStudentId={selectedGardenStudentId}
            onSelectStudent={(id) => setSelectedGardenStudentId(id)}
            onOpenPraiseModal={openPraiseForStudent}
            onUpdateCheerMessage={handleUpdateCheerMessage}
          />
        )}

        {activeTab === 'logbook' && (
          <RecordLogbookView
            records={records}
            students={students}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}
      </main>

      {/* 3. Footer (Pink Pastel) */}
      <footer className="border-t border-pink-200/60 bg-[#FFF5F7] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-pink-700">매일매일 성장기록</span>
            <span aria-hidden="true">·</span>
            <span>{settings.schoolName || '초등학교'} {settings.className} (학생 {students.length}명)</span>
          </div>
          <div className="flex items-center gap-2 text-pink-600">
            <span>아이들의 핑크빛 꿈과 노력을 온 마음으로 응원합니다</span>
            <Heart size={14} className="text-pink-500 fill-pink-400" />
            <Sparkles size={14} className="text-rose-400" />
          </div>
        </div>
      </footer>

      {/* 4. Modals & Portals */}
      <PraiseModal
        students={students}
        records={records}
        initialStudentId={praiseTargetStudentId}
        isOpen={isPraiseModalOpen}
        onClose={() => setIsPraiseModalOpen(false)}
        onSave={handleSavePraise}
      />

      <StudentManageModal
        isOpen={isStudentManageOpen}
        onClose={() => setIsStudentManageOpen(false)}
        students={students}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        onDeleteStudent={handleDeleteStudent}
        onResetToSampleData={handleResetToSample}
        onClearAllStudents={handleClearAll}
      />

      <DataBackupModal
        isOpen={isDataBackupOpen}
        onClose={() => setIsDataBackupOpen(false)}
        students={students}
        records={records}
        settings={settings}
        summaries={summaries}
        onUpdateSettings={handleUpdateSettings}
        onRestoreBackup={handleRestoreBackup}
        onDataReset={handleClearAll}
      />

      {celebrationData && (
        <StarCelebration
          studentName={celebrationData.studentName}
          points={celebrationData.points}
          reason={celebrationData.reason}
          onClose={() => setCelebrationData(null)}
        />
      )}
    </div>
  );
}
