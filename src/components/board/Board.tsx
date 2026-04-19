"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useJobTrackStore } from "@/lib/store";
import type { Application, Stage, Performance } from "@/lib/types";
import { Column } from "./Column";
import { Card } from "./Card";
import { MobileCard } from "./MobileCard";
import { CardDrawer } from "@/components/card/CardDrawer";
import { CardForm } from "@/components/card/CardForm";
import { InterviewLogModal } from "@/components/card/InterviewLogModal";
import { Celebration } from "@/components/ui/Celebration";
import { showToast } from "@/components/ui/Toast";

// 看板列顺序
const BOARD_STAGES: Stage[] = [
  "applied",
  "written",
  "interview1",
  "interview2",
  "final",
  "offer",
];

// 移动端筛选选项
const MOBILE_FILTERS: { key: Stage | "all" | "ended"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "applied", label: "已投递" },
  { key: "written", label: "笔试" },
  { key: "interview1", label: "一面" },
  { key: "interview2", label: "二面" },
  { key: "final", label: "终面" },
  { key: "offer", label: "Offer" },
  { key: "ended", label: "已结束" },
];

// 需要弹出复盘表单的阶段
const INTERVIEW_STAGES: Stage[] = ["interview1", "interview2", "final"];
const ENDED_STAGES: Stage[] = ["rejected", "withdrawn"];

// 获取阶段标签
function getStageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    applied: "已投递",
    written: "笔试",
    interview1: "初面",
    interview2: "二面",
    final: "终面",
    offer: "Offer",
    rejected: "已拒绝",
    withdrawn: "已撤回",
  };
  return labels[stage] || stage;
}

