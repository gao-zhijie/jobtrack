"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import type { Application, Platform, Stage } from "@/lib/types";
import { STAGE_CONFIG, PLATFORM_LABELS } from "@/lib/types";
import { useJobTrackStore } from "@/lib/store";

interface CardFormProps {
  application?: Application;
  onClose: () => void;
  onSave?: () => void;
}

export function CardForm({ application, onClose, onSave }: CardFormProps) {
  const isEditing = !!application;
  const addApplication = useJobTrackStore((s) => s.addApplication);
  const updateApplication = useJobTrackStore((s) => s.updateApplication);

  const [form, setForm] = useState({
    company: application?.company || "",
    position: application?.position || "",
    platform: (application?.platform || "other") as Platform,
    stage: (application?.stage || "applied") as Stage,
    appliedAt: application?.appliedAt
      ? new Date(application.appliedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    nextDeadline: application?.nextDeadline
      ? new Date(application.nextDeadline).toISOString().split("T")[0]
      : "",
    nextAction: application?.nextAction || "",
    resumeVersion: application?.resumeVersion || "",
    notes: application?.notes || "",
  });

  // 移动端"更多"字段折叠状态
  const [showMore, setShowMore] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.company.trim()) newErrors.company = "请填写公司名";
    if (!form.position.trim()) newErrors.position = "请填写岗位";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      company: form.company.trim(),
      position: form.position.trim(),
      platform: form.platform,
      stage: form.stage,
      sortOrder: Date.now(),
      appliedAt: new Date(form.appliedAt),
      nextDeadline: form.nextDeadline ? new Date(form.nextDeadline) : undefined,
      nextAction: form.nextAction.trim() || undefined,
      resumeVersion: form.resumeVersion.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    if (isEditing && application) {
      updateApplication(application.id, data);
    } else {
      addApplication(data);
    }

    onSave?.();
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header - desktop only */}
      <div className="hidden md:flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">
          {isEditing ? "编辑申请" : "新增申请"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        {/* 公司名 */}
        <FormField label="公司名" required error={errors.company}>
          <input
            type="text"
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="例如：字节跳动"
            className={inputClass(!!errors.company)}
          />
        </FormField>

        {/* 岗位 */}
        <FormField label="岗位" required error={errors.position}>
          <input
            type="text"
            value={form.position}
            onChange={(e) => updateField("position", e.target.value)}
            placeholder="例如：产品经理-电商方向"
            className={inputClass(!!errors.position)}
          />
        </FormField>

        {/* 当前阶段 */}
        <FormField label="当前阶段">
          <div className="flex flex-wrap gap-2">
            {STAGE_CONFIG.filter((s) => !["rejected", "withdrawn"].includes(s.key)).map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => updateField("stage", s.key)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                  form.stage === s.key
                    ? "border-current text-white"
                    : "border-border text-text-secondary hover:border-text-muted"
                }`}
                style={
                  form.stage === s.key
                    ? { backgroundColor: s.color, borderColor: s.color }
                    : {}
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </FormField>

        {/* 投递日期 */}
        <FormField label="投递日期">
          <input
            type="date"
            value={form.appliedAt}
            onChange={(e) => updateField("appliedAt", e.target.value)}
            className={inputClass()}
          />
        </FormField>

        {/* 移动端：更多字段折叠 */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center justify-between w-full py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <span>更多选项</span>
            {showMore ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showMore && (
            <div className="space-y-5 pt-2">
              {/* 投递渠道 */}
              <FormField label="投递渠道">
                <select
                  value={form.platform}
                  onChange={(e) => updateField("platform", e.target.value)}
                  className={inputClass()}
                >
                  {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormField>

              {/* 下一步截止 */}
              <FormField label="下一步截止">
                <input
                  type="date"
                  value={form.nextDeadline}
                  onChange={(e) => updateField("nextDeadline", e.target.value)}
                  className={inputClass()}
                />
              </FormField>

              {/* 下一步做什么 */}
              <FormField label="下一步做什么">
                <input
                  type="text"
                  value={form.nextAction}
                  onChange={(e) => updateField("nextAction", e.target.value)}
                  placeholder="例如：准备二面案例"
                  className={inputClass()}
                />
              </FormField>

              {/* 简历版本 */}
              <FormField label="简历版本">
                <input
                  type="text"
                  value={form.resumeVersion}
                  onChange={(e) => updateField("resumeVersion", e.target.value)}
                  placeholder="例如：V2.1-电商方向"
                  className={inputClass()}
                />
              </FormField>

              {/* 备注 */}
              <FormField label="备注">
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="记录一些关于这家公司的信息..."
                  rows={3}
                  className={`${inputClass()} resize-none`}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* 桌面端：完整表单 */}
        <div className="hidden md:block space-y-5">
          {/* 投递渠道 */}
          <FormField label="投递渠道">
            <select
              value={form.platform}
              onChange={(e) => updateField("platform", e.target.value)}
              className={inputClass()}
            >
              {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>

          {/* 下一步截止 */}
          <FormField label="下一步截止">
            <input
              type="date"
              value={form.nextDeadline}
              onChange={(e) => updateField("nextDeadline", e.target.value)}
              className={inputClass()}
            />
          </FormField>

          {/* 下一步做什么 */}
          <FormField label="下一步做什么">
            <input
              type="text"
              value={form.nextAction}
              onChange={(e) => updateField("nextAction", e.target.value)}
              placeholder="例如：准备二面案例"
              className={inputClass()}
            />
          </FormField>

          {/* 简历版本 */}
          <FormField label="简历版本">
            <input
              type="text"
              value={form.resumeVersion}
              onChange={(e) => updateField("resumeVersion", e.target.value)}
              placeholder="例如：V2.1-电商方向"
              className={inputClass()}
            />
          </FormField>

          {/* 备注 */}
          <FormField label="备注">
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="记录一些关于这家公司的信息..."
              rows={3}
              className={`${inputClass()} resize-none`}
            />
          </FormField>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border bg-background">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary bg-white border border-border rounded-md hover:bg-background transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 text-sm text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          保存
        </button>
      </div>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1">
        <span className="text-xs text-text-secondary uppercase tracking-wide">
          {label}
        </span>
        {required && <span className="text-danger text-xs">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function inputClass(hasError?: boolean) {
  return `w-full px-3 py-2.5 md:py-2 text-sm bg-white border rounded-md transition-colors focus:outline-none focus:border-primary ${
    hasError ? "border-danger" : "border-border hover:border-text-muted"
  }`;
}
