"use client";

import { useEffect, useState } from "react";

interface CelebrationProps {
  onComplete?: () => void;
}

export function Celebration({ onComplete }: CelebrationProps) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    // Fade in
    const frameId = requestAnimationFrame(() => {
      setOpacity(1);
      setScale(1);
    });

    // Fade out after 2.5s
    const timer = setTimeout(() => {
      setOpacity(0);
      setScale(0.9);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, 2500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        opacity,
        transition: "opacity 0.5s ease-out",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Animated checkmark */}
        <div className="relative w-20 h-20 mb-4">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            className="w-full h-full"
          >
            {/* Circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="#059669"
              fillOpacity="0.1"
              className="animate-ping"
              style={{ animationDuration: "1s" }}
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="#059669"
              fillOpacity="0.2"
            />
            <circle
              cx="40"
              cy="40"
              r="28"
              fill="#059669"
            />
            {/* Checkmark */}
            <path
              d="M28 42L36 50L52 34"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-check"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: 40,
                animation: "draw-check 0.6s ease-out 0.2s forwards",
              }}
            />
          </svg>
        </div>

        {/* Text */}
        <p className="text-xl font-semibold text-text-primary mb-1">
          恭喜！
        </p>
        <p className="text-sm text-text-secondary text-center">
          又一家进入终面环节
        </p>
      </div>

      <style jsx>{`
        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
