"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClearStorage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("jobtrack-storage");
    router.push("/board");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-[#6F7177]">
      正在清理数据...
    </div>
  );
}
