"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

const NAV_ITEMS = [
  { href: "/board", label: "看板" },
  { href: "/calendar", label: "日历" },
  { href: "/weekly", label: "周报" },
];

export function Header() {
  const pathname = usePathname();
  // We only show the drawer on the board page
  const isBoardPage = pathname === "/board";

  return (
    <>
      <header className="h-14 bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto h-full px-6 grid grid-cols-3 items-center">
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

          {/* Navigation - always centered */}
          <nav className="flex items-center justify-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm relative transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* New Application Button - only show on board page */}
          <div className="flex justify-end">
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
