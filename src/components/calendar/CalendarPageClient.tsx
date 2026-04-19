"use client";

import { useState, useMemo } from "react";
import { useJobTrackStore } from "@/lib/store";
import { selectConflicts } from "@/lib/store";
import { isSameDay } from "date-fns";
import { MonthView } from "./MonthView";
import { ConflictBanner } from "./ConflictBanner";
import { DayDetail } from "./DayDetail";
import { CardDrawer } from "@/components/card/CardDrawer";
import type { Application } from "@/lib/types";

export function CalendarPageClient() {
  const applications = useJobTrackStore((state) => state.applications);
  const conflicts = useMemo(() => selectConflicts(applications), [applications]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Application[]>([]);
  const [showConflictBanner, setShowConflictBanner] = useState(true);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

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

  const handleCardClick = (app: Application) => {
    setShowDayDetail(false);
    setSelectedApp(app);
  };

  return (
    <div className="h-[calc(100vh-56px)] md:h-[calc(100vh-56px)] lg:h-[calc(100vh)] flex flex-col">
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
          onCardClick={handleCardClick}
        />
      )}

      {/* Application Detail Drawer */}
      <CardDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
}
