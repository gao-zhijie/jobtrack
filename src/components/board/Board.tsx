"use client";

import { useState, useEffect } from "react";
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

// 需要弹出复盘表单的阶段
const INTERVIEW_STAGES: Stage[] = ["interview1", "interview2", "final"];
const ENDED_STAGES: Stage[] = ["rejected", "withdrawn"];

export function Board() {
  const applications = useJobTrackStore((state) => state.applications);
  const moveStage = useJobTrackStore((state) => state.moveStage);
  const reorderApplications = useJobTrackStore((state) => state.updateApplication);
  const addInterviewLog = useJobTrackStore((state) => state.addInterviewLog);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showEnded, setShowEnded] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

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

  // 按阶段分组应用
  const getByStage = (stage: Stage) =>
    applications.filter((app) => app.stage === stage);

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
      // 检查是否需要弹出复盘表单
      const needsReflection =
        (INTERVIEW_STAGES.includes(targetStage) && fromStage !== "applied") ||
        ENDED_STAGES.includes(targetStage);

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
        reordered.forEach((app) => {
          reorderApplications(app.id, { updatedAt: new Date() });
        });
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

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
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
            applications={getByStage(stage)}
            onCardClick={setSelectedApp}
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
              {getByStage("rejected").length + getByStage("withdrawn").length}
            </span>
          </button>

          {showEnded && (
            <div className="mt-2">
              <Column
                stage="rejected"
                applications={getByStage("rejected")}
                onCardClick={setSelectedApp}
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

      {/* Card Detail Drawer */}
      <CardDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />

      {/* New Application Form */}
      {showNewForm && (
        <>
          <div
            className="fixed inset-0 bg-black/10 z-40"
            onClick={() => setShowNewForm(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl z-50">
            <CardForm
              onClose={() => setShowNewForm(false)}
              onSave={() => setShowNewForm(false)}
            />
          </div>
        </>
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
    </div>
  );
}

// Helper function to get stage label for interview log
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
