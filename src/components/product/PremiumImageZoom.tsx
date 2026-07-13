"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Maximize2, X, ZoomIn } from "lucide-react";
import { cn, isAppMediaSrc } from "@/lib/utils";

function isLocalImage(src: string) {
  return isAppMediaSrc(src) || src.startsWith("data:");
}

interface PremiumImageZoomProps {
  images: string[];
  alt: string;
  badge?: string;
  className?: string;
}

export function PremiumImageZoom({
  images,
  alt,
  badge,
  className,
}: PremiumImageZoomProps) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const main = gallery[active] || gallery[0];

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }, []);

  if (!main) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-surface-warm text-sm text-ink-400">
        No image
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        {/* Main image — stays normal, no zoom overlay on it */}
        <div
          ref={frameRef}
          className="relative aspect-square cursor-crosshair overflow-hidden rounded-3xl bg-[#F3EFE8] shadow-elevated ring-1 ring-ink-100"
          onMouseMove={onMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Image
            src={main}
            alt={alt}
            fill
            priority
            unoptimized={isLocalImage(main)}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-center"
          />

          {/* Small guide box — shows which area is being zoomed on the side */}
          {hovering && (
            <div
              className="pointer-events-none absolute hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-md border border-brand-400/80 bg-brand-300/20 lg:block"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              aria-hidden
            />
          )}

          {badge && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-ink-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {badge}
            </span>
          )}

          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-medium text-ink-800 shadow-soft backdrop-blur transition hover:bg-white focus-ring"
            aria-label="Open full image"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Full view
          </button>

          <div className="absolute bottom-4 left-4 z-10 hidden items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1.5 text-[11px] text-white/90 lg:inline-flex">
            <ZoomIn className="h-3.5 w-3.5" />
            Hover — zoom opens on side
          </div>
        </div>

        {/* SIDE ZOOM PANEL — Amazon style (only here the zoom shows) */}
        <div
          className={cn(
            "pointer-events-none absolute left-[calc(100%+1rem)] top-0 z-30 hidden h-full w-[min(32rem,calc(100vw-54%-3rem))] overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-elevated lg:block",
            hovering
              ? "opacity-100 translate-x-0"
              : "pointer-events-none opacity-0 -translate-x-2"
          )}
          style={{ transition: "opacity 0.15s ease, transform 0.15s ease" }}
          aria-hidden={!hovering}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${main})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "250%",
              backgroundPosition: `${pos.x}% ${pos.y}%`,
            }}
          />
        </div>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
          {gallery.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-2xl border-2 transition focus-ring",
                active === i
                  ? "border-brand-500 shadow-soft"
                  : "border-transparent opacity-75 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="72px"
                className="object-cover object-center"
                unoptimized={isLocalImage(img)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile: tap for lightbox (no side panel on small screens) */}
      <p className="mt-2 text-xs text-ink-400 lg:hidden">
        Tip: Full view dabao for bigger image on mobile.
      </p>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Close"
            onClick={() => setLightbox(false)}
          />
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-ring"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative z-10 h-[min(82vh,900px)] w-full max-w-5xl overflow-hidden rounded-2xl bg-ink-900">
            <Image
              src={main}
              alt={alt}
              fill
              unoptimized={isLocalImage(main)}
              className="object-contain object-center"
              sizes="100vw"
              priority
            />
          </div>

          {gallery.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-2xl bg-ink-950/70 p-2 backdrop-blur">
              {gallery.map((img, i) => (
                <button
                  key={`lb-${img}-${i}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={cn(
                    "relative h-14 w-14 overflow-hidden rounded-xl border-2",
                    active === i
                      ? "border-brand-400"
                      : "border-transparent opacity-70"
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={isLocalImage(img)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
