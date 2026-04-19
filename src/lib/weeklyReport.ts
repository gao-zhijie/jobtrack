import {
  startOfWeek,
  endOfWeek,
  differenceInWeeks,
  differenceInDays,
  format,
  subWeeks,
  isWithinInterval,
} from "date-fns";
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
  upcomingDeadlinesList: { company: string; action: string; date: Date }[];

  // 亮点
  newOffers: { company: string }[];
  recentAdvances: { company: string; to: string }[];
  consecutiveRejections: number;

  // 当前在途
  totalActive: number;
  stageBreakdown: {
    applied: number;
    written: number;
    interview: number;
    offer: number;
  };

  // 时间信息
  weekNumber: number;
  totalDays: number;
  dateRange: { start: string; end: string };
  isEmpty: boolean;

  // 寄语
  closingMessage: string;
}

export function calculateWeekReport(applications: Application[]): WeekStats {
  const today = new Date();

  // 空数据直接返回
  if (applications.length === 0) {
    return {
      applied: 0,
      interviews: 0,
      offers: 0,
      rejections: 0,
      advances: [],
      appliedDiff: 0,
      interviewsDiff: 0,
      upcomingInterviews: 0,
      nextWeekHasEvents: false,
      upcomingDeadlinesList: [],
      newOffers: [],
      recentAdvances: [],
      consecutiveRejections: 0,
      totalActive: 0,
      stageBreakdown: { applied: 0, written: 0, interview: 0, offer: 0 },
      weekNumber: 1,
      totalDays: 0,
      dateRange: {
        start: format(startOfWeek(today, { weekStartsOn: 1 }), "M 月 d 日", { locale: zhCN }),
        end: format(endOfWeek(today, { weekStartsOn: 1 }), "M 月 d 日", { locale: zhCN }),
      },
      isEmpty: true,
      closingMessage: "继续走下去，你正在靠近。",
    };
  }

  // 本周时间范围（周一到周日）
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  // 上周时间范围
  const lastWeekStart = subWeeks(weekStart, 1);
  const lastWeekEnd = subWeeks(weekEnd, 1);

  // 计算求职开始后的第几周
  const earliestDate = new Date(
    Math.min(...applications.map((a) => new Date(a.appliedAt).getTime()))
  );
  const weekNumber = Math.max(1, differenceInWeeks(today, earliestDate) + 1);
  const totalDays = Math.max(1, differenceInDays(today, earliestDate) + 1);

  // 筛选本周数据
  const thisWeekApps = applications.filter((app) =>
    isWithinInterval(new Date(app.appliedAt), { start: weekStart, end: weekEnd })
  );

  // 本周面试数（按面试日志）
  const thisWeekInterviews = new Set(
    applications.flatMap((app) =>
      app.interviewLogs
        .filter((log) =>
          isWithinInterval(new Date(log.date), { start: weekStart, end: weekEnd })
        )
        .map(() => app.id)
    )
  ).size;

  // 本周新 Offer
  const thisWeekOffers = applications.filter(
    (app) =>
      app.stage === "offer" &&
      isWithinInterval(new Date(app.updatedAt), { start: weekStart, end: weekEnd })
  );

  // 本周新拒绝
  const thisWeekRejections = applications.filter(
    (app) =>
      (app.stage === "rejected" || app.stage === "withdrawn") &&
      isWithinInterval(new Date(app.updatedAt), { start: weekStart, end: weekEnd })
  );

  // 本周进阶
  const thisWeekAdvances: { company: string; from: string; to: string }[] = [];
  applications.forEach((app) => {
    if (
      ["interview1", "interview2", "final", "offer"].includes(app.stage) &&
      isWithinInterval(new Date(app.updatedAt), { start: weekStart, end: weekEnd })
    ) {
      const log = app.interviewLogs[app.interviewLogs.length - 1];
      if (log) {
        thisWeekAdvances.push({
          company: app.company,
          from: log.stage,
          to:
            app.stage === "interview1"
              ? "初面"
              : app.stage === "interview2"
              ? "二面"
              : app.stage === "final"
              ? "终面"
              : "Offer",
        });
      }
    }
  });

  // 上周数据
  const lastWeekApplied = applications.filter((app) =>
    isWithinInterval(new Date(app.appliedAt), { start: lastWeekStart, end: lastWeekEnd })
  ).length;

  const lastWeekInterviews = new Set(
    applications.flatMap((app) =>
      app.interviewLogs
        .filter((log) =>
          isWithinInterval(new Date(log.date), { start: lastWeekStart, end: lastWeekEnd })
        )
        .map(() => app.id)
    )
  ).size;

  // 下周时间范围
  const nextWeekStart = new Date(weekEnd);
  nextWeekStart.setDate(nextWeekStart.getDate() + 1);
  const nextWeekEnd = endOfWeek(nextWeekStart, { weekStartsOn: 1 });

  const upcomingInterviews = new Set(
    applications.flatMap((app) =>
      app.interviewLogs
        .filter((log) =>
          isWithinInterval(new Date(log.date), { start: nextWeekStart, end: nextWeekEnd })
        )
        .map(() => app.id)
    )
  ).size;

  // 下周截止列表
  const upcomingDeadlinesList = applications
    .filter(
      (app): app is Application & { nextDeadline: Date } =>
        !!app.nextDeadline &&
        isWithinInterval(new Date(app.nextDeadline), { start: nextWeekStart, end: nextWeekEnd })
    )
    .map((app) => ({
      company: app.company,
      action: app.nextAction || "截止",
      date: new Date(app.nextDeadline),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const nextWeekDeadlines = upcomingDeadlinesList.length;

  // 连续被拒计算
  const recentRejections = applications.filter(
    (app) =>
      (app.stage === "rejected" || app.stage === "withdrawn") &&
      new Date(app.updatedAt) >= lastWeekStart
  ).length;

  // 当前在途
  const totalActive = applications.filter(
    (app) => !["rejected", "withdrawn"].includes(app.stage)
  ).length;

  const stageBreakdown = {
    applied: applications.filter((a) => a.stage === "applied").length,
    written: applications.filter((a) => a.stage === "written").length,
    interview: applications.filter((a) =>
      ["interview1", "interview2", "final"].includes(a.stage)
    ).length,
    offer: applications.filter((a) => a.stage === "offer").length,
  };

  // 是否为空（整个数据库无记录）
  const isEmpty = false; // applications.length > 0 here

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
    upcomingDeadlinesList,
    newOffers: thisWeekOffers.map((o) => ({ company: o.company })),
    recentAdvances: thisWeekAdvances.map((a) => ({ company: a.company, to: a.to })),
    consecutiveRejections: recentRejections,
    totalActive,
    stageBreakdown,
    weekNumber,
    totalDays,
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
