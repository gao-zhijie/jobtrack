"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Application, Stage } from "@/lib/types";
import { STAGE_CONFIG } from "@/lib/types";
import { Card } from "./Card";

interface ColumnProps {
  stage: Stage;
  applications: Application[];
  onCardClick?: (app: Application) => void;
}

export function Column({ stage, applications, onCardClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: "column", stage },
  });

  const config = STAGE_CONFIG.find((s) => s.key === stage);
  const stageName = config?.label || stage;
  const stageColor = config?.color || "#6F7177";

  const isEmpty = applications.length === 0;
  const isAppliedColumn = stage === "applied";
  const showPlaceholder = isOver;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col w-[280px] min-h-[70vh] rounded-lg
        transition-colors duration-200
        ${showPlaceholder ? "bg-primary/5 ring-2 ring-primary ring-dashed ring-inset" : "bg-background"}
      `}
    >
      {/* 列头 */}
      <div className="px-1 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-sm font-medium text-text-primary"
            style={{ color: stageColor }}
          >
            {stageName}
          </span>
          <span
            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${stageColor}20`,
              color: stageColor,
            }}
          >
            {applications.length}
          </span>
        </div>
        {/* 状态色分割线 */}
        <div className="h-0.5 rounded-full" style={{ backgroundColor: stageColor }} />
      </div>

      {/* 卡片列表 */}
      <div className="flex-1 px-1 space-y-2">
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <Card
              key={app.id}
              application={app}
              onClick={() => onCardClick?.(app)}
            />
          ))}
        </SortableContext>

        {/* 空列提示 */}
        {isEmpty && (
          <div
            className={`
              flex flex-col items-center justify-center py-8 px-4
              border-2 border-dashed rounded-lg
              ${isAppliedColumn ? "border-text-muted/30" : "border-text-muted/20"}
            `}
          >
            {isAppliedColumn ? (
              <>
                <Plus size={20} className="text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">
                  还没有投递
                  <br />
                  点右上角开始
                </p>
              </>
            ) : (
              <p className="text-xs text-text-muted">暂无</p>
            )}
          </div>
        )}

        {/* 拖拽占位符 */}
        {showPlaceholder && !isEmpty && (
          <div className="h-[80px] border-2 border-dashed border-primary/50 rounded-lg bg-primary/5" />
        )}
      </div>
    </div>
  );
}
