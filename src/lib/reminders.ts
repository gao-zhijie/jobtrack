import { addDays, differenceInDays, endOfDay, isAfter, isBefore, isToday, startOfDay } from "date-fns";
import type { Application } from "./types";

export type ReminderType =
  | "overdue"
  | "deadline24h"
  | "stale"
  | "newOffer"
  | "todayInterview";

export interface ApplicationReminder {
  app: Application;
  type: ReminderType;
  sublabel: string;
}

const ACTIVE_ENDED_STAGES = ["rejected", "withdrawn", "offer"];

function isActive(app: Application): boolean {
  return !ACTIVE_ENDED_STAGES.includes(app.stage);
}

export function getApplicationReminder(
  app: Application,
  now = new Date()
): ApplicationReminder | null {
  const todayStart = startOfDay(now);
  const tomorrowEnd = endOfDay(addDays(now, 1));

  if (app.stage === "offer") {
    const daysSinceUpdate = differenceInDays(now, new Date(app.updatedAt));
    if (daysSinceUpdate <= 7) {
      return { app, type: "newOffer", sublabel: "新 Offer 需要确认" };
    }
    return null;
  }

  if (app.nextDeadline) {
    const deadline = new Date(app.nextDeadline);
    if (isBefore(deadline, todayStart)) {
      const daysOverdue = Math.max(1, differenceInDays(todayStart, startOfDay(deadline)));
      return { app, type: "overdue", sublabel: `截止已超时 ${daysOverdue} 天` };
    }

    if (!isAfter(deadline, tomorrowEnd)) {
      return { app, type: "deadline24h", sublabel: "24h 内截止" };
    }
  }

  const todayInterview = app.interviewLogs.find((log) => isToday(new Date(log.date)));
  if (todayInterview) {
    return { app, type: "todayInterview", sublabel: `今日面试：${todayInterview.stage}` };
  }

  if (isActive(app)) {
    const daysSinceUpdate = differenceInDays(now, new Date(app.updatedAt));
    if (daysSinceUpdate >= 14) {
      return {
        app,
        type: "stale",
        sublabel: `已经 ${daysSinceUpdate} 天没更新，适合决定是否归档`,
      };
    }
  }

  return null;
}

const priorityOrder: Record<ReminderType, number> = {
  overdue: 0,
  deadline24h: 1,
  stale: 2,
  newOffer: 3,
  todayInterview: 4,
};

export function getFocusItems(
  applications: Application[],
  now = new Date()
): ApplicationReminder[] {
  return applications
    .map((app) => getApplicationReminder(app, now))
    .filter((item): item is ApplicationReminder => item !== null)
    .sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type])
    .slice(0, 3);
}
