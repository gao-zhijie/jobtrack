"use client";

import { useState, useMemo } from "react";
import { useJobTrackStore } from "@/lib/store";
import { selectConflicts } from "@/lib/store";
import { isSameDay } from "date-fns";
import { MonthView } from "./MonthView";
import { ConflictBanner } from "./ConflictBanner";
import { DayDetail } from "./DayDetail";
import type { Application } from "@/lib/types";

export function CalendarPageClient() {
  const applications = useJobTrackStore((state) => state.applications);
  const conflicts = useMemo(() => selectConflicts(applications), [applications]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Application[]>([]);
  const [showConflictBanner, setShowConflictBanner] = useState(true);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const handleDayClick = (date: Date, events: Application[]) => {
    setSelectedDate(date);
    setSelectedEvents(events);
    setShowDayDetail(true);
  };

  const handleConflictBannerClick = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayConflicts = applications.filter((app) =>
      app.interviewLogs.some(
        (log) =>
          isSameDay(new Date(log.date), date) ||
          (app.nextDeadline && isSameDay(new Date(app.nextDeadline), date))
      )
    );
    setSelectedDate(date);
    setSelectedEvents(dayConflicts);
    setShowDayDetail(true);
  };

  const getConflictsForDay = (date: Date) => {
    return conflicts.find((c) => isSameDay(new Date(c.date), date))?.applications || [];
  };

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Conflict Banner */}
      <ConflictBanner
        conflicts={conflicts}
        onConflictClick={handleConflictBannerClick}
        onDismiss={() => setShowConflictBanner(false)}
        visible={showConflictBanner}
      />

      {/* Month View */}
      <div className="flex-1 overflow-hidden">
        <MonthView onDayClick={handleDayClick} />
      </div>

      {/* Day Detail Sidebar */}
      {showDayDetail && selectedDate && (
        <DayDetail
          date={selectedDate}
          applications={selectedEvents}
          conflicts={getConflictsForDay(selectedDate)}
          onClose={() => setShowDayDetail(false)}
        />
      )}
    </div>
  );
}
