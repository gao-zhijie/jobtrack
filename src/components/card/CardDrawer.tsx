"use client";

import { useState } from "react";
import { X, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Application, InterviewLog } from "@/lib/types";
import { STAGE_CONFIG, PLATFORM_LABELS, PERFORMANCE_LABELS } from "@/lib/types";
import { useJobTrackStore } from "@/lib/store";
import { CardForm } from "./CardForm";

interface CardDrawerProps {
  application: Application | null;
  onClose: () => void;
}

export function CardDrawer({ application, onClose }: CardDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const deleteApplication = useJobTrackStore((s) => s.deleteApplication);

  if (!application) return null;

  const stageConfig = STAGE_CONFIG.find((s) => s.key === application.stage);
  const daysSinceApplied = differenceInDays(new Date(), new Date(application.appliedAt));

  const toggleLog = (id: string) => {
    const next = new Set(expandedLogs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedLogs(next);
  };

  const handleDelete = () => {
    deleteApplication(application.id);
    onClose();
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/10 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-xl z-50 flex flex-col animate-slide-in">
        {isEditing ? (
          <CardForm
            application={application}
            onClose={handleClose}
            onSave={handleClose}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-text-primary mb-1">
                  {application.company}
                </h2>
                <p className="text-sm text-text-secondary">
                  {application.position}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                    className="p-2 text-text-secondary hover:text-danger hover:bg-danger-bg rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  {showDeleteConfirm && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-border rounded-lg shadow-lg p-3">
                      <p className="text-xs text-text-secondary mb-2">
                        确定删除这条申请？
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDelete}
                          className="flex-1 text-xs text-white bg-danger px-2 py-1.5 rounded hover:bg-danger/90 transition-colors"
                        >
                          删除
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 text-xs text-text-secondary bg-background px-2 py-1.5 rounded hover:bg-border transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* 投递渠道 */}
              <Field label="投递渠道">
                <span className="text-sm text-text-primary">
                  {PLATFORM_LABELS[application.platform]}
                </span>
              </Field>

              {/* 投递日期 */}
              <Field label="投递日期">
                <span className="text-sm text-text-primary">
                  {new Date(application.appliedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs text-text-muted ml-2">
                  第 {daysSinceApplied} 天
                </span>
              </Field>

              {/* 当前阶段 */}
              <Field label="当前阶段">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stageConfig?.color }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: stageConfig?.color }}
                  >
                    {stageConfig?.label}
                  </span>
                </div>
                {application.stage === "rejected" && (
                  <p className="text-xs text-text-muted mt-1">
                    求职是概率游戏，你做得比你以为的好
                  </p>
                )}
                {application.stage === "withdrawn" && (
                  <p className="text-xs text-text-muted mt-1">
                    及时止损也是一种智慧
                  </p>
                )}
              </Field>

              {/* 下一步截止 */}
              {application.nextDeadline && (
                <Field label="下一步截止">
                  <span
                    className={`text-sm ${
                      new Date(application.nextDeadline) < new Date()
                        ? "text-danger"
                        : "text-text-primary"
                    }`}
                  >
                    {new Date(application.nextDeadline).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-text-muted ml-2">
                    {formatDistanceToNow(new Date(application.nextDeadline), {
                      locale: zhCN,
                      addSuffix: true,
                    })}
                  </span>
                </Field>
              )}

              {/* 下一步做什么 */}
              {application.nextAction && (
                <Field label="下一步">
                  <span className="text-sm text-text-primary">
                    {application.nextAction}
                  </span>
                </Field>
              )}

              {/* 简历版本 */}
              {application.resumeVersion && (
                <Field label="简历版本">
                  <span className="text-sm text-text-primary">
                    {application.resumeVersion}
                  </span>
                </Field>
              )}

              {/* 备注 */}
              {application.notes && (
                <Field label="备注">
                  <blockquote className="text-sm text-text-secondary bg-background px-3 py-2 border-l-2 border-border rounded-r">
                    {application.notes}
                  </blockquote>
                </Field>
              )}

              {/* 面试复盘 */}
              {application.interviewLogs.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-text-primary mb-3">
                    面试复盘
                  </h3>
                  <div className="space-y-2">
                    {application.interviewLogs
                      .slice()
                      .reverse()
                      .map((log) => (
                        <InterviewLogItem
                          key={log.id}
                          log={log}
                          isExpanded={expandedLogs.has(log.id)}
                          onToggle={() => toggleLog(log.id)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs text-text-secondary uppercase tracking-wide">
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

interface InterviewLogItemProps {
  log: InterviewLog;
  isExpanded: boolean;
  onToggle: () => void;
}

function InterviewLogItem({ log, isExpanded, onToggle }: InterviewLogItemProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-background hover:bg-border/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">
            {log.stage}
          </span>
          <span className="text-xs text-text-muted">
            {new Date(log.date).toLocaleDateString("zh-CN", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              log.performance === "great"
                ? "bg-offer/10 text-offer"
                : log.performance === "good"
                ? "bg-primary/10 text-primary"
                : log.performance === "ok"
                ? "bg-written/10 text-written"
                : "bg-danger/10 text-danger"
            }`}
          >
            {PERFORMANCE_LABELS[log.performance]}
          </span>
          {isExpanded ? (
            <ChevronUp size={14} className="text-text-muted" />
          ) : (
            <ChevronDown size={14} className="text-text-muted" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="p-3 space-y-3 border-t border-border">
          {log.questions.length > 0 && (
            <div>
              <span className="text-xs text-text-secondary">被问到的问题</span>
              <ul className="mt-1 space-y-1">
                {log.questions.map((q, i) => (
                  <li key={i} className="text-sm text-text-primary flex gap-2">
                    <span className="text-text-muted">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {log.reflection && (
            <div>
              <span className="text-xs text-text-secondary">自我反思</span>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                {log.reflection}
              </p>
            </div>
          )}
          {log.interviewerStyle && (
            <div>
              <span className="text-xs text-text-secondary">面试官风格</span>
              <p className="mt-1 text-sm text-text-secondary">
                {log.interviewerStyle}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
