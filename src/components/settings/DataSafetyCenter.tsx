"use client";

import { useRef, useState } from "react";
import { ArchiveRestore, Download, FileUp, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useJobTrackStore } from "@/lib/store";
import { importJobTrackData } from "@/lib/dataSafety";
import { formatDateInputLocal } from "@/lib/date";
import { showToast } from "@/components/ui/Toast";

export function DataSafetyCenter() {
  const fileRef = useRef<HTMLInputElement>(null);
  const applications = useJobTrackStore((state) => state.applications);
  const activityLogs = useJobTrackStore((state) => state.activityLogs);
  const backupSnapshots = useJobTrackStore((state) => state.backupSnapshots);
  const exportData = useJobTrackStore((state) => state.exportData);
  const importData = useJobTrackStore((state) => state.importData);
  const createSnapshot = useJobTrackStore((state) => state.createSnapshot);
  const restoreSnapshot = useJobTrackStore((state) => state.restoreSnapshot);
  const clearAllData = useJobTrackStore((state) => state.clearAllData);

  const [pendingImport, setPendingImport] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{
    applications: number;
    activityLogs: number;
  } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExport = () => {
    const payload = exportData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jobtrack-backup-${formatDateInputLocal(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({ type: "success", message: "备份文件已导出" });
  };

  const handleCreateSnapshot = () => {
    createSnapshot("手动快照");
    showToast({ type: "success", message: "本地快照已保存" });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = importJobTrackData(text);
      setPendingImport(text);
      setImportPreview({
        applications: parsed.applications.length,
        activityLogs: parsed.activityLogs.length,
      });
    } catch {
      setPendingImport(null);
      setImportPreview(null);
      showToast({ type: "error", message: "导入文件无法识别" });
    } finally {
      event.target.value = "";
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    importData(pendingImport);
    setPendingImport(null);
    setImportPreview(null);
    showToast({ type: "success", message: "数据已导入，导入前状态已自动备份" });
  };

  const handleRestore = (id: string) => {
    restoreSnapshot(id);
    showToast({ type: "success", message: "已从本地快照恢复" });
  };

  const handleClear = () => {
    clearAllData();
    setConfirmClear(false);
    showToast({ type: "success", message: "数据已清空，清空前状态已自动备份" });
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
          数据安全
        </p>
        <h1 className="text-xl font-semibold text-text-primary mb-2">
          你的求职记录只保存在本机
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed max-w-[640px]">
          JobTrack 不上传数据。这里负责导出备份、导入恢复和本地快照，避免误删或浏览器清理带来的损失。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="申请记录" value={applications.length} sub="真实求职记录" />
        <SummaryCard label="活动历史" value={activityLogs.length} sub="阶段和复盘足迹" />
        <SummaryCard label="本地快照" value={backupSnapshots.length} sub="最多保留 5 个" />
      </div>

      <section className="bg-white border border-border rounded-xl shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <ShieldCheck size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-text-primary">备份与导入</h2>
        </div>
        <div className="p-5 grid md:grid-cols-3 gap-3">
          <button type="button" onClick={handleExport} className="btn btn-primary flex items-center justify-center gap-1.5">
            <Download size={16} />
            导出 JSON
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary flex items-center justify-center gap-1.5">
            <FileUp size={16} />
            选择导入文件
          </button>
          <button type="button" onClick={handleCreateSnapshot} className="btn btn-secondary flex items-center justify-center gap-1.5">
            <ArchiveRestore size={16} />
            保存本地快照
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {importPreview && (
          <div className="mx-5 mb-5 bg-background border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-text-primary mb-1">
              准备导入 {importPreview.applications} 条申请记录
            </p>
            <p className="text-xs text-text-secondary mb-3">
              包含 {importPreview.activityLogs} 条活动历史。导入前会自动保存当前状态。
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={handleConfirmImport} className="btn btn-primary">
                确认导入
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingImport(null);
                  setImportPreview(null);
                }}
                className="btn btn-secondary"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white border border-border rounded-xl shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <RotateCcw size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-text-primary">最近本地快照</h2>
        </div>
        <div className="divide-y divide-border">
          {backupSnapshots.length > 0 ? (
            backupSnapshots.map((snapshot) => (
              <div key={snapshot.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">{snapshot.reason}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {snapshot.createdAt.toLocaleString("zh-CN")} · {snapshot.applications.length} 条申请
                  </p>
                </div>
                <button type="button" onClick={() => handleRestore(snapshot.id)} className="btn btn-secondary">
                  恢复
                </button>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-sm text-text-secondary">
              还没有本地快照。手动保存一次，心里会更踏实。
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-danger/20 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-danger/20 flex items-center gap-2">
          <Trash2 size={18} className="text-danger" />
          <h2 className="text-base font-semibold text-text-primary">清空数据</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            清空前会自动保存一个本地快照。这个操作适合重新开始一轮求职记录。
          </p>
          {confirmClear ? (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={handleClear} className="btn text-white bg-danger hover:bg-danger/90">
                确认清空
              </button>
              <button type="button" onClick={() => setConfirmClear(false)} className="btn btn-secondary">
                取消
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmClear(true)} className="btn btn-secondary text-danger">
              清空全部数据
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm px-5 py-4">
      <p className="text-xs text-text-muted mb-2">{label}</p>
      <p className="text-xl font-semibold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{sub}</p>
    </div>
  );
}
