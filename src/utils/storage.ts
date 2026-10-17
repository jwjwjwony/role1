/**
 * 매일매일 성장기록 - 스토리지 및 데이터 연산 유틸리티 (24명 학생 기본값 & 핑크 테마)
 */

import {
  BadgeDefinition,
  BadgeId,
  ClassSettings,
  GrowthStageId,
  GrowthStageInfo,
  PraiseRecord,
  Student,
  StudentGrowthSummary,
} from '../types/growth';

export const GROWTH_STAGES: Record<GrowthStageId, GrowthStageInfo> = {
  sprout: {
    id: 'sprout',
    name: '새싹',
    minPoints: 0,
    maxPoints: 9,
    nextThreshold: 10,
    description: '작은 씨앗에서 막 피어난 파릇파릇 귀여운 분홍빛 새싹이에요.',
    badgeTitle: '새싹 단계',
    iconName: 'sprout',
    color: '#EC4899', // pink
  },
  sapling: {
    id: 'sapling',
    name: '어린 나무',
    minPoints: 10,
    maxPoints: 24,
    nextThreshold: 25,
    description: '줄기가 단단해지고 연분홍 잎이 돋아난 사랑스러운 어린 나무예요.',
    badgeTitle: '어린 나무 단계',
    iconName: 'tree-pine',
    color: '#DB2777', // rose pink
  },
  tree: {
    id: 'tree',
    name: '큰 나무',
    minPoints: 25,
    maxPoints: 49,
    nextThreshold: 50,
    description: '깊은 뿌리와 풍성한 그늘을 드리운 늠름하고 멋진 큰 나무예요.',
    badgeTitle: '큰 나무 단계',
    iconName: 'trees',
    color: '#BE185D', // deep pink
  },
  flowering_tree: {
    id: 'flowering_tree',
    name: '꽃나무',
    minPoints: 50,
    maxPoints: Infinity,
    nextThreshold: null,
    description: '온 세상이 화사해지는 분홍빛 벚꽃과 황금빛 별 열매가 만개한 꽃나무예요!',
    badgeTitle: '꽃나무 단계',
    iconName: 'flower-2',
    color: '#F43F5E', // vibrant rose
  },
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'kind_heart',
    name: '친절한 마음',
    description: '친구를 따뜻하게 돕고 배려하는 착한 마음',
    categoryMatch: ['kindness'],
    icon: 'heart',
    color: '#F43F5E',
    bgLight: '#FFE4E6',
    targetCount: 3,
  },
  {
    id: 'courageous_step',
    name: '도전하는 용기',
    description: '새롭고 어려운 일에도 포기하지 않고 도전하는 씩씩함',
    categoryMatch: ['courage'],
    icon: 'sparkles',
    color: '#FB7185',
    bgLight: '#FFF1F2',
    targetCount: 3,
  },
  {
    id: 'steady_effort',
    name: '꾸준한 노력',
    description: '수업에 적극적으로 참여하고 스스로 끈기 있게 노력하는 모습',
    categoryMatch: ['effort', 'participation'],
    icon: 'star',
    color: '#EC4899',
    bgLight: '#FDF2F8',
    targetCount: 3,
  },
  {
    id: 'responsible_act',
    name: '책임감 있는 행동',
    description: '맡은 일에 책임을 다하고 약속을 성실히 지키는 믿음직함',
    categoryMatch: ['responsibility'],
    icon: 'shield-check',
    color: '#D946EF',
    bgLight: '#FAE8FF',
    targetCount: 3,
  },
];

