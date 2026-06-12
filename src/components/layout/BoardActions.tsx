"use client";

import { Plus } from "lucide-react";

export function BoardActions() {
  const openNewApplication = () => {
    window.dispatchEvent(new CustomEvent("open-new-application"));
  };

  return (
    <div className="hidden lg:flex items-center justify-between mb-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">求职看板</h1>
        <p className="text-sm text-text-secondary mt-1">
          把每一次推进都记录下来，下一步会更清楚。
        </p>
      </div>
      <button
        type="button"
        onClick={openNewApplication}
        className="btn btn-primary flex items-center gap-1.5"
      >
        <Plus size={16} />
        <span>新增申请</span>
      </button>
    </div>
  );
}
