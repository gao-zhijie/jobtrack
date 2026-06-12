import { describe, expect, it } from "vitest";
import type { Application } from "./types";
import { getApplicationReminder, getFocusItems } from "./reminders";

function app(overrides: Partial<Application>): Application {
  return {
    id: "app-1",
    company: "腾讯",
    position: "产品经理",
    platform: "official",
    appliedAt: new Date(2026, 4, 1),
    stage: "applied",
    sortOrder: 0,
    interviewLogs: [],
    createdAt: new Date(2026, 4, 1),
    updatedAt: new Date(2026, 4, 1),
    ...overrides,
  };
}

describe("application reminders", () => {
  const now = new Date(2026, 5, 12, 10);

  it("prioritizes overdue deadlines", () => {
    const reminder = getApplicationReminder(
      app({ nextDeadline: new Date(2026, 5, 11) }),
      now
    );

    expect(reminder?.type).toBe("overdue");
    expect(reminder?.sublabel).toContain("超时");
  });

  it("uses updatedAt to detect stale active applications", () => {
    const reminder = getApplicationReminder(
      app({
        appliedAt: new Date(2026, 0, 1),
        updatedAt: new Date(2026, 4, 28),
      }),
      now
    );

    expect(reminder?.type).toBe("stale");
    expect(reminder?.sublabel).toContain("15 天");
  });

  it("sorts focus items by urgency", () => {
    const focusItems = getFocusItems(
      [
        app({ id: "stale", updatedAt: new Date(2026, 4, 20) }),
        app({ id: "deadline", nextDeadline: new Date(2026, 5, 12, 18) }),
        app({ id: "offer", stage: "offer", updatedAt: now }),
      ],
      now
    );

    expect(focusItems.map((item) => item.type)).toEqual([
      "deadline24h",
      "stale",
      "newOffer",
    ]);
  });
});
