"use client";

import { Calendar, Clock, TrendingUp, Target } from "lucide-react";
import { useJobTrackStore } from "@/lib/store";
import {
  selectTodayDeadlines,
  selectWeekDeadlines,
  selectStats,
} from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

function useStats() {
  const applications = useJobTrackStore((state) => state.applications);
  return {
    todayDeadlines: selectTodayDeadlines(applications),
    weekDeadlines: selectWeekDeadlines(applications),
    stats: selectStats(applications),
    earliestDate: applications.length
      ? new Date(
          Math.min(...applications.map((a) => new Date(a.appliedAt).getTime()))
        )
      : null,
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle: string;
  subtitleHighlight?: boolean;
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  subtitleHighlight,
}: StatCardProps) {
  return (
    <div className="card p-6 flex flex-col min-w-0 group hover:border-primary/50 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          {title}
        </span>
        <span className="text-text-muted">{icon}</span>
      </div>
      <div className="text-[28px] font-semibold text-text-primary leading-tight mb-2">
        {value}
      </div>
      <div
        className={`text-[13px] leading-normal ${
          subtitleHighlight ? "text-primary" : "text-text-secondary"
        }`}
      >
        {subtitle}
      </div>
    </div>
  );
}

export function StatsOverview() {
  const { todayDeadlines, weekDeadlines, stats, earliestDate } = useStats();

  // 计算求职天数
  const daysSinceStart =
    earliestDate && stats.total > 0
      ? formatDistanceToNow(earliestDate, { locale: zhCN, addSuffix: false })
      : null;

  // 今日截止副文案
  const todaySubtitle = (() => {
    const count = todayDeadlines.length;
    if (count === 0) return "今天没有截止，好好休息或准备下一步";
    if (count <= 2) return `今天有 ${count} 件事要处理，稳住节奏`;
    return `今天有 ${count} 件事，优先处理最紧急的`;
  })();

  // 面试转化率副文案
  const interviewSubtitle = (() => {
    if (stats.interviewRate === 0) return "还没有面试邀约，继续投递";
    if (stats.interviewRate < 30) return "每一次面试都是一次学习机会";
    if (stats.interviewRate < 60) return "面试转化还不错，保持投递节奏";
    return "进入面试的概率很高，继续加油";
  })();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        icon={<Calendar size={20} />}
        title="今日待办"
        value={todayDeadlines.length}
        subtitle={todaySubtitle}
        subtitleHighlight={todayDeadlines.length > 0}
      />
      <StatCard
        icon={<Clock size={20} />}
        title="本周截止"
        value={weekDeadlines.length}
        subtitle="未来 7 天的节奏"
      />
      <StatCard
        icon={<TrendingUp size={20} />}
        title="总申请数"
        value={stats.total}
        subtitle={
          daysSinceStart && stats.total > 0
            ? `你已经坚持了 ${daysSinceStart}`
            : "开始记录你的求职之旅"
        }
      />
      <StatCard
        icon={<Target size={20} />}
        title="面试转化率"
        value={`${Math.round(stats.interviewRate)}%`}
        subtitle={interviewSubtitle}
        subtitleHighlight={stats.interviewRate >= 30}
      />
    </div>
  );
}
