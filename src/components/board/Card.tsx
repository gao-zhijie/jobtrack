"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow, differenceInDays, isBefore, addDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Application } from "@/lib/types";

interface CardProps {
  application: Application;
  onClick?: () => void;
}

export function Card({ application, onClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: { type: "card", application },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 计算投递天数
  const daysSinceApplied = differenceInDays(new Date(), new Date(application.appliedAt));

  // 是否超过14天且还在投递状态
  const isStale =
    application.stage === "applied" && daysSinceApplied > 14;

  // 是否24小时内截止
  const isUrgent =
    application.nextDeadline &&
    isBefore(new Date(application.nextDeadline), addDays(new Date(), 1));

  // 投递天数文案
  const appliedDaysText = daysSinceApplied === 0
    ? "今天投递"
    : `投递 ${daysSinceApplied} 天`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-border p-3 cursor-pointer
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-text-muted/30
        ${isStale ? "opacity-70" : ""}
        ${isDragging ? "rotate-1 shadow-lg" : ""}
      `}
    >
      {/* 紧急小红点 */}
      {isUrgent && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
      )}

      {/* 公司名 */}
      <div className="font-medium text-sm text-text-primary mb-1 pr-4">
        {application.company}
      </div>

      {/* 岗位名 */}
      <div className="text-xs text-text-secondary mb-3">
        {application.position}
      </div>

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{appliedDaysText}</span>
        {application.nextDeadline && (
          <span className={isUrgent ? "text-danger" : ""}>
            {formatDistanceToNow(new Date(application.nextDeadline), {
              locale: zhCN,
              addSuffix: true,
            })}
          </span>
        )}
      </div>

      {/* 归档提示 */}
      {isStale && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-text-muted text-right">
          建议归档
        </div>
      )}
    </div>
  );
}
