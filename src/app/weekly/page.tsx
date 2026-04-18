import { Header } from "@/components/layout/Header";
import { WeeklyReport } from "@/components/weekly/WeeklyReport";

export default function WeeklyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1440px] mx-auto px-6 py-12">
        <WeeklyReport />
      </main>
    </div>
  );
}
