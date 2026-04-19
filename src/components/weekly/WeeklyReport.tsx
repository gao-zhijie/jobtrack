"use client";

import { useMemo } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useJobTrackStore } from "@/lib/store";
import { calculateWeekReport } from "@/lib/weeklyReport";

export function WeeklyReport() {
  const applications = useJobTrackStore((state) => state.applications);
  const stats = useMemo(() => calculateWeekReport(applications), [applications]);

  if (stats.isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  const hasUpcoming = stats.upcomingDeadlinesList.length > 0;
  const noActivityThisWeek =
    stats.applied === 0 &&
    stats.interviews === 0 &&
    stats.offers === 0 &&
    stats.rejections === 0;

  // 当前在途 StatCard 副文案
  const activeSub =
    stats.stageBreakdown.offer > 0
      ? `${stats.stageBreakdown.offer} 个 Offer`
      : stats.stageBreakdown.interview > 0
      ? `${stats.stageBreakdown.interview} 家面试中`
      : stats.stageBreakdown.written > 0
      ? `${stats.stageBreakdown.written} 家笔试中`
      : "持续跟进中";

  return (
    <div className="max-w-[760px] mx-auto">
      {/* ── 页头 ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            第 {stats.weekNumber} 周
          </span>
          {stats.totalDays > 0 && (
            <span className="text-xs text-text-muted">求职第 {stats.totalDays} 天</span>
          )}
        </div>
        <h1 className="text-xl font-semibold text-text-primary">
          {stats.dateRange.start} — {stats.dateRange.end}
        </h1>
      </div>

      {/* ── 指标卡 ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="本周投递"
          value={stats.applied}
          diff={stats.appliedDiff}
        />
        <StatCard
          label="本周面试"
          value={stats.interviews}
          diff={stats.interviewsDiff}
          valueColor="#5E6AD2"
        />
        <StatCard
          label="当前在途"
          value={stats.totalActive}
          sub={activeSub}
        />
      </div>

      {/* ── 主内容卡片 ───────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

        {/* 本周动态 */}
        <section className="px-8 py-6 border-b border-border">
          <SectionLabel>本周动态</SectionLabel>

          <p className="text-sm text-text-primary leading-relaxed mb-4">
            {noActivityThisWeek ? (
              <>
                这周暂时没有新的进展
                {stats.totalActive > 0 && (
                  <>
                    ，但你还有{" "}
                    <span className="font-semibold">{stats.totalActive} 家</span>{" "}
                    在途中
                  </>
                )}
                。保持节奏就好。
              </>
            ) : (
              <>
                这周
                {stats.applied > 0 && (
                  <>
                    你投递了{" "}
                    <span className="font-semibold">{stats.applied} 家</span>
                  </>
                )}
                {stats.applied > 0 &&
                  (stats.interviews > 0 || stats.offers > 0 || stats.rejections > 0) &&
                  "，"}
                {stats.interviews > 0 && (
                  <>
                    完成了{" "}
                    <span className="font-semibold text-primary">
                      {stats.interviews} 场面试
                    </span>
                  </>
                )}
                {stats.interviews > 0 && (stats.offers > 0 || stats.rejections > 0) && "，"}
                {stats.offers > 0 && (
                  <>
                    拿到了{" "}
                    <span className="font-semibold text-[#059669]">
                      {stats.offers} 个 Offer
                    </span>
                  </>
                )}
                {stats.offers > 0 && stats.rejections > 0 && "，"}
                {stats.rejections > 0 && (
                  <>
                    有{" "}
                    <span className="text-text-secondary">{stats.rejections} 家</span>
                    没有继续
                  </>
                )}
                。
              </>
            )}
          </p>

          {/* 本周亮点 callout */}
          {stats.newOffers.length > 0 ? (
            <Callout accentColor="#059669" label="本周最好的事">
              {stats.newOffers.map((o, i) => (
                <p key={i} className="text-sm text-text-primary">
                  <span className="font-medium">{o.company}</span> 的 Offer 到手了
                </p>
              ))}
            </Callout>
          ) : stats.recentAdvances.length > 0 ? (
            <Callout accentColor="#5E6AD2" label="本周最好的事">
              {stats.recentAdvances.slice(0, 2).map((a, i) => (
                <p key={i} className="text-sm text-text-primary">
                  <span className="font-medium">{a.company}</span>{" "}
                  <span className="text-text-secondary">进到了</span>{" "}
                  <span className="font-medium text-primary">{a.to}</span>
                </p>
              ))}
            </Callout>
          ) : (
            <Callout accentColor="#E6E8EB" label="">
              <p className="text-sm text-text-secondary italic">
                你坚持了一周，这本身就值得肯定
              </p>
            </Callout>
          )}
        </section>

        {/* 和上周相比 + 在途分布 */}
        <section className="grid grid-cols-2 divide-x divide-border border-b border-border">
          <div className="px-8 py-6">
            <SectionLabel>和上周相比</SectionLabel>
            <div className="space-y-4 mt-1">
              <CompRow
                label="投递"
                current={stats.applied}
                diff={stats.appliedDiff}
              />
              <CompRow
                label="面试"
                current={stats.interviews}
                diff={stats.interviewsDiff}
              />
            </div>
          </div>

          <div className="px-8 py-6">
            <SectionLabel>在途分布</SectionLabel>
            <StageDistribution breakdown={stats.stageBreakdown} />
          </div>
        </section>

        {/* 下周预告 */}
        {hasUpcoming && (
          <section className="px-8 py-6 border-b border-border">
            <SectionLabel>下周预告</SectionLabel>
            <div className="space-y-3 mt-1">
              {stats.upcomingDeadlinesList.map((item, i) => (
                <UpcomingItem key={i} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* 寄语 */}
        <section className="px-8 py-6">
          <p className="text-center text-sm text-text-secondary italic leading-relaxed">
            {stats.closingMessage}
          </p>
        </section>
      </div>
    </div>
  );
}

// ─── 子组件 ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-2xs text-text-muted uppercase tracking-wide mb-3">
      {children}
    </p>
  );
}

function StatCard({
  label,
  value,
  diff,
  sub,
  valueColor,
}: {
  label: string;
  value: number;
  diff?: number;
  sub?: string;
  valueColor?: string;
}) {
  const hasDiff = diff !== undefined;
  const isPositive = (diff ?? 0) > 0;
  const isNeutral = (diff ?? 0) === 0;

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm px-5 py-4">
      <p className="text-xs text-text-muted mb-2">{label}</p>
      <p
        className="text-xl font-semibold leading-tight mb-1.5"
        style={{ color: valueColor ?? "#1C1D1F" }}
      >
        {value}
      </p>
      {hasDiff ? (
        <div className="flex items-center gap-1 text-xs">
          {isNeutral ? (
            <span className="text-text-muted flex items-center gap-0.5">
              <Minus size={11} />
              与上周持平
            </span>
          ) : isPositive ? (
            <span className="text-[#059669] flex items-center gap-0.5">
              <ArrowUp size={11} />
              比上周多 {diff}
            </span>
          ) : (
            <span className="text-danger flex items-center gap-0.5">
              <ArrowDown size={11} />
              比上周少 {Math.abs(diff!)}
            </span>
          )}
        </div>
      ) : sub ? (
        <p className="text-xs text-text-muted">{sub}</p>
      ) : null}
    </div>
  );
}

function Callout({
  accentColor,
  label,
  children,
}: {
  accentColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-background rounded-lg px-4 py-3 border-l-[3px]"
      style={{ borderLeftColor: accentColor }}
    >
      {label && (
        <p className="text-2xs text-text-muted uppercase tracking-wide mb-1.5">{label}</p>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CompRow({
  label,
  current,
  diff,
}: {
  label: string;
  current: number;
  diff: number;
}) {
  const isNeutral = diff === 0;
  const isPositive = diff > 0;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-text-primary tabular-nums">
          {current}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs w-14 ${
            isNeutral
              ? "text-text-muted"
              : isPositive
              ? "text-[#059669]"
              : "text-danger"
          }`}
        >
          {isNeutral ? (
            <>
              <Minus size={11} />
              <span>持平</span>
            </>
          ) : isPositive ? (
            <>
              <ArrowUp size={11} />
              <span>+{diff}</span>
            </>
          ) : (
            <>
              <ArrowDown size={11} />
              <span>{diff}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

const STAGE_ITEMS = [
  { key: "applied" as const, label: "已投递", color: "#6F7177" },
  { key: "written" as const, label: "笔试中", color: "#D97706" },
  { key: "interview" as const, label: "面试中", color: "#5E6AD2" },
  { key: "offer" as const, label: "Offer", color: "#059669" },
];

function StageDistribution({
  breakdown,
}: {
  breakdown: { applied: number; written: number; interview: number; offer: number };
}) {
  const entries = STAGE_ITEMS.map((s) => ({
    ...s,
    count: breakdown[s.key],
  })).filter((e) => e.count > 0);

  const max = Math.max(...entries.map((e) => e.count), 1);

  if (entries.length === 0) {
    return (
      <p className="text-xs text-text-muted mt-1">暂无在途申请</p>
    );
  }

  return (
    <div className="space-y-2.5 mt-1">
      {entries.map((entry) => (
        <div key={entry.key} className="flex items-center gap-3">
          <span className="text-xs text-text-secondary w-10 shrink-0">
            {entry.label}
          </span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(entry.count / max) * 100}%`,
                backgroundColor: entry.color,
              }}
            />
          </div>
          <span className="text-xs font-medium text-text-primary tabular-nums w-4 text-right shrink-0">
            {entry.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function UpcomingItem({
  item,
}: {
  item: { company: string; action: string; date: Date };
}) {
  const dayLabel = format(item.date, "EEE", { locale: zhCN }); // 周二
  const dateLabel = format(item.date, "M月d日", { locale: zhCN }); // 4月22日

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="shrink-0 w-24">
        <span className="font-medium text-text-primary">{dayLabel}</span>
        <span className="text-text-muted ml-1.5 text-xs">{dateLabel}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-medium text-text-primary truncate">{item.company}</span>
        {item.action && (
          <>
            <span className="text-border">·</span>
            <span className="text-text-secondary truncate">{item.action}</span>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center">
      <p className="text-sm text-text-secondary mb-2">还没有任何申请记录</p>
      <p className="text-xs text-text-muted mb-6">去看板添加第一条，这里会自动生成你的周报</p>
      <a
        href="/board"
        className="inline-flex items-center px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
      >
        去看板记录
      </a>
    </div>
  );
}
