"use client";

import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { AlertCircle, X } from "lucide-react";
import type { ConflictGroup } from "@/lib/types";

interface ConflictBannerProps {
  conflicts: ConflictGroup[];
  onConflictClick: (date: string) => void;
  onDismiss: () => void;
  visible: boolean;
}

export function ConflictBanner({
  conflicts,
  onConflictClick,
  onDismiss,
  visible,
}: ConflictBannerProps) {
  if (!visible || conflicts.length === 0) return null;

  // 只显示最近的冲突
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingConflicts = conflicts.filter(
    (c) => new Date(c.date) >= today
  );

  if (upcomingConflicts.length === 0) return null;

  const nearest = upcomingConflicts[0];
  const date = new Date(nearest.date);
  const count = nearest.applications.length;

  return (
    <div className="mx-6 mt-4 bg-[#FEF3F2] border border-danger/20 rounded-lg px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle size={18} className="text-danger flex-shrink-0" />
          <div>
            <p className="text-sm text-danger font-medium">
              你在 {format(date, "M 月 d 日", { locale: zhCN })} 有{" "}
              <span className="font-semibold">{count} 场面试冲突</span>
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              点击查看详情并获取时间调整建议
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onConflictClick(nearest.date)}
            className="px-3 py-1.5 text-xs text-danger border border-danger rounded-md hover:bg-danger/10 transition-colors"
          >
            查看详情
          </button>
          <button
            onClick={onDismiss}
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
