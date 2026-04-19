"use client";

import { useState } from "react";
import { formatDistanceToNow, differenceInDays, isBefore, addDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Archive, ChevronRight, AlertCircle } from "lucide-react";
import type { Application } from "@/lib/types";
import { STAGE_CONFIG } from "@/lib/types";
import { useJobTrackStore } from "@/lib/store";

interface MobileCardProps {
  application: Application;
  onClick?: () => void;
}

export function MobileCard({ application, onClick }: MobileCardProps) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const updateApplication = useJobTrackStore((state) => state.updateApplication);

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

  const stageConfig = STAGE_CONFIG.find((s) => s.key === application.stage);

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowArchiveConfirm(true);
  };

  const confirmArchive = () => {
    updateApplication(application.id, { stage: "withdrawn" });
    setShowArchiveConfirm(false);
  };

  // 紧急态
  if (isUrgent) {
    return (
      <div
        onClick={onClick}
        className="relative bg-white rounded-lg border border-border cursor-pointer active:bg-background transition-colors"
      >
        {/* 左侧紧急色条 */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg bg-danger" />

        <div className="flex items-center gap-3 px-3 py-3">
          {/* 左侧：公司和岗位 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-text-primary truncate">
                {application.company}
              </span>
              <AlertCircle size={14} className="text-danger flex-shrink-0 animate-pulse" />
            </div>
            <div className="text-[13px] text-text-secondary mt-0.5">
              {application.position}
            </div>
          </div>

          {/* 右侧：状态和天数 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: stageConfig?.color }}
              />
              <div className="text-xs text-danger font-medium mt-1">
                {application.nextDeadline && (
                  isOverdue
                    ? `超时 ${differenceInDays(new Date(), new Date(application.nextDeadline))} 天`
                    : formatDistanceToNow(new Date(application.nextDeadline), {
                        locale: zhCN,
                        addSuffix: true,
                      })
                )}
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted" />
          </div>
        </div>
      </div>
    );
  }

  // 休眠态
  if (isStale) {
    return (
      <div
        onClick={onClick}
        className="relative bg-white rounded-lg border border-border cursor-pointer active:bg-background transition-colors"
      >
        <div className="flex items-center gap-3 px-3 py-3">
          {/* 左侧：公司和岗位 */}
          <div className="flex-1 min-w-0 opacity-60">
            <div className="font-medium text-[15px] text-text-primary truncate">
              {application.company}
            </div>
            <div className="text-[13px] text-text-secondary mt-0.5">
              {application.position}
            </div>
          </div>

          {/* 右侧：归档建议 */}
          <button
            onClick={handleArchive}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-danger transition-colors px-2 py-1"
          >
            <Archive size={14} />
            归档
          </button>
        </div>

        {/* 归档确认 */}
        {showArchiveConfirm && (
          <div className="absolute inset-x-0 bottom-0 bg-white border-t border-border p-3 flex items-center justify-between">
            <span className="text-sm text-text-primary">确认归档？</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-3 py-1 text-xs text-text-secondary bg-background rounded"
              >
                取消
              </button>
              <button
                onClick={confirmArchive}
                className="px-3 py-1 text-xs text-white bg-danger rounded"
              >
                归档
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 普通态
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-lg border border-border cursor-pointer active:bg-background transition-colors"
    >
      <div className="flex items-center gap-3 px-3 py-3">
        {/* 左侧：公司和岗位 */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[15px] text-text-primary truncate">
            {application.company}
          </div>
          <div className="text-[13px] text-text-secondary mt-0.5">
            {application.position}
          </div>
        </div>

        {/* 右侧：状态色圆点、天数、截止 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 状态色圆点 */}
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: stageConfig?.color }}
            title={stageConfig?.label}
          />

          {/* 天数 */}
          <div className="text-xs text-text-muted whitespace-nowrap">
            ·{daysSinceApplied}天
          </div>

          {/* 截止倒计时 */}
          {application.nextDeadline && (
            <div className="text-xs text-text-muted whitespace-nowrap">
              {formatDistanceToNow(new Date(application.nextDeadline), {
                locale: zhCN,
                addSuffix: true,
              })}
            </div>
          )}

          <ChevronRight size={18} className="text-text-muted" />
        </div>
      </div>
    </div>
  );
}
