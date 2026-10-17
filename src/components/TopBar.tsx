import React from 'react';
import { Sparkles, Home, BookOpen, Settings, Users, TreePine, Heart } from 'lucide-react';

export type ActiveTab = 'home' | 'praise' | 'garden' | 'logbook';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  classNameTitle: string;
  onOpenStudentManage: () => void;
  onOpenDataBackup: () => void;
  onQuickPraise: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  classNameTitle,
  onOpenStudentManage,
  onOpenDataBackup,
  onQuickPraise,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFF5F7]/95 backdrop-blur-md border-b border-pink-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shadow-xs group-hover:scale-105 transition-transform">
                <Heart size={22} className="fill-pink-400 stroke-pink-600" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap group-hover:text-pink-600 transition-colors">
                  매일매일 성장기록
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">
                  {classNameTitle}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Pink Theme) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-pink-100/60'
              }`}
            >
              <Home size={17} />
              <span>우리 반 홈</span>
            </button>

            <button
              onClick={() => setActiveTab('praise')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'praise'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-pink-100/60'
              }`}
            >
              <Sparkles size={17} />
              <span>칭찬하기</span>
            </button>

            <button
              onClick={() => setActiveTab('garden')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'garden'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-pink-100/60'
              }`}
            >
              <TreePine size={17} />
              <span>나의 성장 정원</span>
            </button>

            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'logbook'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-pink-100/60'
              }`}
            >
              <BookOpen size={17} />
              <span>성장 기록장</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenStudentManage}
              title="학생 명단 관리 (총 24명)"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-pink-200 bg-white hover:bg-pink-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Users size={16} className="text-pink-600" />
              <span className="hidden sm:inline">학생 관리</span>
            </button>

            <button
              onClick={onOpenDataBackup}
              title="데이터 백업 및 내보내기"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-pink-200 bg-white hover:bg-pink-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Settings size={16} className="text-slate-500" />
              <span className="hidden sm:inline">백업/설정</span>
            </button>

            <button
              onClick={onQuickPraise}
              className="px-3.5 py-2 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles size={16} />
              <span>+ 칭찬하기</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden border-t border-pink-200/50 py-2 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 min-w-[76px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === 'home' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            우리 반 홈
          </button>
          <button
            onClick={() => setActiveTab('praise')}
            className={`flex-1 min-w-[76px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === 'praise' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            칭찬하기
          </button>
          <button
            onClick={() => setActiveTab('garden')}
            className={`flex-1 min-w-[84px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === 'garden' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            성장 정원
          </button>
          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex-1 min-w-[84px] py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === 'logbook' ? 'bg-pink-500 text-white' : 'text-slate-600'
            }`}
          >
            성장 기록장
          </button>
        </div>
      </div>
    </header>
  );
};
