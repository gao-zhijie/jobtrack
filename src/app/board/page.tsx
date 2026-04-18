import { Header } from "@/components/layout/Header";
import { StatsOverview } from "@/components/layout/StatsOverview";
import { Board } from "@/components/board/Board";

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <StatsOverview />
        </section>

        {/* Board */}
        <section>
          <Board />
        </section>
      </main>
    </div>
  );
}
