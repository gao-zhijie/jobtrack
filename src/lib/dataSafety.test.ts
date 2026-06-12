import { describe, expect, it } from "vitest";
import type { ActivityLog, Application } from "./types";
import {
  CURRENT_SCHEMA_VERSION,
  createBackupSnapshot,
  createExportPayload,
  importJobTrackData,
  migratePersistedState,
} from "./dataSafety";

function app(): Application {
  return {
    id: "app-1",
    company: "美团",
    position: "产品经理",
    platform: "official",
    appliedAt: new Date(2026, 5, 1),
    stage: "applied",
    sortOrder: 0,
    interviewLogs: [],
    createdAt: new Date(2026, 5, 1),
    updatedAt: new Date(2026, 5, 2),
  };
}

describe("data safety helpers", () => {
  it("creates export payloads with schema version and normalized data", () => {
    const payload = createExportPayload([app()], []);

    expect(payload.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(payload.applications).toHaveLength(1);
    expect(payload.exportedAt).toBeInstanceOf(Date);
  });

  it("imports exported data and restores Date values", () => {
    const imported = importJobTrackData(
      JSON.stringify(createExportPayload([app()], []))
    );

    expect(imported.applications[0].appliedAt).toBeInstanceOf(Date);
    expect(imported.activityLogs).toEqual([]);
  });

  it("creates bounded local backup snapshots", () => {
    const snapshot = createBackupSnapshot("删除前备份", [app()], []);

    expect(snapshot.reason).toBe("删除前备份");
    expect(snapshot.applications[0].id).toBe("app-1");
  });

  it("migrates old persisted state without mock data pollution", () => {
    const migrated = migratePersistedState({
      applications: [app()],
    });

    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.applications).toHaveLength(1);
    expect(migrated.activityLogs).toEqual([]);
  });

  it("keeps activity logs when importing data", () => {
    const log: ActivityLog = {
      id: "activity-1",
      applicationId: "app-1",
      type: "stage_changed",
      fromStage: "applied",
      toStage: "written",
      summary: "进入笔试",
      createdAt: new Date(2026, 5, 3),
    };

    const imported = importJobTrackData(
      JSON.stringify(createExportPayload([app()], [log]))
    );

    expect(imported.activityLogs[0].createdAt).toBeInstanceOf(Date);
    expect(imported.activityLogs[0].type).toBe("stage_changed");
  });
});
