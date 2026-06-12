"use client";

import { AlertCircle, Archive, Calendar, CheckCircle2, Clock, Gift } from "lucide-react";
import { useJobTrackStore } from "@/lib/store";
import { getFocusItems, type ApplicationReminder } from "@/lib/reminders";

function useFocusItems(): ApplicationReminder[] {
  const applications = useJobTrackStore((state) => state.applications);
  return getFocusItems(applications);
}

function FocusCard({ item }: { item: ApplicationReminder }) {
  const icons = {
    overdue: <AlertCircle size={16} className="text-danger flex-shrink-0" />,
    deadline24h: <Clock size={16} className="text-amber-500 flex-shrink-0" />,
    stale: <Archive size={16} className="text-[#B4B6BA] flex-shrink-0" />,
    newOffer: <Gift size={16} className="text-green-500 flex-shrink-0" />,
    todayInterview: <Calendar size={16} className="text-primary flex-shrink-0" />,
  };

  const openDetail = () => {
    window.dispatchEvent(
      new CustomEvent("open-application-detail", {
        detail: { appId: item.app.id },
      })
    );
  };

  return (
    <button
      type="button"
      onClick={openDetail}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200 min-w-[200px] text-left"
    >
      {icons[item.type]}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">
          {item.app.company} · {item.app.position}
        </div>
        <div className="text-xs text-[#B4B6BA]">
          {item.sublabel}
        </div>
      </div>
    </button>
  );
}

export function TodayFocus() {
  const items = useFocusItems();

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: "#0F0F14" }}
    >
      {items.length > 0 ? (
        <>
          {/* Desktop: 3-column grid */}
          <div className="hidden md:block h-[120px]">
            <div className="h-full flex flex-col justify-center px-4">
              <div className="grid grid-cols-3 gap-4">
                {items.map((item) => (
                  <FocusCard key={`${item.type}-${item.app.id}`} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden">
            <div className="h-[100px] overflow-x-auto">
              <div className="flex gap-3 px-4 py-3 h-full items-center">
                {items.map((item) => (
                  <FocusCard key={`${item.type}-${item.app.id}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[100px] md:h-[120px] flex items-center justify-center">
          <div className="flex items-center gap-2 px-4">
            <CheckCircle2 size={16} className="text-[#B4B6BA]" />
            <div className="text-sm text-[#B4B6BA]">
              今天没有需要立刻处理的事，好好准备下一场。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