export const PRESET_PRAISES = [
  {
    reason: '친구를 도왔어요',
    points: 2,
    category: 'kindness' as const,
    icon: 'heart',
    color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
  },
  {
    reason: '수업에 열심히 참여했어요',
    points: 2,
    category: 'participation' as const,
    icon: 'book-open',
    color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
  },
  {
    reason: '스스로 노력했어요',
    points: 3,
    category: 'effort' as const,
    icon: 'flame',
    color: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-100',
  },
  {
    reason: '책임감 있게 행동했어요',
    points: 2,
    category: 'responsibility' as const,
    icon: 'check-circle-2',
    color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
  },
  {
    reason: '어려운 일에 도전했어요',
    points: 3,
    category: 'courage' as const,
    icon: 'trophy',
    color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
  },
  {
    reason: '약속을 잘 지켰어요',
    points: 2,
    category: 'responsibility' as const,
    icon: 'handshake',
    color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
  },
];

export const AVATAR_OPTIONS = [
  { id: 'rabbit', label: '토끼', emoji: '🐰', bg: 'bg-pink-100' },
  { id: 'bear', label: '곰', emoji: '🐻', bg: 'bg-rose-100' },
  { id: 'cat', label: '고양이', emoji: '🐱', bg: 'bg-pink-100' },
  { id: 'dog', label: '강아지', emoji: '🐶', bg: 'bg-fuchsia-100' },
  { id: 'chick', label: '병아리', emoji: '🐥', bg: 'bg-amber-100' },
  { id: 'panda', label: '판다', emoji: '🐼', bg: 'bg-pink-50' },
  { id: 'fox', label: '여우', emoji: '🦊', bg: 'bg-rose-100' },
  { id: 'hamster', label: '햄스터', emoji: '🐹', bg: 'bg-pink-100' },
];

export const INITIAL_SETTINGS: ClassSettings = {
  className: '사랑가득 3학년 2반',
  teacherName: '김민주 선생님',
  schoolName: '꿈나무초등학교',
  badgeThresholds: {
    kind_heart: 3,
    courageous_step: 3,
    steady_effort: 3,
    responsible_act: 3,
  },
};

