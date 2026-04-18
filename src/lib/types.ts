// =============================================================================
// JobTrack Types - 求职申请管理看板
// =============================================================================

/** 投递渠道 */
export type Platform =
  | "boss"
  | "niuke"
  | "official"
  | "referral"
  | "other";

/** 申请进度阶段 */
export type Stage =
  | "applied"      // 已投递
  | "written"      // 笔试中
  | "interview1"   // 初面
  | "interview2"   // 二面
  | "final"        // 终面
  | "offer"        // 已 Offer
  | "rejected"     // 已拒绝/挂掉
  | "withdrawn";   // 自己撤了

/** 面试表现评级 */
export type Performance = "great" | "good" | "ok" | "bad";

/** 面试复盘记录 */
export interface InterviewLog {
  id: string;
  stage: string;           // 哪一轮，如 "初面"、"技术面"、"HR面"
  date: Date;
  questions: string[];     // 被问到的问题列表
  performance: Performance;
  reflection: string;      // 自我反思
  interviewerStyle?: string; // 面试官风格（亲和/压力/深挖等）
}

/** 求职申请主体 */
export interface Application {
  id: string;
  company: string;         // 公司名
  position: string;        // 岗位名
  platform: Platform;      // 投递渠道
  appliedAt: Date;        // 投递日期
  stage: Stage;           // 当前阶段
  sortOrder: number;       // 同阶段内的排序权重
  nextDeadline?: Date;    // 下一步截止时间
  nextAction?: string;     // 下一步要做的事，如"准备算法面"
  resumeVersion?: string;  // 简历版本标签，如 "V2.1-投递版"
  notes?: string;          // 备注
  interviewLogs: InterviewLog[]; // 面试复盘记录
  createdAt: Date;
  updatedAt: Date;
}

/** 统计数据（派生数据） */
export interface Stats {
  total: number;
  interviewing: number;    // 面试中（interview1 + interview2 + final）
  offer: number;
  rejected: number;
  interviewRate: number;   // 面试转化率 = interviewCount / total
}

/** 冲突日期（同日多场面试） */
export interface ConflictGroup {
  date: string;            // ISO 日期字符串 YYYY-MM-DD
  applications: Application[];
}

/** UI 用到的 Stage 配置 */
export interface StageConfig {
  key: Stage;
  label: string;
  color: string;
}

export const STAGE_CONFIG: StageConfig[] = [
  { key: "applied",    label: "已投递",    color: "#6F7177" },
  { key: "written",    label: "笔试中",    color: "#D97706" },
  { key: "interview1", label: "初面",      color: "#5E6AD2" },
  { key: "interview2", label: "二面",      color: "#5E6AD2" },
  { key: "final",      label: "终面",      color: "#7C3AED" },
  { key: "offer",      label: "Offer",    color: "#059669" },
  { key: "rejected",   label: "已结束",    color: "#B4B6BA" },
  { key: "withdrawn",  label: "已撤回",    color: "#B4B6BA" },
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  boss: "BOSS 直聘",
  niuke: "牛客",
  official: "官网投递",
  referral: "内推",
  other: "其他",
};

export const PERFORMANCE_LABELS: Record<Performance, string> = {
  great: "表现出色",
  good: "良好",
  ok: "一般",
  bad: "不太行",
};
