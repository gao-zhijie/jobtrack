"use client";

import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  // We only show the drawer on the board page
  const isBoardPage = pathname === "/board";

  return (
    <>
      <header className="h-14 bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M10 2L18 10L10 18L2 10L10 2Z"
                fill="#5E6AD2"
                fillOpacity="0.2"
              />
              <path
                d="M10 6L14 10L10 14L6 10L10 6Z"
                fill="#5E6AD2"
              />
            </svg>
            <span className="text-base font-semibold text-text-primary tracking-tight">
              JobTrack
            </span>
          </div>

          {/* New Application Button - only show on board page */}
          <div>
            {isBoardPage && (
              <button
                onClick={() => {
                  // Dispatch custom event to open the new application form
                  window.dispatchEvent(new CustomEvent("open-new-application"));
                }}
                className="btn btn-primary flex items-center gap-1.5"
              >
                <Plus size={16} />
                <span>新建申请</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
