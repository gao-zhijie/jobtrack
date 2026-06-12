import { describe, expect, it } from "vitest";
import type { Application } from "./types";
import {
  formatDateInputLocal,
  normalizeApplicationDates,
  parseDateInputLocal,
} from "./date";

describe("local date helpers", () => {
  it("parses date input as a local midnight date", () => {
    const parsed = parseDateInputLocal("2026-06-12");

    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(5);
    expect(parsed.getDate()).toBe(12);
    expect(parsed.getHours()).toBe(0);
  });

  it("formats date input without UTC timezone shifting", () => {
    const localEvening = new Date(2026, 0, 2, 23, 30);

    expect(formatDateInputLocal(localEvening)).toBe("2026-01-02");
  });

  it("normalizes persisted application date strings back to Date values", () => {
    const application = {
      id: "app-1",
      company: "字节跳动",
      position: "产品经理",
      platform: "official",
      appliedAt: "2026-06-01",
      stage: "applied",
      sortOrder: 1,
      nextDeadline: "2026-06-12",
      interviewLogs: [
        {
          id: "log-1",
          stage: "初面",
          date: "2026-06-10",
          questions: [],
          performance: "good",
          reflection: "准备充分。",
        },
      ],
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z",
    } as unknown as Application;

    const normalized = normalizeApplicationDates(application);

    expect(normalized.appliedAt).toBeInstanceOf(Date);
    expect(normalized.nextDeadline).toBeInstanceOf(Date);
    expect(normalized.interviewLogs[0].date).toBeInstanceOf(Date);
  });
});
