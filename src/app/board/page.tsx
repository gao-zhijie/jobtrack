import { CompactDataBar } from "@/components/layout/CompactDataBar";
import { TodayFocus } from "@/components/layout/TodayFocus";
import { Sidebar } from "@/components/layout/Sidebar";
import { Board } from "@/components/board/Board";

export default function BoardPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - desktop only */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header offset - accounts for fixed mobile header */}
        <div className="lg:hidden h-11" />

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-4 lg:py-6">
          {/* Compact Data Bar - 40px desktop, 36px mobile */}
          <section>
            <CompactDataBar />
          </section>

          {/* Today Focus Area - 120px desktop, 100px mobile with horizontal scroll */}
          <section className="mt-4">
            <TodayFocus />
          </section>

          {/* Board */}
          <section className="mt-6 lg:mt-8">
            <Board />
          </section>
        </div>

        {/* Mobile bottom tab bar offset */}
        <div className="lg:hidden h-[56px]" />
      </main>
    </div>
  );
}
