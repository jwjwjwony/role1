/**
 * 매일매일 성장기록 - 타입 정의
 */

export type GrowthStageId = 'sprout' | 'sapling' | 'tree' | 'flowering_tree';

export interface GrowthStageInfo {
  id: GrowthStageId;
  name: string;
  minPoints: number;
  maxPoints: number;
  nextThreshold: number | null;
  description: string;
  badgeTitle: string;
  iconName: string;
  color: string;
}

export type BadgeId = 'kind_heart' | 'courageous_step' | 'steady_effort' | 'responsible_act';

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  categoryMatch: string[];
  icon: string;
  color: string;
  bgLight: string;
  targetCount: number;
}

export interface Student {
  id: string;
  name: string;
  studentNumber: number;
  avatar: string; // 'rabbit' | 'bear' | 'cat' | 'dog' | 'chick' | 'panda' | 'hamster' | 'fox'
  cheerMessage: string;
  createdAt: string;
}

export type PraiseCategory =
  | 'kindness' // 친구를 도왔어요
  | 'participation' // 수업에 열심히 참여했어요
  | 'effort' // 스스로 노력했어요
  | 'responsibility' // 책임감 있게 행동했어요, 약속을 잘 지켰어요
  | 'courage' // 어려운 일에 도전했어요
  | 'custom' // 직접 입력
  | 'adjustment'; // 포인트 수정/차감

export interface PraiseRecord {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  category: PraiseCategory;
  points: number; // +2, +3, or negative like -1
  memo: string;
  timestamp: string; // ISO 8601 string
}

export interface ClassSettings {
  className: string;
  teacherName: string;
  schoolName: string;
  badgeThresholds: Record<BadgeId, number>; // default 3
  googleSheetUrl?: string; // Google Apps Script Web App URL
  autoSyncToSheet?: boolean; // 새 칭찬 등록 시 자동 시트 전송 여부
}

export interface StudentGrowthSummary {
  student: Student;
  totalPoints: number;
  stage: GrowthStageInfo;
  pointsToNext: number;
  progressPercent: number;
  earnedBadges: {
    badge: BadgeDefinition;
    count: number;
    isEarned: boolean;
  }[];
  recentRecords: PraiseRecord[];
}
