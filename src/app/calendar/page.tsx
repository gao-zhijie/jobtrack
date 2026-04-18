import { Header } from "@/components/layout/Header";
import { CalendarPageClient } from "@/components/calendar/CalendarPageClient";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1440px] mx-auto">
        <CalendarPageClient />
      </main>
    </div>
  );
}
