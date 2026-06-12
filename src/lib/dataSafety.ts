import { v4 as uuidv4 } from "uuid";
import type { ActivityLog, Application, BackupSnapshot, JobTrackExport } from "./types";
import {
  normalizeActivityLogDates,
  normalizeApplicationDates,
  normalizeDate,
  normalizeSnapshotDates,
} from "./date";

export const CURRENT_SCHEMA_VERSION = 2;
export const MAX_BACKUP_SNAPSHOTS = 5;

export interface PersistedJobTrackState {
  schemaVersion: number;
  applications: Application[];
  activityLogs: ActivityLog[];
  backupSnapshots: BackupSnapshot[];
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function createExportPayload(
  applications: Application[],
  activityLogs: ActivityLog[]
): JobTrackExport {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date(),
    applications: applications.map(normalizeApplicationDates),
    activityLogs: activityLogs.map(normalizeActivityLogDates),
  };
}

export function importJobTrackData(input: string | unknown): JobTrackExport {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("导入文件格式不正确");
  }

  const data = parsed as Partial<JobTrackExport>;
  return {
    schemaVersion: data.schemaVersion ?? CURRENT_SCHEMA_VERSION,
    exportedAt: normalizeDate(data.exportedAt) ?? new Date(),
    applications: asArray<Application>(data.applications).map(normalizeApplicationDates),
    activityLogs: asArray<ActivityLog>(data.activityLogs).map(normalizeActivityLogDates),
  };
}

export function createBackupSnapshot(
  reason: string,
  applications: Application[],
  activityLogs: ActivityLog[]
): BackupSnapshot {
  return {
    id: uuidv4(),
    createdAt: new Date(),
    reason,
    applications: applications.map(normalizeApplicationDates),
    activityLogs: activityLogs.map(normalizeActivityLogDates),
  };
}

export function limitSnapshots(snapshots: BackupSnapshot[]): BackupSnapshot[] {
  return snapshots
    .map(normalizeSnapshotDates)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, MAX_BACKUP_SNAPSHOTS);
}

export function migratePersistedState(value: unknown): PersistedJobTrackState {
  const state = value && typeof value === "object" ? value as Partial<PersistedJobTrackState> : {};

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    applications: asArray<Application>(state.applications).map(normalizeApplicationDates),
    activityLogs: asArray<ActivityLog>(state.activityLogs).map(normalizeActivityLogDates),
    backupSnapshots: limitSnapshots(asArray<BackupSnapshot>(state.backupSnapshots)),
  };
}
