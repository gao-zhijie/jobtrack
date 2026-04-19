"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { X, Calendar, Clock, AlertTriangle } from "lucide-react";
import type { Application } from "@/lib/types";
import { STAGE_CONFIG } from "@/lib/types";

interface DayDetailProps {
  date: Date;
  applications: Application[];
  conflicts: Application[];
  onClose: () => void;
  onCardClick: (app: Application) => void;
}

export function DayDetail({ date, applications, conflicts, onClose, onCardClick }: DayDetailProps) {
  // 计算当天总事件数（面试记录 + 截止日期）
  const totalEvents = applications.reduce((count, app) => {
    const interviewCount = app.interviewLogs.filter(
      (log) => new Date(log.date).toDateString() === date.toDateString()
    ).length;
    const hasDeadline =
      app.nextDeadline &&
      new Date(app.nextDeadline).toDateString() === date.toDateString();
    return count + interviewCount + (hasDeadline ? 1 : 0);
  }, 0);

  const hasConflicts = totalEvents > 1;

  // 生成调整建议
  const getRescheduleSuggestions = () => {
    if (conflicts.length < 2) return [];
    const suggestions: string[] = [];
    conflicts.forEach((app, i) => {
      if (i === 0) {
        suggestions.push(`建议把「${app.company}」改约到另一天`);
      }
    });
    return suggestions;
  };

  const suggestions = getRescheduleSuggestions();

  // 移动端拖拽关闭
  const [translateY, setTranslateY] = useState(0);
  const startYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 100) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  // 桌面端侧边栏
  const DesktopSidebar = () => (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl z-50 flex flex-col">
        <DayDetailContent
          date={date}
          applications={applications}
          hasConflicts={hasConflicts}
          totalEvents={totalEvents}
          suggestions={suggestions}
          onClose={onClose}
          onCardClick={onCardClick}
        />
      </div>
    </>
  );

  // 移动端底部抽屉
  const MobileSheet = () => (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        style={{ opacity: Math.min(1, translateY / 200) }}
      />

      {/* Sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[85vh] flex flex-col"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: translateY === 0 ? "transform 0.3s ease-out" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 拖拽指示条 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <DayDetailContent
          date={date}
          applications={applications}
          hasConflicts={hasConflicts}
          totalEvents={totalEvents}
          suggestions={suggestions}
          onClose={onClose}
          onCardClick={onCardClick}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>
      <div className="md:hidden">
        <MobileSheet />
      </div>
    </>
  );
}

interface DayDetailContentProps {
  date: Date;
  applications: Application[];
  hasConflicts: boolean;
  totalEvents: number;
  suggestions: string[];
  onClose: () => void;
  onCardClick: (app: Application) => void;
}

function DayDetailContent({
  date,
  applications,
  hasConflicts,
  totalEvents,
  suggestions,
  onClose,
  onCardClick,
}: DayDetailContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {format(date, "M 月 d 日", { locale: zhCN })}
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">
            {format(date, "EEEE", { locale: zhCN })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* 冲突警告 */}
        {hasConflicts && (
          <div className="bg-[#FEF3F2] border border-danger/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-danger mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-danger">
                  面试时间冲突
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  你在当天有 {totalEvents} 场面试，时间可能冲突
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 调整建议 */}
        {suggestions.length > 0 && (
          <div className="bg-background rounded-lg p-4">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
              时间调整建议
            </p>
            <ul className="space-y-2">
              {suggestions.map((s, i) => (
                <li key={i} className="text-sm text-text-primary flex items-start gap-2">
                  <span className="text-text-muted">·</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 事件列表 */}
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
            当日事项 ({applications.length})
          </p>
          <div className="space-y-3">
            {applications.map((app) => {
              const stageConfig = STAGE_CONFIG.find((s) => s.key === app.stage);
              return (
                <div
                  key={app.id}
                  onClick={() => onCardClick(app)}
                  className="border border-border rounded-lg p-3 hover:bg-background hover:shadow-sm transition-all duration-200 cursor-pointer active:bg-background"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-text-primary">
                        {app.company}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {app.position}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium text-white flex-shrink-0"
                      style={{ backgroundColor: stageConfig?.color }}
                    >
                      {stageConfig?.label}
                    </span>
                  </div>

                  {/* 面试信息 */}
                  {app.interviewLogs
                    .filter((log) =>
                      new Date(log.date).toDateString() === date.toDateString()
                    )
                    .map((log) => (
                      <div key={log.id} className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Clock size={12} />
                          <span>{log.stage}</span>
                        </div>
                      </div>
                    ))}

                  {/* 截止日期信息 */}
                  {app.nextDeadline &&
                    new Date(app.nextDeadline).toDateString() ===
                      date.toDateString() && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Calendar size={12} />
                          <span>截止：{app.nextAction || "待处理"}</span>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
