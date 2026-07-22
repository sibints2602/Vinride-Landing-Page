"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import DottedMap from "dotted-map";

export interface WorldMapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  /**
   * Arc / node colour. Accepts a CSS colour or a `var(--token)` — the SVG is
   * inline, so page custom properties cascade in. Defaults to the brand amber
   * token rather than a raw hex so colour still lives in globals.css.
   */
  lineColor?: string;
  className?: string;
}

/**
 * Subscribes to the `data-theme` attribute this project's ThemeScript/
 * ThemeToggle maintain on <html>, in place of next-themes (which isn't wired
 * to a provider here). useSyncExternalStore keeps the setState-in-effect lint
 * rule happy, and its server snapshot returns `null` so the dotted map is
 * generated on the client only — the raw SVG is ~300KB, too large to bake into
 * the static HTML, and a theme-dependent `src` baked at build time would also
 * mismatch on hydration.
 */
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function useDataTheme(): "light" | "dark" | null {
  return useSyncExternalStore(
    subscribeTheme,
    () =>
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light",
    () => null,
  );
}

/**
 * prefers-reduced-motion, via the same external-store pattern. The server
 * snapshot is `false`, so the first client render matches the server (SMIL
 * present) and reduced-motion users simply drop the animations on the next
 * commit — no hydration mismatch.
 */
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

export default function WorldMap({
  dots = [],
  lineColor = "var(--color-brand-amber)",
  className,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useDataTheme();
  const reduceMotion = useReducedMotion();

  // theme is null on the server and until the first post-hydration commit, so
  // the map is generated on the client only. Transparent background (rather
  // than the source's hard black/white block) lets the dots sit on the page's
  // own --bg and blend at every edge, not just the masked top/bottom.
  const svgMap = useMemo(() => {
    if (!theme) return null;
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: theme === "dark" ? "#FFFFFF40" : "#00000040",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, [theme]);

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

  // One full loop for every arc, so their draw/hold/fade stay in phase while
  // each starts staggered via its own `begin` offset.
  const CYCLE = 6; // seconds

  return (
    <div className={`relative aspect-[2/1] w-full font-sans ${className ?? ""}`}>
      {svgMap && (
        // Runtime-generated data URI; next/image can't optimise it, and the
        // rule would otherwise fail the build.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      )}
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

        {/*
         * Arcs drawn with SMIL rather than motion's pathLength: under this
         * Next/Turbopack + React 19 setup motion never applied the
         * stroke-dasharray, so the lines rendered fully drawn with no
         * animation. SMIL is already proven here (the node pulses below), and
         * pathLength="1" normalises every path so one dash/offset pair draws
         * any length. The loop is draw (0→0.45) → hold → fade out at the end,
         * so the reset to the undrawn state is never seen.
         */}
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
