"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useJobTrackStore } from "@/lib/store";
import { selectConflicts } from "@/lib/store";
import type { Application } from "@/lib/types";
import { STAGE_CONFIG } from "@/lib/types";

interface MonthViewProps {
  onDayClick: (date: Date, events: Application[]) => void;
}

export function MonthView({ onDayClick }: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const applications = useJobTrackStore((state) => state.applications);
  const conflicts = useMemo(() => selectConflicts(applications), [applications]);

  // 获取当月所有日期格子（含跨月部分）
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 周一开始
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 获取某天的所有事件
  const getEventsForDay = (day: Date) => {
    const events: Application[] = [];

    // 面试日志日期
    applications.forEach((app) => {
      app.interviewLogs.forEach((log) => {
        if (isSameDay(new Date(log.date), day)) {
          events.push(app);
        }
      });
    });

    // 截止日期
    applications.forEach((app) => {
      if (app.nextDeadline && isSameDay(new Date(app.nextDeadline), day)) {
        if (!events.find((e) => e.id === app.id)) {
          events.push(app);
        }
      }
    });

    return events;
  };

  // 检查某天是否是冲突日
  const isConflictDay = (day: Date) => {
    return conflicts.some((c) => isSameDay(new Date(c.date), day));
  };

  // 获取阶段颜色
  const getStageColor = (app: Application) => {
    const config = STAGE_CONFIG.find((s) => s.key === app.stage);
    return config?.color || "#6F7177";
  };

  // 获取阶段标签
  const getStageLabel = (app: Application) => {
    const config = STAGE_CONFIG.find((s) => s.key === app.stage);
    return config?.label || "";
  };

  // 统计当月
  const monthStats = useMemo(() => {
    const monthStartDate = startOfMonth(currentMonth);
    const monthEndDate = endOfMonth(currentMonth);

    const applied = applications.filter((app) => {
      const date = new Date(app.appliedAt);
      return date >= monthStartDate && date <= monthEndDate;
    }).length;

    const interviews = applications.filter((app) =>
      app.interviewLogs.some(
        (log) =>
          new Date(log.date) >= monthStartDate &&
          new Date(log.date) <= monthEndDate
      )
    ).length;

    const offers = applications.filter(
      (app) =>
        app.stage === "offer" &&
        new Date(app.updatedAt) >= monthStartDate &&
        new Date(app.updatedAt) <= monthEndDate
    ).length;

    return { applied, interviews, offers };
  }, [applications, currentMonth]);

  return (
    <div className="flex flex-col h-full">
      {/* 顶部统计条 */}
      <div className="px-6 py-3 bg-white border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-background rounded transition-colors"
          >
            <ChevronLeft size={18} className="text-text-secondary" />
          </button>
          <h2 className="text-base font-semibold text-text-primary min-w-[120px] text-center">
            {format(currentMonth, "yyyy 年 M 月", { locale: zhCN })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-background rounded transition-colors"
          >
            <ChevronRight size={18} className="text-text-secondary" />
          </button>
        </div>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-3 py-1.5 text-xs text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
        >
          今天
        </button>
        <div className="text-sm text-text-secondary">
          本月：
          <span className="text-text-primary font-medium">{monthStats.applied}</span> 次投递 ·
          <span className="text-text-primary font-medium"> {monthStats.interviews}</span> 场面试 ·
          <span className="text-[#059669] font-medium"> {monthStats.offers}</span> 个 Offer
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 bg-white border-b border-border">
        {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => (
          <div
            key={day}
            className={`py-2 text-center text-xs font-medium text-text-secondary ${
              day === "周六" || day === "周日" ? "text-text-muted" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day, idx) => {
          const events = getEventsForDay(day);
          const hasConflict = isConflictDay(day);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const isWeekend =
            format(day, "EEEE", { locale: zhCN }) === "星期六" ||
            format(day, "EEEE", { locale: zhCN }) === "星期日";

          return (
            <div
              key={idx}
              onClick={() => events.length > 0 && onDayClick(day, events)}
              className={`
                min-h-[100px] border-b border-r border-border p-1.5
                transition-colors duration-150
                ${inMonth ? "bg-white hover:bg-background" : "bg-background/50"}
                ${hasConflict ? "bg-[#FEF3F2]" : ""}
                ${today ? "ring-1 ring-inset ring-primary" : ""}
                ${events.length > 0 ? "cursor-pointer" : ""}
              `}
            >
              {/* 日期 */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-xs font-medium
                    ${today ? "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center" : ""}
                    ${!inMonth ? "text-text-muted" : isWeekend ? "text-text-muted" : "text-text-primary"}
                  `}
                >
                  {format(day, "d")}
                </span>
                {hasConflict && (
                  <AlertCircle size={14} className="text-danger" />
                )}
              </div>

              {/* 事件列表 */}
              <div className="space-y-0.5">
                {events.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="text-xs px-1.5 py-0.5 rounded truncate text-white"
                    style={{ backgroundColor: getStageColor(app) }}
                  >
                    {app.company}·{getStageLabel(app)}
                  </div>
                ))}
                {events.length > 3 && (
                  <div className="text-xs text-text-muted px-1.5">
                    +{events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