export function Board() {
  const applications = useJobTrackStore((state) => state.applications);
  const moveStage = useJobTrackStore((state) => state.moveStage);
  const reorderApplications = useJobTrackStore((state) => state.reorderApplications);
  const addInterviewLog = useJobTrackStore((state) => state.addInterviewLog);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showEnded, setShowEnded] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [mobileFilter, setMobileFilter] = useState<Stage | "all" | "ended">("all");

  // 复盘表单状态
  const [pendingMove, setPendingMove] = useState<{
    appId: string;
    targetStage: Stage;
    fromStage: Stage;
  } | null>(null);

  // 庆祝动画状态
  const [showCelebration, setShowCelebration] = useState(false);

  // Listen for the custom event from Header
  useEffect(() => {
    const handleOpenNew = () => setShowNewForm(true);
    window.addEventListener("open-new-application", handleOpenNew);
    return () => window.removeEventListener("open-new-application", handleOpenNew);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N: New application
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setShowNewForm(true);
      }
      // Escape: Close drawer/form
      if (e.key === "Escape") {
        if (showNewForm) {
          setShowNewForm(false);
        } else if (selectedApp) {
          setSelectedApp(null);
        } else if (pendingMove) {
          setPendingMove(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNewForm, selectedApp, pendingMove]);

  // 当前拖拽的卡片
  const activeApplication = activeId
    ? applications.find((app) => app.id === activeId)
    : null;

  // 按阶段分组应用 — 用 useMemo 稳定引用
  const byStage = useMemo(() => {
    const allStages: Stage[] = [...BOARD_STAGES, "rejected", "withdrawn"];
    const map = {} as Record<Stage, Application[]>;
    for (const stage of allStages) {
      map[stage] = applications
        .filter((app) => app.stage === stage)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [applications]);

  // 兼容旧调用方式（handleDragEnd 内部用）
  const getByStage = (stage: Stage) => byStage[stage] ?? [];

  // 稳定的卡片点击回调
  const handleCardClick = useCallback((app: Application) => {
    setSelectedApp(app);
  }, []);

  // 移动端筛选后的卡片列表
  const filteredMobileApps = useMemo(() => {
    if (mobileFilter === "all") {
      // 显示进行中的阶段
      return BOARD_STAGES.flatMap((stage) => byStage[stage] ?? []);
    } else if (mobileFilter === "ended") {
      return [...(byStage["rejected"] ?? []), ...(byStage["withdrawn"] ?? [])];
    } else {
      return byStage[mobileFilter] ?? [];
    }
  }, [mobileFilter, byStage]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeApp = applications.find((app) => app.id === active.id);
    if (!activeApp) return;

    // 判断目标是列还是卡片
    const overData = over.data.current;
    let targetStage: Stage;

    if (overData?.type === "column") {
      targetStage = overData.stage as Stage;
    } else if (overData?.type === "card") {
      targetStage = overData.application.stage as Stage;
    } else {
      return;
    }

    const fromStage = activeApp.stage;

    // 如果跨列移动
    if (fromStage !== targetStage) {
      // 计算阶段在顺序数组中的索引，判断是前进还是后退
      const fromIndex = BOARD_STAGES.indexOf(fromStage as Stage);
      const toIndex = BOARD_STAGES.indexOf(targetStage);
      const isForward = toIndex > fromIndex;

      // 只有前进（往后一个阶段）才弹出复盘表单，后退不弹
      const needsReflection =
        isForward &&
        ((INTERVIEW_STAGES.includes(targetStage) && fromStage !== "applied") ||
          ENDED_STAGES.includes(targetStage));

      if (needsReflection) {
        // 保存待处理移动，弹出复盘表单
        setPendingMove({
          appId: activeApp.id,
          targetStage,
          fromStage,
        });
      } else {
        // 直接移动
        moveStage(activeApp.id, targetStage);

        // 如果是移动到 Offer，显示庆祝
        if (targetStage === "offer") {
          setShowCelebration(true);
        }
      }
    } else {
      // 同列内排序
      const stageApps = getByStage(targetStage);
      const oldIndex = stageApps.findIndex((app) => app.id === active.id);
      const newIndex = overData?.type === "card"
        ? stageApps.findIndex((app) => app.id === over.id)
        : oldIndex;

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(stageApps, oldIndex, newIndex);
        const orderedIds = reordered.map((app) => app.id);
        reorderApplications(targetStage, orderedIds);
      }
    }
  };

  const handleSaveInterviewLog = (data: {
    questions: string[];
    performance: Performance;
    reflection: string;
    interviewerStyle?: string;
  }) => {
    if (!pendingMove) return;

    // 添加复盘记录
    addInterviewLog(pendingMove.appId, {
      stage: getStageLabel(pendingMove.targetStage),
      date: new Date(),
      questions: data.questions,
      performance: data.performance,
      reflection: data.reflection,
      interviewerStyle: data.interviewerStyle,
    });

    // 移动阶段
    moveStage(pendingMove.appId, pendingMove.targetStage);

    // Toast 通知
    showToast({ type: "success", message: "记录已保存" });

    // 如果是移动到 Offer，显示庆祝
    if (pendingMove.targetStage === "offer") {
      setShowCelebration(true);
    }
  };

  const handleSkipInterviewLog = () => {
    if (!pendingMove) return;

    // 直接移动
    moveStage(pendingMove.appId, pendingMove.targetStage);

    // 如果是移动到 Offer，显示庆祝
    if (pendingMove.targetStage === "offer") {
      setShowCelebration(true);
    }
  };

  // ==================== 移动端视图 ====================
  const MobileBoardView = () => (
    <div className="md:hidden">
      {/* 横向滚动的 Chip 筛选器 */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {MOBILE_FILTERS.map((filter) => {
          const count = filter.key === "all"
            ? applications.filter((a) => !["rejected", "withdrawn"].includes(a.stage)).length
            : filter.key === "ended"
            ? (byStage["rejected"]?.length ?? 0) + (byStage["withdrawn"]?.length ?? 0)
            : (byStage[filter.key as Stage]?.length ?? 0);

          return (
            <button
              key={filter.key}
              onClick={() => setMobileFilter(filter.key)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                whitespace-nowrap transition-colors duration-200
                ${mobileFilter === filter.key
                  ? "bg-primary text-white"
                  : "bg-white border border-border text-text-secondary hover:border-text-muted"
                }
              `}
            >
              {filter.label}
              {count > 0 && (
                <span className={`
                  text-xs ${mobileFilter === filter.key ? "text-white/80" : "text-text-muted"}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 垂直卡片列表 */}
      <div className="space-y-3">
        {filteredMobileApps.length > 0 ? (
          filteredMobileApps.map((app) => (
            <MobileCard
              key={app.id}
              application={app}
              onClick={() => handleCardClick(app)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            暂无申请
          </div>
        )}
      </div>
    </div>
  );

  // ==================== 桌面端视图 ====================
  const DesktopBoardView = () => (
    <div className="hidden md:flex gap-6 overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* 6 列看板 */}
        {BOARD_STAGES.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            applications={byStage[stage] ?? []}
            onCardClick={handleCardClick}
          />
        ))}

        {/* 已结束列 - 默认收起 */}
        <div className="w-[280px]">
          <button
            onClick={() => setShowEnded(!showEnded)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span
              className={`
                transition-transform duration-200
                ${showEnded ? "rotate-90" : ""}
              `}
            >
              ▶
            </span>
            已结束
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium bg-text-muted/20 text-text-muted">
              {(byStage["rejected"]?.length ?? 0) + (byStage["withdrawn"]?.length ?? 0)}
            </span>
          </button>

          {showEnded && (
            <div className="mt-2">
              <Column
                stage="rejected"
                applications={byStage["rejected"] ?? []}
                onCardClick={handleCardClick}
              />
            </div>
          )}
        </div>

        {/* 拖拽 Overlay */}
        <DragOverlay>
          {activeApplication ? (
            <div className="rotate-1 opacity-80">
              <Card application={activeApplication} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  return (
    <>
      {/* 移动端视图 */}
      <MobileBoardView />

      {/* 桌面端视图 */}
      <DesktopBoardView />

      {/* Card Detail Drawer - 响应式 */}
      <CardDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />

      {/* New Application Form - 响应式 */}
      {showNewForm && (
        <NewApplicationModal onClose={() => setShowNewForm(false)} />
      )}

      {/* Interview Log Modal */}
      {pendingMove && (
        <InterviewLogModal
          onSave={handleSaveInterviewLog}
          onSkip={handleSkipInterviewLog}
          onClose={() => setPendingMove(null)}
        />
      )}

      {/* Celebration Animation */}
      {showCelebration && (
        <Celebration onComplete={() => setShowCelebration(false)} />
      )}
    </>
  );
}

// 新建申请弹窗 - 响应式（桌面右侧抽屉，移动端全屏）
function NewApplicationModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 z-40 md:hidden"
        onClick={onClose}
      />
      {/* 移动端全屏 */}
      <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border px-4 h-11 flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">新建申请</span>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <CardForm onClose={onClose} onSave={onClose} />
        </div>
      </div>
      {/* 桌面端右侧抽屉 */}
      <div
        className="fixed inset-0 bg-black/10 z-40 hidden md:block"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl z-50 hidden md:block">
        <CardForm onClose={onClose} onSave={onClose} />
      </div>
    </>
  );
}
