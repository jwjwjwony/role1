import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Award,
  Search,
  Plus,
  ArrowRight,
  Heart,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { PraiseRecord, Student, StudentGrowthSummary } from '../types/growth';
import { AVATAR_OPTIONS, getTodayStats } from '../utils/storage';

interface ClassHomeProps {
  students: Student[];
  records: PraiseRecord[];
  summaries: StudentGrowthSummary[];
  classNameTitle: string;
  teacherName: string;
  onOpenPraiseModal: (studentId?: string) => void;
  onViewStudentGarden: (studentId: string) => void;
  onNavigateToTab: (tab: 'praise' | 'garden' | 'logbook') => void;
  onOpenStudentManage: () => void;
}

export const ClassHome: React.FC<ClassHomeProps> = ({
  students,
  records,
  summaries,
  classNameTitle,
  teacherName,
  onOpenPraiseModal,
  onViewStudentGarden,
  onNavigateToTab,
  onOpenStudentManage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const { praiseCount: todayPraiseCount, pointsAwarded: todayPointsAwarded } = getTodayStats(records);

  // Filter students based on search and optional stage
  const filteredSummaries = summaries.filter((item) => {
    const matchesSearch =
      item.student.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      String(item.student.studentNumber).includes(searchTerm.trim());
    const matchesStage = stageFilter === 'all' || item.stage.id === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Recent 5 praises
  const recentPraises = [...records]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getStageColorBadge = (stageId: string) => {
    switch (stageId) {
      case 'sprout':
        return 'text-pink-700 bg-pink-100/90 border border-pink-200';
      case 'sapling':
        return 'text-rose-700 bg-rose-100/90 border border-rose-200';
      case 'tree':
        return 'text-fuchsia-800 bg-fuchsia-100/90 border border-fuchsia-200';
      case 'flowering_tree':
        return 'text-pink-800 bg-gradient-to-r from-pink-200 to-rose-200 font-extrabold border border-pink-300';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Greeting Banner (Pink Pastel) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-100/90 via-rose-100/60 to-pink-50 p-6 sm:p-8 border border-pink-200 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-pink-700">
            <span>{classNameTitle}</span>
            <span aria-hidden="true">·</span>
            <span>{teacherName}</span>
            <span aria-hidden="true">·</span>
            <span>총 {students.length}명의 꿈나무</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2">
            오늘도 아이들의 작은 노력에 <br className="hidden sm:inline" />
            <span className="text-pink-600">사랑 가득한 칭찬의 꽃</span>을 피워주세요.
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            비교와 경쟁 대신, 24명 학생 한 명 한 명의 고유한 성장 과정을 함께 지켜보고 응원하는 핑크빛 성장 정원입니다.
          </p>
        </div>

        {/* Decorative subtle background illustration icons */}
        <div className="absolute right-4 -bottom-6 text-pink-300/30 pointer-events-none select-none hidden md:block">
          <Heart size={200} className="fill-pink-200" />
        </div>
      </section>

      {/* 2. Key Stats Strip (3 Cards - Pink Theme) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">우리 반 학생 수</span>
            <div className="text-3xl font-black text-slate-800 tabular-nums">
              {students.length}
              <span className="text-sm font-semibold text-slate-500 ml-1">명</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500">
            <Users size={24} />
          </div>
        </div>

        {/* Today's Praise Count */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">오늘의 칭찬 횟수</span>
            <div className="text-3xl font-black text-pink-600 tabular-nums">
              {todayPraiseCount}
              <span className="text-sm font-semibold text-slate-500 ml-1">회</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <Sparkles size={24} />
          </div>
        </div>

        {/* Today's Points Awarded */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">오늘 선물한 포인트</span>
            <div className="text-3xl font-black text-fuchsia-600 tabular-nums">
              +{todayPointsAwarded}
              <span className="text-sm font-semibold text-slate-500 ml-1">P</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 border border-fuchsia-200 flex items-center justify-center text-fuchsia-500">
            <TrendingUp size={24} />
          </div>
        </div>
      </section>

      {/* 3. Student Profile Cards Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              우리 반 학생 성장 카드 <span className="text-pink-600 font-extrabold text-base">({filteredSummaries.length}/{students.length}명)</span>
            </h2>
            <p className="text-xs text-slate-500">학생을 클릭하여 정원을 둘러보거나 바로 칭찬할 수 있어요.</p>
          </div>

          {/* Controls: Search, Filter, Add */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="이름 또는 번호 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-pink-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 w-36 sm:w-44"
              />
            </div>

            {/* Stage Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border border-pink-200 rounded-xl">
              <button
                onClick={() => setStageFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  stageFilter === 'all'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setStageFilter('sprout')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  stageFilter === 'sprout'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                새싹
              </button>
              <button
                onClick={() => setStageFilter('sapling')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  stageFilter === 'sapling'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                어린나무
              </button>
              <button
                onClick={() => setStageFilter('tree')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  stageFilter === 'tree'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                큰나무
              </button>
              <button
                onClick={() => setStageFilter('flowering_tree')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  stageFilter === 'flowering_tree'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                꽃나무
              </button>
            </div>

            <button
              onClick={onOpenStudentManage}
              className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors border border-pink-200"
            >
              <Plus size={14} />
              <span>학생 관리</span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredSummaries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-200">
            <Users size={40} className="mx-auto text-pink-300 mb-3" />
            <p className="text-base font-bold text-slate-700">해당 조건의 학생이 없습니다.</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              검색어를 변경하거나 필터를 초기화해 보세요.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStageFilter('all');
              }}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              전체 학생 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSummaries.map((summary) => {
              const { student, totalPoints, stage, earnedBadges } = summary;
              const avatarDef = AVATAR_OPTIONS.find((a) => a.id === student.avatar) || AVATAR_OPTIONS[0];
              const unlockedBadges = earnedBadges.filter((b) => b.isEarned);
              const repBadge = unlockedBadges[0]?.badge;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-3xl p-5 border border-pink-200/80 hover:border-pink-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Avatar, Name, Number, Stage */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-11 h-11 rounded-2xl ${avatarDef.bg} flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          {avatarDef.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-400">
                              {student.studentNumber}번
                            </span>
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                              {student.name}
                            </h3>
                          </div>
                          <span
                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${getStageColorBadge(
                              stage.id
                            )}`}
                          >
                            {stage.name}
                          </span>
                        </div>
                      </div>

                      {/* Current Points */}
                      <div className="text-right">
                        <div className="text-xl font-black text-pink-600 tabular-nums">
                          {totalPoints}
                          <span className="text-xs font-bold text-pink-700 ml-0.5">P</span>
                        </div>
                        <span className="text-[10px] text-slate-400">누적</span>
                      </div>
                    </div>

                    {/* Representative Badges & Cheer Message */}
                    <div className="py-2.5 px-3 bg-[#FFF5F7] rounded-2xl border border-pink-100 mb-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium text-[11px]">대표 배지</span>
                        {repBadge ? (
                          <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Award size={13} className="text-pink-500" />
                            {repBadge.name}
                            {unlockedBadges.length > 1 && (
                              <span className="text-[10px] text-pink-600 font-semibold">
                                +{unlockedBadges.length - 1}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">배지 도전 중 ✨</span>
                        )}
                      </div>

                      {student.cheerMessage && (
                        <p className="text-[11px] text-slate-600 truncate italic">
                          "{student.cheerMessage}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Quick Praise & View Garden */}
                  <div className="flex items-center gap-2 pt-2 border-t border-pink-100">
                    <button
                      onClick={() => onOpenPraiseModal(student.id)}
                      className="flex-1 py-1.5 px-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
                    >
                      <Sparkles size={13} className="text-pink-500" />
                      <span>칭찬</span>
                    </button>
                    <button
                      onClick={() => onViewStudentGarden(student.id)}
                      className="flex-1 py-1.5 px-2.5 bg-white hover:bg-pink-50 text-slate-700 border border-pink-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>정원</span>
                      <ChevronRight size={13} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Recent Praise Feed (최근 칭찬 기록) */}
      <section className="bg-white rounded-3xl p-6 border border-pink-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-pink-500 fill-pink-300" />
            <h2 className="text-lg font-bold text-slate-900">최근 우리 반 칭찬 소식</h2>
          </div>
          <button
            onClick={() => onNavigateToTab('logbook')}
            className="text-xs font-bold text-pink-700 hover:text-pink-800 flex items-center gap-1"
          >
            <span>전체 기록장 보기</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentPraises.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">아직 칭찬 기록이 없습니다.</p>
        ) : (
          <div className="divide-y divide-pink-100">
            {recentPraises.map((rec) => {
              const formattedTime = new Date(rec.timestamp).toLocaleString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isPositive = rec.points > 0;

              return (
                <div
                  key={rec.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-pink-50/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-xs font-extrabold text-slate-800 shrink-0 bg-pink-100 px-2 py-0.5 rounded-md text-pink-900">
                      {rec.studentName}
                    </span>
                    <span className="text-xs text-slate-700 truncate">{rec.reason}</span>
                    {rec.memo && (
                      <span className="hidden sm:inline text-xs text-slate-400 truncate">
                        ({rec.memo})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400">{formattedTime}</span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-lg tabular-nums ${
                        isPositive
                          ? 'bg-pink-100 text-pink-800 border border-pink-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isPositive ? `+${rec.points}` : rec.points}P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
