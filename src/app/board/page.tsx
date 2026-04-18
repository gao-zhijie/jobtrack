import { CompactDataBar } from "@/components/layout/CompactDataBar";
import { TodayFocus } from "@/components/layout/TodayFocus";
import { Sidebar } from "@/components/layout/Sidebar";
import { Board } from "@/components/board/Board";

export default function BoardPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          {/* Compact Data Bar - 40px */}
          <section>
            <CompactDataBar />
          </section>

          {/* Today Focus Area - 120px dark zone */}
          <section className="mt-4">
            <TodayFocus />
          </section>

          {/* Board - 32px from focus area */}
          <section className="mt-8">
            <Board />
          </section>
        </div>
      </main>
    </div>
  );
}
