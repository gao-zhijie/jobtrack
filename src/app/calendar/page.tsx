import { Sidebar } from "@/components/layout/Sidebar";
import { CalendarPageClient } from "@/components/calendar/CalendarPageClient";

export default function CalendarPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1440px] mx-auto">
          <CalendarPageClient />
        </div>
      </main>
    </div>
  );
}
