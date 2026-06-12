import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  ActivityLog,
  Application,
  BackupSnapshot,
  ConflictGroup,
  InterviewLog,
  JobTrackExport,
  Stage,
  Stats,
} from "./types";
import {
  CURRENT_SCHEMA_VERSION,
  createBackupSnapshot,
  createExportPayload,
  importJobTrackData,
  limitSnapshots,
  migratePersistedState,
} from "./dataSafety";
import {
  formatDateInputLocal,
  normalizeActivityLogDates,
  normalizeApplicationDates,
  normalizeDate,
  normalizeSnapshotDates,
} from "./date";

// =============================================================================
// Store Types
// =============================================================================

interface JobTrackState {
  schemaVersion: number;
  applications: Application[];
  activityLogs: ActivityLog[];
  backupSnapshots: BackupSnapshot[];

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

  // 数据安全
  exportData: () => JobTrackExport;
  importData: (payload: string | unknown) => void;
  createSnapshot: (reason: string) => string;
  restoreSnapshot: (id: string) => void;
  clearAllData: () => void;
}

function stageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    applied: "已投递",
    written: "笔试中",
    interview1: "初面",
    interview2: "二面",
    final: "终面",
    offer: "Offer",
    rejected: "已拒绝",
    withdrawn: "已撤回",
  };
  return labels[stage];
}

function createActivityLog(
  applicationId: string,
  type: ActivityLog["type"],
  summary: string,
  extra?: Pick<ActivityLog, "fromStage" | "toStage">
): ActivityLog {
  return {
    id: uuidv4(),
    applicationId,
    type,
    summary,
    createdAt: new Date(),
    ...extra,
  };
}

function createSnapshotList(
  reason: string,
  applications: Application[],
  activityLogs: ActivityLog[],
  existing: BackupSnapshot[]
): BackupSnapshot[] {
  if (applications.length === 0 && activityLogs.length === 0) {
    return existing;
  }
  return limitSnapshots([
    createBackupSnapshot(reason, applications, activityLogs),
    ...existing,
  ]);
}


// =============================================================================
// Store Implementation
// =============================================================================

export const useJobTrackStore = create<JobTrackState>()(
  persist(
    (set, get) => ({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      applications: [],
      activityLogs: [],
      backupSnapshots: [],

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
          activityLogs: [
            ...state.activityLogs,
            createActivityLog(id, "created", `新增了 ${newApp.company} 的申请`),
          ],
        }));
        return id;
      },

      updateApplication: (id, patch) => {
        set((state) => ({
          applications: state.applications.map((app) => {
            if (app.id !== id) return app;
            return { ...app, ...patch, updatedAt: new Date() };
          }),
          activityLogs: [
            ...state.activityLogs,
            ...state.applications.flatMap((app) => {
              if (app.id !== id) return [];
              if (patch.stage && patch.stage !== app.stage) {
                const isArchived = patch.stage === "withdrawn" || patch.stage === "rejected";
                return [
                  createActivityLog(
                    id,
                    isArchived ? "archived" : "stage_changed",
                    `${app.company} 从${stageLabel(app.stage)}进入${stageLabel(patch.stage)}`,
                    { fromStage: app.stage, toStage: patch.stage }
                  ),
                ];
              }
              return [createActivityLog(id, "updated", `更新了 ${app.company} 的申请信息`)];
            }),
          ],
        }));
      },

      deleteApplication: (id) => {
        set((state) => ({
          backupSnapshots: createSnapshotList(
            "删除前自动备份",
            state.applications,
            state.activityLogs,
            state.backupSnapshots
          ),
          applications: state.applications.filter((app) => app.id !== id),
          activityLogs: [
            ...state.activityLogs,
            ...state.applications
              .filter((app) => app.id === id)
              .map((app) => createActivityLog(id, "deleted", `删除了 ${app.company} 的申请`)),
          ],
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
              return { ...app, sortOrder: index };
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
          activityLogs: [
            ...state.activityLogs,
            ...state.applications.flatMap((app) => {
              if (app.id !== id || app.stage === newStage) return [];
              const type: ActivityLog["type"] =
                newStage === "rejected" || newStage === "withdrawn"
                  ? "archived"
                  : "stage_changed";
              return [
                createActivityLog(
                  id,
                  type,
                  `${app.company} 从${stageLabel(app.stage)}进入${stageLabel(newStage)}`,
                  { fromStage: app.stage, toStage: newStage }
                ),
              ];
            }),
          ],
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
          activityLogs: [
            ...state.activityLogs,
            ...state.applications
              .filter((app) => app.id === appId)
              .map((app) => createActivityLog(appId, "interview_added", `记录了 ${app.company} 的${log.stage}复盘`)),
          ],
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

      exportData: () => {
        const state = get();
        return createExportPayload(state.applications, state.activityLogs);
      },

      importData: (payload) => {
        const imported = importJobTrackData(payload);
        set((state) => ({
          schemaVersion: CURRENT_SCHEMA_VERSION,
          backupSnapshots: createSnapshotList(
            "导入前自动备份",
            state.applications,
            state.activityLogs,
            state.backupSnapshots
          ),
          applications: imported.applications,
          activityLogs: imported.activityLogs,
        }));
      },

      createSnapshot: (reason) => {
        const state = get();
        const snapshot = createBackupSnapshot(reason, state.applications, state.activityLogs);
        set((current) => ({
          backupSnapshots: limitSnapshots([snapshot, ...current.backupSnapshots]),
        }));
        return snapshot.id;
      },

      restoreSnapshot: (id) => {
        set((state) => {
          const snapshot = state.backupSnapshots.find((item) => item.id === id);
          if (!snapshot) return state;
          const restoredApps = snapshot.applications.map(normalizeApplicationDates);
          const restoredLogs = snapshot.activityLogs.map(normalizeActivityLogDates);
          return {
            applications: restoredApps,
            activityLogs: [
              ...restoredLogs,
              ...restoredApps.map((app) =>
                createActivityLog(app.id, "restored", `从本地快照恢复了 ${app.company}`)
              ),
            ],
            backupSnapshots: createSnapshotList(
              "恢复前自动备份",
              state.applications,
              state.activityLogs,
              state.backupSnapshots
            ),
          };
        });
      },

      clearAllData: () => {
        set((state) => ({
          backupSnapshots: createSnapshotList(
            "清空前自动备份",
            state.applications,
            state.activityLogs,
            state.backupSnapshots
          ),
          applications: [],
          activityLogs: [],
        }));
      },
    }),
    {
      name: "jobtrack-storage",
      version: CURRENT_SCHEMA_VERSION,
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (
            ["appliedAt", "nextDeadline", "createdAt", "updatedAt", "date", "exportedAt"].includes(key) &&
            typeof value === "string"
          ) {
            return normalizeDate(value);
          }
          return value;
        },
      }),
      migrate: (persistedState) => migratePersistedState(persistedState),
      merge: (persistedState, currentState) => {
        const migrated = migratePersistedState(persistedState);
        return {
          ...currentState,
          ...migrated,
          backupSnapshots: migrated.backupSnapshots.map(normalizeSnapshotDates),
        };
      },
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        applications: state.applications,
        activityLogs: state.activityLogs,
        backupSnapshots: state.backupSnapshots,
      }),
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
      const dateKey = formatDateInputLocal(log.date);
      const existing = dateMap.get(dateKey) || [];
      existing.push({ app, isInterview: true });
      dateMap.set(dateKey, existing);
    });

    // 即将到来的面试截止日期也算
    if (app.nextDeadline && app.stage !== "offer") {
      const dateKey = formatDateInputLocal(app.nextDeadline);
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
