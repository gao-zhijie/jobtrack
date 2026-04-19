import { Sidebar } from "@/components/layout/Sidebar";
import { WeeklyReport } from "@/components/weekly/WeeklyReport";

export default function WeeklyPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - desktop only */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header offset */}
        <div className="lg:hidden h-11" />

        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-12">
          <WeeklyReport />
        </div>

        {/* Mobile bottom tab bar offset */}
        <div className="lg:hidden h-[56px]" />
      </main>
    </div>
  );
}
