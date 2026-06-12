import { Sidebar } from "@/components/layout/Sidebar";
import { DataSafetyCenter } from "@/components/settings/DataSafetyCenter";

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="lg:hidden h-11" />

        <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 md:py-10">
          <DataSafetyCenter />
        </div>

        <div className="lg:hidden h-[56px]" />
      </main>
    </div>
  );
}
