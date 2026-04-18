"use client";

import { isBefore, differenceInDays, addDays, isToday } from "date-fns";
import { AlertCircle, Clock, Gift, Calendar } from "lucide-react";
import { useJobTrackStore } from "@/lib/store";
import type { Application } from "@/lib/types";

interface FocusItem {
  app: Application;
  type: "overdue" | "deadline24h" | "newOffer" | "todayInterview";
  label: string;
  sublabel: string;
}

function useFocusItems(): FocusItem[] {
  const applications = useJobTrackStore((state) => state.applications);
  const now = new Date();
  const items: FocusItem[] = [];

  applications.forEach((app) => {
    // Skip ended stages
    if (["rejected", "withdrawn", "offer"].includes(app.stage)) {
      // New offer: offer received within last 3 days
      if (app.stage === "offer") {
        const daysSinceOffer = differenceInDays(now, new Date(app.updatedAt));
        if (daysSinceOffer <= 3) {
          items.push({
            app,
            type: "newOffer",
            label: app.company,
            sublabel: "新 Offer 需要确认",
          });
        }
      }
      return;
    }

    // Check nextDeadline
    if (app.nextDeadline) {
      const deadline = new Date(app.nextDeadline);
      const todayEnd = addDays(now, 1);
      todayEnd.setHours(0, 0, 0, 0);

      // Overdue
      if (isBefore(deadline, now)) {
        const daysOverdue = differenceInDays(now, deadline);
        items.push({
          app,
          type: "overdue",
          label: app.company,
          sublabel: `截止已超时 ${daysOverdue} 天`,
        });
      }
      // Within 24h (but not overdue)
      else if (isBefore(deadline, todayEnd)) {
        items.push({
          app,
          type: "deadline24h",
          label: app.company,
          sublabel: "24h 内截止",
        });
      }
    }

    // Today's interviews (from interviewLogs)
    app.interviewLogs.forEach((log) => {
      if (isToday(new Date(log.date))) {
        items.push({
          app,
          type: "todayInterview",
          label: app.company,
          sublabel: `今日面试：${log.stage}`,
        });
      }
    });
  });

  // Sort by priority
  const priorityOrder = {
    overdue: 0,
    deadline24h: 1,
    newOffer: 2,
    todayInterview: 3,
  };
  items.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);

  // Return max 3
  return items.slice(0, 3);
}

function FocusCard({ item }: { item: FocusItem }) {
  const icons = {
    overdue: <AlertCircle size={16} className="text-danger flex-shrink-0" />,
    deadline24h: <Clock size={16} className="text-amber-500 flex-shrink-0" />,
    newOffer: <Gift size={16} className="text-green-500 flex-shrink-0" />,
    todayInterview: <Calendar size={16} className="text-primary flex-shrink-0" />,
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer">
      {icons[item.type]}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">
          {item.app.company} · {item.app.position}
        </div>
        <div className="text-xs text-[#B4B6BA]">
          {item.sublabel}
        </div>
      </div>
    </div>
  );
}

export function TodayFocus() {
  const items = useFocusItems();

  return (
    <div
      className="h-[120px] rounded-lg overflow-hidden"
      style={{ backgroundColor: "#0F0F14" }}
    >
      {items.length > 0 ? (
        <div className="h-full flex flex-col justify-center px-4">
          <div className="grid grid-cols-3 gap-4">
            {items.map((item) => (
              <FocusCard key={item.app.id} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-[#B4B6BA]">
              ✓ 今天没有需要立刻处理的事，好好准备下一场
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
