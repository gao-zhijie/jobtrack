import { Sidebar } from "@/components/layout/Sidebar";
import { WeeklyReport } from "@/components/weekly/WeeklyReport";

export default function WeeklyPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <WeeklyReport />
        </div>
      </main>
    </div>
  );
}
