import { describe, expect, it } from "vitest";
import type { ActivityLog, Application } from "./types";
import { calculateWeekReport } from "./weeklyReport";

function app(): Application {
  return {
    id: "app-1",
    company: "京东",
    position: "产品经理",
    platform: "official",
    appliedAt: new Date(),
    stage: "written",
    sortOrder: 0,
    interviewLogs: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("weekly report activity history", () => {
  it("uses activity logs to calculate stage advances", () => {
    const now = new Date();
    const log: ActivityLog = {
      id: "activity-1",
      applicationId: "app-1",
      type: "stage_changed",
      fromStage: "applied",
      toStage: "written",
      summary: "京东进入笔试",
      createdAt: now,
    };

    const report = calculateWeekReport([app()], [log], now);

    expect(report.advances).toEqual([
      { company: "京东", from: "已投递", to: "笔试中" },
    ]);
    expect(report.recentAdvances).toEqual([{ company: "京东", to: "笔试中" }]);
  });
});
