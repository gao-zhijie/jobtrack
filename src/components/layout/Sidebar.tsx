"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Calendar, BarChart3, Info } from "lucide-react";

const NAV_ITEMS = [
  { href: "/board", label: "看板", icon: LayoutGrid },
  { href: "/calendar", label: "日历", icon: Calendar },
  { href: "/weekly", label: "周报", icon: BarChart3 },
  { href: "/", label: "关于", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={`
        flex flex-col h-full bg-white border-r border-border
        transition-all duration-200 ease-out
        ${isHovered ? "w-[200px]" : "w-16"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          {isHovered && (
            <span className="text-base font-semibold text-text-primary tracking-tight whitespace-nowrap">
              JobTrack
            </span>
          )}
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
              {isHovered && (
                <span
                  className={`
                    text-sm whitespace-nowrap
                    ${isActive ? "font-medium text-primary" : "text-text-secondary"}
                  `}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
