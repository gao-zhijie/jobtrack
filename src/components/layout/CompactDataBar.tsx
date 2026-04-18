"use client";

import { useJobTrackStore } from "@/lib/store";
import {
  selectTodayDeadlines,
  selectWeekDeadlines,
  selectStats,
} from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

function useCompactStats() {
  const applications = useJobTrackStore((state) => state.applications);
  const todayDeadlines = selectTodayDeadlines(applications);
  const weekDeadlines = selectWeekDeadlines(applications);
  const stats = selectStats(applications);
  const earliestDate = applications.length
    ? new Date(
        Math.min(...applications.map((a) => new Date(a.appliedAt).getTime()))
      )
    : null;

  return {
    todayCount: todayDeadlines.length,
    weekCount: weekDeadlines.length,
    total: stats.total,
    daysSinceStart: earliestDate && stats.total > 0
      ? formatDistanceToNow(earliestDate, { locale: zhCN, addSuffix: false })
      : null,
    interviewRate: stats.interviewRate,
  };
}

export function CompactDataBar() {
  const { todayCount, weekCount, total, daysSinceStart, interviewRate } = useCompactStats();

  return (
    <div className="h-10 flex items-center justify-center gap-6 text-sm">
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-text-primary">{todayCount}</span>
        <span className="text-text-secondary font-normal">今日</span>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-text-primary">{weekCount}</span>
        <span className="text-text-secondary font-normal">本周</span>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-text-primary">{total}</span>
        <span className="text-text-secondary font-normal">家</span>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="text-text-secondary font-normal">坚持</span>
        <span className="font-semibold text-text-primary">{daysSinceStart || "0"}</span>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="text-text-secondary font-normal">面试率</span>
        <span className="font-semibold text-text-primary">{Math.round(interviewRate)}%</span>
      </div>
    </div>
  );
}
