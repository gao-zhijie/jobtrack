import { startOfWeek, endOfWeek, differenceInWeeks, format, subWeeks, isWithinInterval } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Application } from "./types";

export interface WeekStats {
  // 本周数据
  applied: number;
  interviews: number;
  offers: number;
  rejections: number;
  advances: { company: string; from: string; to: string }[];

  // 对比上周
  appliedDiff: number;
  interviewsDiff: number;

  // 下周预告
  upcomingInterviews: number;
  nextWeekHasEvents: boolean;

  // 亮点
  newOffers: { company: string }[];
  recentAdvances: { company: string; to: string }[];
  consecutiveRejections: number;

  // 时间信息
  weekNumber: number;
  dateRange: { start: string; end: string };
  isEmpty: boolean;

  // 寄语
  closingMessage: string;
}

export function calculateWeekReport(applications: Application[]): WeekStats {
  const today = new Date();

  // 本周时间范围（周一到周日）
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  // 上周时间范围
  const lastWeekStart = subWeeks(weekStart, 1);
  const lastWeekEnd = subWeeks(weekEnd, 1);

  // 计算求职开始后的第几周
  const earliestDate = applications.length > 0
    ? new Date(Math.min(...applications.map(a => new Date(a.appliedAt).getTime())))
    : today;
  const weekNumber = Math.max(1, differenceInWeeks(today, earliestDate) + 1);

  // 筛选本周数据
  const thisWeekApps = applications.filter(app =>
    isWithinInterval(new Date(app.appliedAt), { start: weekStart, end: weekEnd })
  );

  // 本周面试数（按面试日志）
  const thisWeekInterviews = new Set(
    applications
      .flatMap(app =>
        app.interviewLogs
          .filter(log => isWithinInterval(new Date(log.date), { start: weekStart, end: weekEnd }))
          .map(() => app.id)
      )
  ).size;

  // 本周新 Offer
  const thisWeekOffers = applications.filter(app =>
    app.stage === "offer" &&
    isWithinInterval(new Date(app.updatedAt), { start: weekStart, end: weekEnd })
  );

  // 本周新拒绝
  const thisWeekRejections = applications.filter(app =>
    (app.stage === "rejected" || app.stage === "withdrawn") &&
    isWithinInterval(new Date(app.updatedAt), { start: weekStart, end: weekEnd })
  );

  // 本周进阶（面试阶段往前推进的）
  const thisWeekAdvances: { company: string; from: string; to: string }[] = [];
  applications.forEach(app => {
    // 如果 updatedAt 在本周内，且当前阶段是面试阶段
    if (
      ["interview1", "interview2", "final", "offer"].includes(app.stage) &&
      isWithinInterval(new Date(app.updatedAt), { start: weekStart, end: weekEnd })
    ) {
      const log = app.interviewLogs[app.interviewLogs.length - 1];
      if (log) {
        thisWeekAdvances.push({
          company: app.company,
          from: log.stage,
          to: app.stage === "interview1" ? "初面" :
              app.stage === "interview2" ? "二面" :
              app.stage === "final" ? "终面" : "Offer"
        });
      }
    }
  });

  // 上周数据
  const lastWeekApplied = applications.filter(app =>
    isWithinInterval(new Date(app.appliedAt), { start: lastWeekStart, end: lastWeekEnd })
  ).length;

  const lastWeekInterviews = new Set(
    applications
      .flatMap(app =>
        app.interviewLogs
          .filter(log => isWithinInterval(new Date(log.date), { start: lastWeekStart, end: lastWeekEnd }))
          .map(() => app.id)
      )
  ).size;

  // 下周预告
  const nextWeekStart = new Date(weekEnd);
  nextWeekStart.setDate(nextWeekStart.getDate() + 1);
  const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });

  const upcomingInterviews = new Set(
    applications
      .flatMap(app =>
        app.interviewLogs
          .filter(log => isWithinInterval(new Date(log.date), { start: nextWeekStart, end: nextWeekEnd }))
          .map(() => app.id)
      )
  ).size;

  const nextWeekDeadlines = applications.filter(app =>
    app.nextDeadline &&
    isWithinInterval(new Date(app.nextDeadline), { start: nextWeekStart, end: nextWeekEnd })
  ).length;

  // 连续被拒计算（最近一周内）
  const recentRejections = applications.filter(app =>
    (app.stage === "rejected" || app.stage === "withdrawn") &&
    new Date(app.updatedAt) >= lastWeekStart
  ).length;

  // 是否为空周
  const isEmpty = thisWeekApps.length === 0 &&
    thisWeekInterviews === 0 &&
    thisWeekOffers.length === 0 &&
    thisWeekAdvances.length === 0;

  // 生成寄语
  let closingMessage = "继续走下去，你正在靠近。";
  if (thisWeekOffers.length > 0) {
    closingMessage = "恭喜。记得回来看看自己一路走过的足迹。";
  } else if (thisWeekInterviews === 0 && applications.length > 7) {
    closingMessage = "没有面试的一周不代表停滞，准备也是前进。";
  } else if (recentRejections >= 3) {
    closingMessage = "求职是概率游戏。你做得比你以为的好。";
  }

  return {
    applied: thisWeekApps.length,
    interviews: thisWeekInterviews,
    offers: thisWeekOffers.length,
    rejections: thisWeekRejections.length,
    advances: thisWeekAdvances,
    appliedDiff: thisWeekApps.length - lastWeekApplied,
    interviewsDiff: thisWeekInterviews - lastWeekInterviews,
    upcomingInterviews,
    nextWeekHasEvents: upcomingInterviews > 0 || nextWeekDeadlines > 0,
    newOffers: thisWeekOffers.map(o => ({ company: o.company })),
    recentAdvances: thisWeekAdvances.map(a => ({ company: a.company, to: a.to })),
    consecutiveRejections: recentRejections,
    weekNumber,
    dateRange: {
      start: format(weekStart, "M 月 d 日", { locale: zhCN }),
      end: format(weekEnd, "M 月 d 日", { locale: zhCN }),
    },
    isEmpty,
    closingMessage,
  };
}

export function formatDiff(diff: number): { text: string; isPositive: boolean } {
  if (diff > 0) {
    return { text: `+${diff}`, isPositive: true };
  } else if (diff < 0) {
    return { text: `${diff}`, isPositive: false };
  }
  return { text: "0", isPositive: true };
}
