"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Calendar, BarChart3, Plus, MoreHorizontal } from "lucide-react";

const NAV_ITEMS = [
  { href: "/board", label: "看板", icon: LayoutGrid },
  { href: "/calendar", label: "日历", icon: Calendar },
  { href: "/weekly", label: "周报", icon: BarChart3 },
  { href: "/", label: "更多", icon: MoreHorizontal },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden lg:flex flex-col h-full bg-white border-r border-border w-[200px]">
        {/* Logo area */}
        <div className="h-14 flex items-center px-4 border-b border-border">
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
            <span className="text-base font-semibold text-text-primary tracking-tight whitespace-nowrap">
              JobTrack
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href === "/board" && pathname.startsWith("/board"));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center h-12 my-1
                  transition-all duration-200 ease-out
                  hover:bg-background
                  ${isActive ? "bg-background" : ""}
                `}
              >
                {/* Active indicator - 3px primary bar on left */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary rounded-r" />
                )}

                {/* Icon */}
                <div className="w-16 flex items-center justify-center">
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }
                  />
                </div>

                {/* Label */}
                <span
                  className={`
                    text-sm whitespace-nowrap
                    ${isActive ? "font-medium text-primary" : "text-text-secondary"}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Tab Bar - visible only on mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-border z-50 pb-safe">
        <div className="flex items-center justify-around h-full">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href === "/board" && pathname.startsWith("/board"));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-0.5
                  w-[64px] h-full
                  transition-colors duration-200
                  ${isActive ? "text-primary" : "text-[#6F7177]"}
                `}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header - visible only on mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-11 bg-white border-b border-border z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="18"
            height="18"
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
          <span className="text-sm font-semibold text-text-primary">
            JobTrack
          </span>
        </div>

        {/* Add button - triggers global event */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-new-application"))}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
          aria-label="新建申请"
        >
          <Plus size={18} />
        </button>
      </header>
    </>
  );
}
