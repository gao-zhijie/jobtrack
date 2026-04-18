"use client";

import { useState } from "react";
import type { Performance } from "@/lib/types";

interface InterviewLogModalProps {
  onSave: (data: {
    questions: string[];
    performance: Performance;
    reflection: string;
    interviewerStyle?: string;
  }) => void;
  onSkip: () => void;
  onClose: () => void;
}

const PERFORMANCE_OPTIONS: { value: Performance; label: string; color: string }[] = [
  { value: "great", label: "表现出色", color: "#059669" },
  { value: "good", label: "良好", color: "#5E6AD2" },
  { value: "ok", label: "一般", color: "#D97706" },
  { value: "bad", label: "不太行", color: "#DC2626" },
];

export function InterviewLogModal({
  onSave,
  onSkip,
  onClose,
}: InterviewLogModalProps) {
  const [questions, setQuestions] = useState("");
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [reflection, setReflection] = useState("");
  const [interviewerStyle, setInterviewerStyle] = useState("");
  const [showBadMessage, setShowBadMessage] = useState(false);

  const handleSave = () => {
    if (!performance) return;

    onSave({
      questions: questions
        .split("\n")
        .map((q) => q.trim())
        .filter(Boolean),
      performance,
      reflection: reflection.trim(),
      interviewerStyle: interviewerStyle.trim() || undefined,
    });

    if (performance === "bad") {
      setShowBadMessage(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[480px] max-h-[90vh] overflow-hidden">
        {showBadMessage ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="text-danger"
              >
                <path
                  d="M16 4L20 12L28 13L22 19L24 28L16 24L8 28L10 19L4 13L12 12L16 4Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
                <path
                  d="M16 8L19 13L24 14L20 18L21 24L16 21L11 24L12 18L8 14L13 13L16 8Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-text-primary mb-2">
              一次不顺不代表什么
            </p>
            <p className="text-sm text-text-secondary">
              你已经进到了这一轮
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">
                记录一下这轮面试
              </h2>
              <p className="text-xs text-text-muted mt-1">
                趁记忆新鲜，2 分钟就能写完，以后你会感谢自己
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* 问题 */}
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 uppercase tracking-wide">
                  被问到了哪些问题？
                </label>
                <textarea
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  placeholder="每行一个问题，可以简略"
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg resize-none focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* 发挥 */}
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 uppercase tracking-wide">
                  整体发挥如何？
                </label>
                <div className="flex gap-2">
                  {PERFORMANCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPerformance(opt.value)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        performance === opt.value
                          ? "text-white border-transparent"
                          : "border-border text-text-secondary hover:border-text-muted"
                      }`}
                      style={
                        performance === opt.value
                          ? { backgroundColor: opt.color, borderColor: opt.color }
                          : {}
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 反思 */}
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 uppercase tracking-wide">
                  反思
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="答得好的地方？遗憾的地方？"
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg resize-none focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* 面试官风格 */}
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 uppercase tracking-wide">
                  面试官风格（可选）
                </label>
                <input
                  type="text"
                  value={interviewerStyle}
                  onChange={(e) => setInterviewerStyle(e.target.value)}
                  placeholder="如：亲和 / 压力 / 放养 / 深挖..."
                  className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-background flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 text-sm text-text-secondary bg-white border border-border rounded-lg hover:bg-border transition-colors"
              >
                跳过记录直接移动
              </button>
              <button
                onClick={handleSave}
                disabled={!performance}
                className="flex-1 px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存并移动
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
