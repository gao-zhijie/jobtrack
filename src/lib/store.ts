import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Application, InterviewLog, Stage, Stats, ConflictGroup } from "./types";
import { MOCK_APPLICATIONS } from "./mock";

// =============================================================================
// Store Types
// =============================================================================

interface JobTrackState {
  applications: Application[];

  // CRUD
  addApplication: (data: Omit<Application, "id" | "createdAt" | "updatedAt" | "interviewLogs">) => string;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  reorderApplications: (stage: Stage, orderedIds: string[]) => void;

  // Stage 流转
  moveStage: (id: string, newStage: Stage) => void;

  // 面试复盘
  addInterviewLog: (appId: string, log: Omit<InterviewLog, "id">) => void;
  updateInterviewLog: (appId: string, logId: string, patch: Partial<InterviewLog>) => void;
  deleteInterviewLog: (appId: string, logId: string) => void;
}


// =============================================================================
// Store Implementation
// =============================================================================

export const useJobTrackStore = create<JobTrackState>()(
  persist(
    (set) => ({
      applications: MOCK_APPLICATIONS,

      addApplication: (data) => {
        const id = uuidv4();
        const now = new Date();
        const newApp: Application = {
          ...data,
          id,
          sortOrder: Date.now(),
          interviewLogs: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          applications: [...state.applications, newApp],
        }));
        return id;
      },

      updateApplication: (id, patch) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, ...patch, updatedAt: new Date() }
              : app
          ),
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        }));
      },

      reorderApplications: (stage, orderedIds) => {
        set((state) => {
          // Update sortOrder for apps in this stage based on their position in orderedIds
          const stageApps = state.applications.filter((app) => app.stage === stage);
          const otherApps = state.applications.filter((app) => app.stage !== stage);

          const updatedStageApps = orderedIds.map((id, index) => {
            const app = stageApps.find((a) => a.id === id);
            if (app) {
              return { ...app, sortOrder: index, updatedAt: new Date() };
            }
            return null;
          }).filter(Boolean) as Application[];

          return {
            applications: [...otherApps, ...updatedStageApps],
          };
        });
      },

      moveStage: (id, newStage) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id
              ? { ...app, stage: newStage, updatedAt: new Date() }
              : app
          ),
        }));
      },

      addInterviewLog: (appId, log) => {
        const logId = uuidv4();
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === appId
              ? {
                  ...app,
                  interviewLogs: [
                    ...app.interviewLogs,
                    { ...log, id: logId },
                  ],
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },

      updateInterviewLog: (appId, logId, patch) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === appId
              ? {
                  ...app,
                  interviewLogs: app.interviewLogs.map((log) =>
                    log.id === logId ? { ...log, ...patch } : log
                  ),
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },

      deleteInterviewLog: (appId, logId) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === appId
              ? {
                  ...app,
                  interviewLogs: app.interviewLogs.filter(
                    (log) => log.id !== logId
                  ),
                  updatedAt: new Date(),
                }
              : app
          ),
        }));
      },
    }),
    {
      name: "jobtrack-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ applications: state.applications }),
    }
  )
);

// =============================================================================
// Selectors（派生数据，通过 hook 外部计算）
// =============================================================================

export const selectApplications = (state: JobTrackState) =>
  state.applications;

export const selectByStage = (
  applications: Application[],
  stage: Stage
): Application[] =>
  applications.filter((app) => app.stage === stage);

export const selectTodayDeadlines = (
  applications: Application[]
): Application[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return applications.filter((app) => {
    if (!app.nextDeadline) return false;
    const deadline = new Date(app.nextDeadline);
    return deadline >= today && deadline < tomorrow;
  });
};

export const selectWeekDeadlines = (
  applications: Application[]
): Application[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return applications.filter((app) => {
    if (!app.nextDeadline) return false;
    const deadline = new Date(app.nextDeadline);
    return deadline >= today && deadline < weekEnd;
  });
};

export const selectStaleApplications = (
  applications: Application[]
): Application[] => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  return applications.filter((app) => {
    // 还在流程中（不是 rejected/withdrawn/offer）且 14 天无更新
    const isActive = !["rejected", "withdrawn", "offer"].includes(app.stage);
    const isStale = new Date(app.updatedAt) < fourteenDaysAgo;
    return isActive && isStale;
  });
};

export const selectStats = (applications: Application[]): Stats => {
  const total = applications.length;
  const interviewStages: Stage[] = ["interview1", "interview2", "final"];
  const interviewing = applications.filter((app) =>
    interviewStages.includes(app.stage)
  ).length;
  const offer = applications.filter((app) => app.stage === "offer").length;
  const rejected = applications.filter(
    (app) => app.stage === "rejected" || app.stage === "withdrawn"
  ).length;

  // 面试转化率 = 有过面试记录的应用 / 总投递
  const uniqueAppIdsWithInterviews = new Set(
    applications.flatMap((app) =>
      app.interviewLogs.length > 0 ? [app.id] : []
    )
  );
  const interviewRate = total > 0 ? (uniqueAppIdsWithInterviews.size / total) * 100 : 0;

  return { total, interviewing, offer, rejected, interviewRate };
};

export const selectConflicts = (
  applications: Application[]
): ConflictGroup[] => {
  // 收集所有事件（面试记录 + 截止日期）
  const dateMap = new Map<string, { app: Application; isInterview: boolean }[]>();

  applications.forEach((app) => {
    // 已有面试记录的日期
    app.interviewLogs.forEach((log) => {
      const dateKey = new Date(log.date).toISOString().split("T")[0];
      const existing = dateMap.get(dateKey) || [];
      existing.push({ app, isInterview: true });
      dateMap.set(dateKey, existing);
    });

    // 即将到来的面试截止日期也算
    if (app.nextDeadline && app.stage !== "offer") {
      const dateKey = new Date(app.nextDeadline).toISOString().split("T")[0];
      const existing = dateMap.get(dateKey) || [];
      existing.push({ app, isInterview: false });
      dateMap.set(dateKey, existing);
    }
  });

  // 过滤出冲突（同一日期 > 1 事件）
  const conflicts: ConflictGroup[] = [];
  dateMap.forEach((events, date) => {
    if (events.length > 1) {
      // 去重：同一应用在同一日期的多个事件只显示一次
      const uniqueApps = Array.from(new Set(events.map((e) => e.app.id)))
        .map((id) => events.find((e) => e.app.id === id)!.app);
      conflicts.push({ date, applications: uniqueApps });
    }
  });

  return conflicts.sort((a, b) => a.date.localeCompare(b.date));
};
