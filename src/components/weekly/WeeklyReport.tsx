"use client";

import { useMemo } from "react";
import { Minus, ArrowUp, ArrowDown } from "lucide-react";
import { useJobTrackStore } from "@/lib/store";
import { calculateWeekReport, formatDiff } from "@/lib/weeklyReport";

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

  const appliedDiff = formatDiff(stats.appliedDiff);
  const interviewsDiff = formatDiff(stats.interviewsDiff);

  return (
    <div className="max-w-[680px] mx-auto">
      {/* 信纸 */}
      <div className="bg-white rounded-xl border border-border shadow-sm">
        {/* 装饰性 SVG */}
        <div className="px-12 pt-8 pb-4">
          <PlantSVG />
        </div>

        {/* 标题 */}
        <div className="px-12 pb-6 text-center border-b border-border">
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            第 {stats.weekNumber} 周周报
          </h1>
          <p className="text-sm text-text-secondary">
            {stats.dateRange.start} - {stats.dateRange.end}
          </p>
        </div>

        {/* 内容 */}
        <div className="px-12 py-8 space-y-8">
          {/* 段落1: 本周概览 */}
          <Section title="">
            <p className="text-text-primary leading-relaxed">
              这周
              {stats.applied > 0 && (
                <>你投递了 <Highlight>{stats.applied} 家</Highlight></>
              )}
              {stats.applied > 0 && stats.interviews > 0 && "，"}
              {stats.interviews > 0 && (
                <>完成了 <Highlight>{stats.interviews} 场面试</Highlight></>
              )}
              {(stats.applied > 0 || stats.interviews > 0) && stats.offers > 0 && "，"}
              {stats.offers > 0 && (
                <>拿到了 <Highlight type="green">{stats.offers} 个 Offer</Highlight></>
              )}
              {stats.applied === 0 && stats.interviews === 0 && stats.offers === 0 && (
                <>这周还没有新的进展</>
              )}
              。
            </p>
          </Section>

          {/* 段落2: 进度对比 */}
          <Section title="和上周相比">
            <div className="space-y-2">
              <DiffRow
                label="投递数"
                diff={appliedDiff}
                icon={stats.appliedDiff >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              />
              <DiffRow
                label="面试数"
                diff={interviewsDiff}
                icon={stats.interviewsDiff >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              />
            </div>
          </Section>

          {/* 段落3: 亮点时刻 */}
          <Section title="本周最好的事">
            {stats.newOffers.length > 0 ? (
              <ul className="space-y-2">
                {stats.newOffers.map((offer, i) => (
                  <li key={i} className="text-text-primary">
                    你拿到了<span className="font-medium">{offer.company}</span> 的 Offer
                  </li>
                ))}
              </ul>
            ) : stats.recentAdvances.length > 0 ? (
              <ul className="space-y-2">
                {stats.recentAdvances.slice(0, 2).map((advance, i) => (
                  <li key={i} className="text-text-primary">
                    <span className="font-medium">{advance.company}</span> 进到了 {advance.to}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary italic">
                你坚持了一周，这本身就值得肯定
              </p>
            )}
          </Section>

          {/* 段落4: 下周预告 */}
          <Section title="下周预告">
            {stats.upcomingInterviews > 0 ? (
              <p className="text-text-primary">
                下周有 <Highlight type="purple">{stats.upcomingInterviews} 场面试</Highlight> 等着你
              </p>
            ) : stats.nextWeekHasEvents ? (
              <p className="text-text-primary">下周有其他安排，记得关注截止日期</p>
            ) : (
              <p className="text-text-secondary">
                下周目前没有安排，可以为自己规划一些事
              </p>
            )}
          </Section>

          {/* 段落5: 一句话寄语 */}
          <div className="pt-4 border-t border-border">
            <p className="text-center text-sm text-text-secondary italic leading-relaxed">
              {stats.closingMessage}
            </p>
          </div>
        </div>

        {/* 底部留白 */}
        <div className="px-12 pb-8" />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {title && (
        <p className="text-xs text-text-muted uppercase tracking-wide">{title}</p>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Highlight({ children, type = "default" }: { children: React.ReactNode; type?: "default" | "green" | "purple" }) {
  const colors = {
    default: "text-primary",
    green: "text-[#059669]",
    purple: "text-[#7C3AED]",
  };
  return <span className={`font-medium ${colors[type]}`}>{children}</span>;
}

function DiffRow({
  label,
  diff,
  icon,
}: {
  label: string;
  diff: { text: string; isPositive: boolean };
  icon: React.ReactNode;
}) {
  const color = diff.isPositive ? "text-[#059669]" : "text-danger";
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-text-secondary w-16">{label}</span>
      <span className={`flex items-center gap-1 ${color}`}>
        {diff.text === "0" ? (
          <Minus size={14} className="text-text-muted" />
        ) : (
          <>
            {icon}
            {diff.text}
          </>
        )}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-sm text-text-secondary mb-6">
        这一周还没开始记录，第一条从现在开始
      </p>
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent("open-new-application"));
        }}
        className="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
      >
        新建申请
      </button>
    </div>
  );
}

function PlantSVG() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="text-text-muted"
    >
      {/* 花盆 */}
      <path
        d="M16 36h16l2 8H14l2-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* 茎 */}
      <path
        d="M24 36V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* 叶子左 */}
      <path
        d="M24 28c-6-2-10 0-12 4s2 8 12 4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 叶子右 */}
      <path
        d="M24 24c6-2 10 0 12 4s-2 8-12 4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 花 */}
      <circle cx="24" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
