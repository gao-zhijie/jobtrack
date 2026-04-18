"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow, differenceInDays, isBefore, addDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Archive } from "lucide-react";
import type { Application } from "@/lib/types";
import { useJobTrackStore } from "@/lib/store";

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

  const updateApplication = useJobTrackStore((state) => state.updateApplication);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 计算投递天数
  const daysSinceApplied = differenceInDays(new Date(), new Date(application.appliedAt));

  // 判断状态
  const isOverdue =
    application.nextDeadline &&
    isBefore(new Date(application.nextDeadline), new Date());

  const isDeadline24h =
    !isOverdue &&
    application.nextDeadline &&
    isBefore(new Date(application.nextDeadline), addDays(new Date(), 1));

  const isUrgent = isOverdue || isDeadline24h;

  // 休眠态：14 天无响应且还在流程中
  const isStale =
    !["rejected", "withdrawn", "offer"].includes(application.stage) &&
    daysSinceApplied > 14;

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowArchiveConfirm(true);
  };

  const confirmArchive = () => {
    updateApplication(application.id, { stage: "withdrawn" });
    setShowArchiveConfirm(false);
  };

  // ========== 紧急态 ==========
  if (isUrgent) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={`
          relative bg-white rounded-lg border border-border cursor-pointer
          transition-all duration-200 ease-out
          hover:shadow-md hover:border-text-muted/30
          ${isDragging ? "rotate-1 shadow-lg" : ""}
        `}
      >
        {/* 左侧紧急色条 */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg bg-danger" />

        {/* 紧急小红点 */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger animate-pulse" />

        {/* 内容 */}
        <div className="pl-3 pr-6 py-3">
          {/* 公司名 - 紧急态 font-weight 600 */}
          <div className="font-semibold text-sm text-text-primary mb-1">
            {application.company}
          </div>

          {/* 岗位名 */}
          <div className="text-xs text-text-secondary mb-2">
            {application.position}
          </div>

          {/* 截止信息 */}
          {application.nextDeadline && (
            <div className="text-xs text-danger font-medium">
              {isOverdue
                ? `超时 ${differenceInDays(new Date(), new Date(application.nextDeadline))} 天`
                : formatDistanceToNow(new Date(application.nextDeadline), {
                    locale: zhCN,
                    addSuffix: true,
                  })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== 休眠态 ==========
  if (isStale) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={`
          relative bg-white rounded-lg border border-border cursor-pointer
          transition-all duration-200 ease-out
          hover:opacity-100 hover:shadow-md hover:border-text-muted/30
          ${isDragging ? "rotate-1 shadow-lg" : ""}
        `}
      >
        <div className="opacity-50 hover:opacity-100 transition-opacity duration-200">
          {/* 公司名 */}
          <div className="font-medium text-sm text-text-primary mb-1 px-3 pt-3">
            {application.company}
          </div>

          {/* 岗位名 */}
          <div className="text-xs text-text-secondary px-3">
            {application.position}
          </div>

          {/* 归档建议 */}
          <div className="flex items-center justify-center py-4">
            <button
              onClick={handleArchive}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-danger transition-colors"
            >
              <Archive size={14} />
              建议归档
            </button>
          </div>
        </div>

        {/* 归档确认浮层 */}
        {showArchiveConfirm && (
          <>
            <div
              className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center"
              onClick={() => setShowArchiveConfirm(false)}
            >
              <div
                className="bg-white border border-border rounded-lg p-3 shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-text-primary mb-2">确认归档？</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowArchiveConfirm(false)}
                    className="px-3 py-1 text-xs text-text-secondary hover:text-text-primary"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmArchive}
                    className="px-3 py-1 text-xs bg-danger text-white rounded hover:bg-danger/90"
                  >
                    归档
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ========== 普通态 ==========
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border border-border p-3 cursor-pointer
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-text-muted/30
        ${isDragging ? "rotate-1 shadow-lg" : ""}
      `}
    >
      {/* 右上角 ·X天 label */}
      <div className="absolute top-2 right-2 text-xs text-text-muted">
        ·{daysSinceApplied}天
      </div>

      {/* 公司名 */}
      <div className="font-medium text-sm text-text-primary mb-1 pr-8">
        {application.company}
      </div>

      {/* 岗位名 */}
      <div className="text-xs text-text-secondary">
        {application.position}
      </div>
    </div>
  );
}
