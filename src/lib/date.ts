import type { ActivityLog, Application, BackupSnapshot } from "./types";

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateInputLocal(value: string): Date {
  const match = DATE_INPUT_PATTERN.exec(value);
  if (!match) return new Date(value);

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function formatDateInputLocal(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDate(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  return parseDateInputLocal(value);
}

export function normalizeApplicationDates(application: Application): Application {
  return {
    ...application,
    appliedAt: normalizeDate(application.appliedAt)!,
    nextDeadline: normalizeDate(application.nextDeadline),
    interviewLogs: application.interviewLogs.map((log) => ({
      ...log,
      date: normalizeDate(log.date)!,
    })),
    createdAt: normalizeDate(application.createdAt)!,
    updatedAt: normalizeDate(application.updatedAt)!,
  };
}

export function normalizeActivityLogDates(log: ActivityLog): ActivityLog {
  return {
    ...log,
    createdAt: normalizeDate(log.createdAt)!,
  };
}

export function normalizeSnapshotDates(snapshot: BackupSnapshot): BackupSnapshot {
  return {
    ...snapshot,
    createdAt: normalizeDate(snapshot.createdAt)!,
    applications: snapshot.applications.map(normalizeApplicationDates),
    activityLogs: snapshot.activityLogs.map(normalizeActivityLogDates),
  };
}

export function isSameLocalDay(a: Date | string, b: Date | string): boolean {
  const left = normalizeDate(a)!;
  const right = normalizeDate(b)!;
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
