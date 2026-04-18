"use client";

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
}

export function DayDetail({ date, applications, conflicts, onClose }: DayDetailProps) {
  const hasConflicts = conflicts.length > 1;

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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
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
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                    你在当天有 {conflicts.length} 场面试，时间可能冲突
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
                    className="border border-border rounded-lg p-3 hover:bg-background transition-colors"
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
                        className="text-xs px-2 py-0.5 rounded font-medium text-white"
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
      </div>
    </>
  );
}