// 24명의 기본 학생 데이터 (1번부터 24번까지)
export const INITIAL_STUDENTS: Student[] = [
  { id: 'stu-1', name: '김민준', studentNumber: 1, avatar: 'rabbit', cheerMessage: '항상 밝은 미소로 수업을 빛내주는 멋진 학생!', createdAt: new Date().toISOString() },
  { id: 'stu-2', name: '이서연', studentNumber: 2, avatar: 'chick', cheerMessage: '친구들을 먼저 배려하고 돕는 따뜻한 마음씨가 최고예요.', createdAt: new Date().toISOString() },
  { id: 'stu-3', name: '박도윤', studentNumber: 3, avatar: 'bear', cheerMessage: '어려운 일에도 씩씩하게 도전하는 용기가 멋져요.', createdAt: new Date().toISOString() },
  { id: 'stu-4', name: '최지우', studentNumber: 4, avatar: 'cat', cheerMessage: '주어진 역할을 끝까지 성실하게 완수하는 든든한 학급의 보물!', createdAt: new Date().toISOString() },
  { id: 'stu-5', name: '정하은', studentNumber: 5, avatar: 'dog', cheerMessage: '모둠 활동에서 친구들의 이야기를 귀담아듣고 멋진 아이디어를 내요.', createdAt: new Date().toISOString() },
  { id: 'stu-6', name: '강시우', studentNumber: 6, avatar: 'fox', cheerMessage: '체육 시간에 친구들을 응원하며 팀워크를 북돋워 줘요.', createdAt: new Date().toISOString() },
  { id: 'stu-7', name: '조유진', studentNumber: 7, avatar: 'hamster', cheerMessage: '책을 사랑하고 깊이 생각하는 모습이 참 아름다워요.', createdAt: new Date().toISOString() },
  { id: 'stu-8', name: '윤예준', studentNumber: 8, avatar: 'panda', cheerMessage: '스스로 학습 목표를 세우고 꾸준히 노력하는 멋쟁이!', createdAt: new Date().toISOString() },
  { id: 'stu-9', name: '장채원', studentNumber: 9, avatar: 'rabbit', cheerMessage: '교실 청결에 앞장서며 주변을 환하게 만들어 줍니다.', createdAt: new Date().toISOString() },
  { id: 'stu-10', name: '임서진', studentNumber: 10, avatar: 'bear', cheerMessage: '질문을 두려워하지 않고 끊임없이 탐구하는 열정!', createdAt: new Date().toISOString() },
  { id: 'stu-11', name: '한지호', studentNumber: 11, avatar: 'cat', cheerMessage: '힘들어하는 친구에게 먼저 손을 내미는 고운 마음씨.', createdAt: new Date().toISOString() },
  { id: 'stu-12', name: '오수아', studentNumber: 12, avatar: 'chick', cheerMessage: '매일 아침 밝은 인사로 선생님과 친구들의 하루를 열어줘요.', createdAt: new Date().toISOString() },
  { id: 'stu-13', name: '신태양', studentNumber: 13, avatar: 'dog', cheerMessage: '이름처럼 밝고 긍정적인 에너지로 교실을 가득 채워요.', createdAt: new Date().toISOString() },
  { id: 'stu-14', name: '배지민', studentNumber: 14, avatar: 'fox', cheerMessage: '발표할 때 자신감 넘치고 명확하게 생각을 표현해요.', createdAt: new Date().toISOString() },
  { id: 'stu-15', name: '백다은', studentNumber: 15, avatar: 'hamster', cheerMessage: '그림과 글씨에 정성을 담아내는 섬세하고 따뜻한 친구.', createdAt: new Date().toISOString() },
  { id: 'stu-16', name: '송우진', studentNumber: 16, avatar: 'panda', cheerMessage: '친구들과의 약속을 소중히 지키는 신뢰감 넘치는 친구!', createdAt: new Date().toISOString() },
  { id: 'stu-17', name: '류하윤', studentNumber: 17, avatar: 'rabbit', cheerMessage: '스스로 정리정돈을 잘하고 준비물을 꼼꼼히 챙겨요.', createdAt: new Date().toISOString() },
  { id: 'stu-18', name: '홍준서', studentNumber: 18, avatar: 'bear', cheerMessage: '어려운 수학 문제도 포기하지 않고 끈기 있게 풀어내요.', createdAt: new Date().toISOString() },
  { id: 'stu-19', name: '고은우', studentNumber: 19, avatar: 'cat', cheerMessage: '음악과 미술 활동에 열정적으로 참여하며 창의성을 발휘해요.', createdAt: new Date().toISOString() },
  { id: 'stu-20', name: '문소율', studentNumber: 20, avatar: 'chick', cheerMessage: '작은 것 하나에도 감사할 줄 아는 사랑스러운 마음씨.', createdAt: new Date().toISOString() },
  { id: 'stu-21', name: '양건우', studentNumber: 21, avatar: 'dog', cheerMessage: '줄을 잘 서고 복도에서 안전하게 걷는 규칙 지킴이!', createdAt: new Date().toISOString() },
  { id: 'stu-22', name: '손아린', studentNumber: 22, avatar: 'fox', cheerMessage: '친구들의 좋은 점을 먼저 찾아 칭찬해 주는 칭찬 요정.', createdAt: new Date().toISOString() },
  { id: 'stu-23', name: '황태호', studentNumber: 23, avatar: 'hamster', cheerMessage: '실험 활동에 호기심을 가지고 주도적으로 참여해요.', createdAt: new Date().toISOString() },
  { id: 'stu-24', name: '곽지안', studentNumber: 24, avatar: 'panda', cheerMessage: '하루하루 성실하게 자신의 꿈을 키워나가는 멋진 꿈나무!', createdAt: new Date().toISOString() },
];

