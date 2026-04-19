import { Sidebar } from "@/components/layout/Sidebar";
import { CalendarPageClient } from "@/components/calendar/CalendarPageClient";

export default function CalendarPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - desktop only */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header offset */}
        <div className="lg:hidden h-11" />

        <div className="max-w-[1440px] mx-auto">
          <CalendarPageClient />
        </div>

        {/* Mobile bottom tab bar offset */}
        <div className="lg:hidden h-[56px]" />
      </main>
    </div>
  );
}
