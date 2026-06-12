"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJobTrackStore } from "@/lib/store";

export default function ClearStorage() {
  const router = useRouter();
  const clearAllData = useJobTrackStore((state) => state.clearAllData);

  useEffect(() => {
    clearAllData();
    router.push("/board");
  }, [clearAllData, router]);

  return (
    <div className="flex items-center justify-center h-screen text-[#6F7177]">
      正在清理数据...
    </div>
  );
}