// 초기 24명 학생들의 실감나는 칭찬 기록 샘플
export const INITIAL_RECORDS: PraiseRecord[] = [
  // 김민준: 18P (어린 나무)
  { id: 'r-1-1', studentId: 'stu-1', studentName: '김민준', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '발표를 씩씩하게 했어요.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'r-1-2', studentId: 'stu-1', studentName: '김민준', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '수학 문제 풀기 완료!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString() },
  { id: 'r-1-3', studentId: 'stu-1', studentName: '김민준', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '짝꿍 준비물을 함께 썼어요.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  { id: 'r-1-4', studentId: 'stu-1', studentName: '김민준', reason: '약속을 잘 지켰어요', category: 'responsibility', points: 2, memo: '숙제 제출 완료.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: 'r-1-5', studentId: 'stu-1', studentName: '김민준', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '줄넘기 연습에 열심!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'r-1-6', studentId: 'stu-1', studentName: '김민준', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '독서 기록장 성실 작성.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'r-1-7', studentId: 'stu-1', studentName: '김민준', reason: '수업에 열심히 참여했어요', category: 'participation', points: 3, memo: '과학 시간 집중 태도 훌륭.', timestamp: new Date().toISOString() },

  // 이서연: 32P (큰 나무 - 친절한 마음 배지 획득!)
  { id: 'r-2-1', studentId: 'stu-2', studentName: '이서연', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '급식실에서 친구를 도왔어요.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'r-2-2', studentId: 'stu-2', studentName: '이서연', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '넘어진 친구를 보건실로 안내했어요.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() },
  { id: 'r-2-3', studentId: 'stu-2', studentName: '이서연', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '청소 도구를 나누어 썼어요.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'r-2-4', studentId: 'stu-2', studentName: '이서연', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '영어 단어 외우기 성공.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString() },
  { id: 'r-2-5', studentId: 'stu-2', studentName: '이서연', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '학급 문고 정리.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { id: 'r-2-6', studentId: 'stu-2', studentName: '이서연', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '창작 동시 낭송 도전!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'r-2-7', studentId: 'stu-2', studentName: '이서연', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '음악 시간 리코더 연주.', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: 'r-2-8', studentId: 'stu-2', studentName: '이서연', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '단원평가 스스로 오답정리.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'r-2-9', studentId: 'stu-2', studentName: '이서연', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '우유 당번 완벽 수행.', timestamp: new Date().toISOString() },

  // 박도윤: 8P (새싹)
  { id: 'r-3-1', studentId: 'stu-3', studentName: '박도윤', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '수학 심화문제 도전 성공!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: 'r-3-2', studentId: 'stu-3', studentName: '박도윤', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '체육 시간 정정당당한 태도.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { id: 'r-3-3', studentId: 'stu-3', studentName: '박도윤', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '새로운 모둠장 역할 도전.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() },

  // 최지우: 54P (꽃나무 - 최고 단계!)
  { id: 'r-4-1', studentId: 'stu-4', studentName: '최지우', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '칠판 정리 당번.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString() },
  { id: 'r-4-2', studentId: 'stu-4', studentName: '최지우', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '분리수거 지도.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
  { id: 'r-4-3', studentId: 'stu-4', studentName: '최지우', reason: '약속을 잘 지켰어요', category: 'responsibility', points: 2, memo: '시간 약속 준수.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString() },
  { id: 'r-4-4', studentId: 'stu-4', studentName: '최지우', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '동생 손잡아주기.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
  { id: 'r-4-5', studentId: 'stu-4', studentName: '최지우', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '우산 함께 쓰기.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: 'r-4-6', studentId: 'stu-4', studentName: '최지우', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '짐 들어주기.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString() },
  { id: 'r-4-7', studentId: 'stu-4', studentName: '최지우', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '아침 독서 10분 매일 실천.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
  { id: 'r-4-8', studentId: 'stu-4', studentName: '최지우', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '경청하는 훌륭한 자세.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 'r-4-9', studentId: 'stu-4', studentName: '최지우', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '받아쓰기 복습.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'r-4-10', studentId: 'stu-4', studentName: '최지우', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '전교 임원 선거 도전!', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'r-4-11', studentId: 'stu-4', studentName: '최지우', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '뜀틀 넘기 성공.', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
  { id: 'r-4-12', studentId: 'stu-4', studentName: '최지우', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '동화구연 대회 발표.', timestamp: new Date().toISOString() },

  // 5번 ~ 24번 학생들에게도 고루 포인트 기록 배분
  { id: 'r-5-1', studentId: 'stu-5', studentName: '정하은', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '예쁜 글씨 연습.', timestamp: new Date().toISOString() },
  { id: 'r-5-2', studentId: 'stu-5', studentName: '정하은', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '가위 빌려주기.', timestamp: new Date().toISOString() },
  { id: 'r-5-3', studentId: 'stu-5', studentName: '정하은', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '모둠 토의 주도.', timestamp: new Date().toISOString() },

  { id: 'r-6-1', studentId: 'stu-6', studentName: '강시우', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '피구 경기에서 끝까지 방어.', timestamp: new Date().toISOString() },
  { id: 'r-6-2', studentId: 'stu-6', studentName: '강시우', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '다친 친구를 위로해 줬어요.', timestamp: new Date().toISOString() },

  { id: 'r-7-1', studentId: 'stu-7', studentName: '조유진', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '도서관 책 읽기 완료.', timestamp: new Date().toISOString() },
  { id: 'r-7-2', studentId: 'stu-7', studentName: '조유진', reason: '약속을 잘 지켰어요', category: 'responsibility', points: 2, memo: '도서 반납 기한 준수.', timestamp: new Date().toISOString() },

  { id: 'r-8-1', studentId: 'stu-8', studentName: '윤예준', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '사회 시간 지도 탐색.', timestamp: new Date().toISOString() },
  { id: 'r-8-2', studentId: 'stu-8', studentName: '윤예준', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '아침 자습 훌륭.', timestamp: new Date().toISOString() },

  { id: 'r-9-1', studentId: 'stu-9', studentName: '장채원', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '교실 환기 및 청소.', timestamp: new Date().toISOString() },
  { id: 'r-9-2', studentId: 'stu-9', studentName: '장채원', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '빗자루 정리 돕기.', timestamp: new Date().toISOString() },

  { id: 'r-10-1', studentId: 'stu-10', studentName: '임서진', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '어려운 과학 퀴즈 정답!', timestamp: new Date().toISOString() },

  { id: 'r-11-1', studentId: 'stu-11', studentName: '한지호', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '새 친구에게 친절히 안내.', timestamp: new Date().toISOString() },
  { id: 'r-11-2', studentId: 'stu-11', studentName: '한지호', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '수학 숙제 꼼꼼히 해결.', timestamp: new Date().toISOString() },

  { id: 'r-12-1', studentId: 'stu-12', studentName: '오수아', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '바른 자세로 인사하기.', timestamp: new Date().toISOString() },
  { id: 'r-12-2', studentId: 'stu-12', studentName: '오수아', reason: '약속을 잘 지켰어요', category: 'responsibility', points: 2, memo: '시간 맞춰 착석.', timestamp: new Date().toISOString() },

  { id: 'r-13-1', studentId: 'stu-13', studentName: '신태양', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '발표 준비 정성껏 함.', timestamp: new Date().toISOString() },
  { id: 'r-13-2', studentId: 'stu-13', studentName: '신태양', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '친구 응원해 주기.', timestamp: new Date().toISOString() },

  { id: 'r-14-1', studentId: 'stu-14', studentName: '배지민', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '영어 발표 씩씩하게 완료.', timestamp: new Date().toISOString() },

  { id: 'r-15-1', studentId: 'stu-15', studentName: '백다은', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '미술 작품 완성도 높음.', timestamp: new Date().toISOString() },
  { id: 'r-15-2', studentId: 'stu-15', studentName: '백다은', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '물감 도구 세척 및 정리.', timestamp: new Date().toISOString() },

  { id: 'r-16-1', studentId: 'stu-16', studentName: '송우진', reason: '약속을 잘 지켰어요', category: 'responsibility', points: 2, memo: '체육관 뒷정리 약속 준수.', timestamp: new Date().toISOString() },
  { id: 'r-16-2', studentId: 'stu-16', studentName: '송우진', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '공 주워주기.', timestamp: new Date().toISOString() },

  { id: 'r-17-1', studentId: 'stu-17', studentName: '류하윤', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '사물함 정리 정돈.', timestamp: new Date().toISOString() },

  { id: 'r-18-1', studentId: 'stu-18', studentName: '홍준서', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '분수 덧셈 도전 성공.', timestamp: new Date().toISOString() },
  { id: 'r-18-2', studentId: 'stu-18', studentName: '홍준서', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '손들고 질문하기.', timestamp: new Date().toISOString() },

  { id: 'r-19-1', studentId: 'stu-19', studentName: '고은우', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '리듬 악기 연주 훌륭.', timestamp: new Date().toISOString() },

  { id: 'r-20-1', studentId: 'stu-20', studentName: '문소율', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '색연필 빌려주기.', timestamp: new Date().toISOString() },
  { id: 'r-20-2', studentId: 'stu-20', studentName: '문소율', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '일기 정성껏 작성.', timestamp: new Date().toISOString() },

  { id: 'r-21-1', studentId: 'stu-21', studentName: '양건우', reason: '책임감 있게 행동했어요', category: 'responsibility', points: 2, memo: '신발장 정리 바르게 함.', timestamp: new Date().toISOString() },

  { id: 'r-22-1', studentId: 'stu-22', studentName: '손아린', reason: '친구를 도왔어요', category: 'kindness', points: 2, memo: '친구에게 따뜻한 칭찬 건네기.', timestamp: new Date().toISOString() },
  { id: 'r-22-2', studentId: 'stu-22', studentName: '손아린', reason: '약속을 잘 지켰어요', category: 'responsibility', points: 2, memo: '복도에서 조용히 걷기.', timestamp: new Date().toISOString() },

  { id: 'r-23-1', studentId: 'stu-23', studentName: '황태호', reason: '어려운 일에 도전했어요', category: 'courage', points: 3, memo: '새로운 실험 기구 다루기.', timestamp: new Date().toISOString() },

  { id: 'r-24-1', studentId: 'stu-24', studentName: '곽지안', reason: '스스로 노력했어요', category: 'effort', points: 3, memo: '하루 목표 스스로 달성.', timestamp: new Date().toISOString() },
  { id: 'r-24-2', studentId: 'stu-24', studentName: '곽지안', reason: '수업에 열심히 참여했어요', category: 'participation', points: 2, memo: '선생님 말씀에 집중하기.', timestamp: new Date().toISOString() },
];

const STORAGE_KEYS = {
  STUDENTS: 'daily_growth_students_v2_pink',
  RECORDS: 'daily_growth_records_v2_pink',
  SETTINGS: 'daily_growth_settings_v2_pink',
};

export function loadSettings(): ClassSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return INITIAL_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: ClassSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (err) {
    console.error('Failed to load students:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students:', err);
  }
}

export function loadRecords(): PraiseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_RECORDS;
  } catch (err) {
    console.error('Failed to load records:', err);
    return INITIAL_RECORDS;
  }
}

export function saveRecords(records: PraiseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records:', err);
  }
}

/**
 * 학생별 누적 포인트 계산 (기록 기준 원천 합산)
 */
export function calculateStudentPoints(records: PraiseRecord[], studentId: string): number {
  return records
    .filter((r) => r.studentId === studentId)
    .reduce((sum, r) => sum + (Number(r.points) || 0), 0);
}

/**
 * 포인트에 따른 성장 단계 반환
 */
export function getGrowthStage(points: number): GrowthStageInfo {
  const safePoints = Math.max(0, points);
  if (safePoints >= 50) return GROWTH_STAGES.flowering_tree;
  if (safePoints >= 25) return GROWTH_STAGES.tree;
  if (safePoints >= 10) return GROWTH_STAGES.sapling;
  return GROWTH_STAGES.sprout;
}

/**
 * 다음 단계까지 남은 포인트 및 진행률(%) 계산
 */
export function calculateStageProgress(points: number) {
  const safePoints = Math.max(0, points);
  const stage = getGrowthStage(safePoints);

  if (!stage.nextThreshold) {
    return {
      pointsToNext: 0,
      progressPercent: 100,
      isMaxLevel: true,
      currentSpan: safePoints - 50,
      totalSpan: 50,
    };
  }

  const rangeStart = stage.minPoints;
  const rangeEnd = stage.nextThreshold;
  const currentInTier = safePoints - rangeStart;
  const totalInTier = rangeEnd - rangeStart;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInTier / totalInTier) * 100)));
  const pointsToNext = rangeEnd - safePoints;

  return {
    pointsToNext,
    progressPercent,
    isMaxLevel: false,
    currentSpan: currentInTier,
    totalSpan: totalInTier,
  };
}

/**
 * 학생별 배지 획득 여부 계산
 */
export function calculateBadges(
  records: PraiseRecord[],
  studentId: string,
  thresholds: Record<BadgeId, number> = INITIAL_SETTINGS.badgeThresholds
) {
  const studentRecords = records.filter((r) => r.studentId === studentId && r.points > 0);

  return BADGE_DEFINITIONS.map((badgeDef) => {
    const count = studentRecords.filter((r) => {
      if (badgeDef.categoryMatch.includes(r.category)) return true;
      if (badgeDef.id === 'kind_heart' && (r.reason.includes('친구') || r.reason.includes('도왔') || r.reason.includes('배려'))) return true;
      if (badgeDef.id === 'courageous_step' && (r.reason.includes('도전') || r.reason.includes('용기') || r.reason.includes('어려운'))) return true;
      if (badgeDef.id === 'steady_effort' && (r.reason.includes('노력') || r.reason.includes('참여') || r.reason.includes('스스로') || r.reason.includes('집중'))) return true;
      if (badgeDef.id === 'responsible_act' && (r.reason.includes('책임') || r.reason.includes('약속') || r.reason.includes('성실') || r.reason.includes('정리'))) return true;
      return false;
    }).length;

    const target = thresholds[badgeDef.id] ?? badgeDef.targetCount;
    const isEarned = count >= target;

    return {
      badge: { ...badgeDef, targetCount: target },
      count,
      isEarned,
    };
  });
}

/**
 * 학생의 전체 성장 요약 정보 생성
 */
export function getStudentGrowthSummary(
  student: Student,
  records: PraiseRecord[],
  thresholds?: Record<BadgeId, number>
): StudentGrowthSummary {
  const totalPoints = calculateStudentPoints(records, student.id);
  const stage = getGrowthStage(totalPoints);
  const { pointsToNext, progressPercent } = calculateStageProgress(totalPoints);
  const earnedBadges = calculateBadges(records, student.id, thresholds);
  const recentRecords = records
    .filter((r) => r.studentId === student.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return {
    student,
    totalPoints,
    stage,
    pointsToNext,
    progressPercent,
    earnedBadges,
    recentRecords,
  };
}

/**
 * 오늘 지급한 칭찬 건수 및 총 포인트 계산
 */
export function getTodayStats(records: PraiseRecord[]) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter((r) => r.timestamp.slice(0, 10) === todayStr && r.points > 0);
  const praiseCount = todayRecords.length;
  const pointsAwarded = todayRecords.reduce((sum, r) => sum + r.points, 0);

  return { praiseCount, pointsAwarded };
}

/**
 * JSON 전체 백업 내보내기
 */
export function exportBackupJson(
  students: Student[],
  records: PraiseRecord[],
  settings: ClassSettings
): void {
  const backupData = {
    version: '2.0',
    theme: 'pink',
    exportedAt: new Date().toISOString(),
    settings,
    students,
    records,
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const a = document.createElement('a');
  a.href = url;
  a.download = `매일매일성장기록_핑크_백업_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * JSON 백업 파일 불러오기 및 검증
 */
export function parseBackupJson(jsonString: string): {
  success: boolean;
  message: string;
  data?: { students: Student[]; records: PraiseRecord[]; settings: ClassSettings };
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.students) || !Array.isArray(parsed.records)) {
      return {
        success: false,
        message: '올바른 백업 파일 형식이 아닙니다 (학생 또는 기록 목록 누락).',
      };
    }

    return {
      success: true,
      message: `학생 ${parsed.students.length}명, 칭찬 기록 ${parsed.records.length}건을 성공적으로 확인했습니다.`,
      data: {
        students: parsed.students,
        records: parsed.records,
        settings: parsed.settings || INITIAL_SETTINGS,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: 'JSON 파일을 읽는 중 오류가 발생했습니다: ' + (err as Error).message,
    };
  }
}

/**
 * CSV 학생별 요약 내보내기 (Excel 한글 깨짐 방지 UTF-8 BOM 포함)
 */
export function exportStudentsSummaryCsv(summaries: StudentGrowthSummary[]): void {
  const headers = ['번호', '이름', '현재포인트', '성장단계', '다음단계까지', '획득배지수', '응원메시지'];
  const rows = summaries.map((s) => [
    s.student.studentNumber,
    `"${s.student.name.replace(/"/g, '""')}"`,
    s.totalPoints,
    `"${s.stage.name}"`,
    s.pointsToNext > 0 ? `${s.pointsToNext}P` : '최고단계',
    s.earnedBadges.filter((b) => b.isEarned).length,
    `"${(s.student.cheerMessage || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const a = document.createElement('a');
  a.href = url;
  a.download = `매일매일성장기록_학생별요약_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * CSV 전체 칭찬 기록 내보내기 (Excel 한글 깨짐 방지 UTF-8 BOM 포함)
 */
export function exportRecordsCsv(records: PraiseRecord[]): void {
  const headers = ['일시', '학생이름', '칭찬구분', '칭찬사유', '포인트', '선생님메모'];
  const sorted = [...records].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const rows = sorted.map((r) => {
    const formattedDate = new Date(r.timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return [
      `"${formattedDate}"`,
      `"${(r.studentName || '').replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${(r.reason || '').replace(/"/g, '""')}"`,
      r.points > 0 ? `+${r.points}` : r.points,
      `"${(r.memo || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const a = document.createElement('a');
  a.href = url;
  a.download = `매일매일성장기록_전체기록_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 24명 기본 샘플 데이터 복원
 */
export function resetToSampleData(): {
  students: Student[];
  records: PraiseRecord[];
  settings: ClassSettings;
} {
  saveStudents(INITIAL_STUDENTS);
  saveRecords(INITIAL_RECORDS);
  saveSettings(INITIAL_SETTINGS);
  return {
    students: INITIAL_STUDENTS,
    records: INITIAL_RECORDS,
    settings: INITIAL_SETTINGS,
  };
}

/**
 * 전체 데이터 초기화 (모두 비우기)
 */
export function clearAllData(): {
  students: Student[];
  records: PraiseRecord[];
  settings: ClassSettings;
} {
  const emptyStudents: Student[] = [];
  const emptyRecords: PraiseRecord[] = [];
  saveStudents(emptyStudents);
  saveRecords(emptyRecords);
  return {
    students: emptyStudents,
    records: emptyRecords,
    settings: INITIAL_SETTINGS,
  };
}
