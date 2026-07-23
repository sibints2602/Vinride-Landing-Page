"use client";

import { useRef, useSyncExternalStore } from "react";

export interface WorldMapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  /** Arc/node colour; accepts CSS colour or var(--token) so colour stays in globals.css. */
  lineColor?: string;
  className?: string;
}

/** prefers-reduced-motion via external store; server snapshot false avoids hydration mismatch. */
function subscribeMotion(onChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Shared styling for both theme variants of the dotted-map backdrop. */
const MAP_IMG_CLASS =
  "pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]";

export default function WorldMap({
  dots = [],
  lineColor = "var(--color-brand-amber)",
  className,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // One loop length for every arc keeps draw/hold/fade in phase; stagger comes from `begin`.
  const CYCLE = 6; // seconds

  return (
    <div className={`relative aspect-[2/1] w-full font-sans ${className ?? ""}`}>
      {/* Pregenerated dotted-map SVGs (public/map/) — runtime DottedMap cost ~10s of main-thread work. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/map/world-light.svg"
        className={`${MAP_IMG_CLASS} dark:hidden`}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        fetchPriority="low"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/map/world-dark.svg"
        className={`${MAP_IMG_CLASS} hidden dark:block`}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
        fetchPriority="low"
      />

      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* SMIL, not motion's pathLength — motion never applied stroke-dasharray under this setup. */}
        {dots.map((dot, i) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <path
              key={`path-${i}`}
              d={createCurvedPath(start, end)}
              fill="none"
              stroke="url(#path-gradient)"
              strokeWidth="1"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={reduceMotion ? undefined : "1 1"}
              strokeDashoffset={reduceMotion ? undefined : 1}
            >
              {!reduceMotion && (
                <>
                  <animate
                    attributeName="stroke-dashoffset"
                    values="1;0;0;0"
                    keyTimes="0;0.45;0.9;1"
                    dur={`${CYCLE}s`}
                    begin={`${0.45 * i}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="1;1;1;0"
                    keyTimes="0;0.45;0.9;1"
                    dur={`${CYCLE}s`}
                    begin={`${0.45 * i}s`}
                    repeatCount="indefinite"
                  />
                </>
              )}
            </path>
          );
        })}

        {dots.map((dot, i) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`points-group-${i}`}>
              {[start, end].map((point, j) => (
                <g key={j}>
                  <circle cx={point.x} cy={point.y} r="2" fill={lineColor} />
                  <circle cx={point.x} cy={point.y} r="2" fill={lineColor} opacity="0.5">
                    {!reduceMotion && (
                      <>
                        <animate attributeName="r" from="2" to="8" dur="1.5s" begin="0s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
