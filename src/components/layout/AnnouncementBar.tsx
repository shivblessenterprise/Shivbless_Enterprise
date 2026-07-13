"use client";

import { useEffect, useState } from "react";
import { announcements } from "@/lib/site";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-ink-900 text-center text-xs text-brand-100 sm:text-sm">
      <div className="container-premium flex h-9 items-center justify-center">
        <p
          key={index}
          className="animate-fade-in tracking-wide"
          aria-live="polite"
        >
          {announcements[index]}
        </p>
      </div>
    </div>
  );
}
