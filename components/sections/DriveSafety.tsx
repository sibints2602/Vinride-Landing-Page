"use client";

import { useEffect, useRef, useState } from "react";
import { DRIVE_SAFETY_TABS } from "@/content/site";
import { DrivePanel } from "@/components/sections/DriveWithUs";
import { SafetyPanel } from "@/components/sections/Safety";
import { cn } from "@/lib/utils";

type TabId = (typeof DRIVE_SAFETY_TABS.tabs)[number]["id"];

const PANELS: Record<TabId, () => React.ReactNode> = {
  drive: DrivePanel,
  safety: SafetyPanel,
};

/** Drive + Safety behind one tab rail; dark theme pins only on Drive, both nav anchors land here. */
export function DriveSafety() {
  const [active, setActive] = useState<TabId>("drive");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.slice(1);
      if (id === "drive" || id === "safety") setActive(id);
    };
    // hashchange doesn't fire when a link re-asserts the current hash, so also watch anchor clicks
    const applyClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.(
        'a[href="#drive"], a[href="#safety"]',
      );
      if (anchor) {
        setActive(anchor.getAttribute("href")!.slice(1) as TabId);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    document.addEventListener("click", applyClick);
    return () => {
      window.removeEventListener("hashchange", applyHash);
      document.removeEventListener("click", applyClick);
    };
  }, []);

  const ActivePanel = PANELS[active];

  const moveFocus = (offset: number) => {
    const tabs = DRIVE_SAFETY_TABS.tabs;
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <section
      id="drive"
      {...(active === "drive" ? { "data-theme": "dark" } : {})}
      className="bg-bg transition-colors duration-300"
    >
      {/* Second anchor so the navbar's #safety link lands on this section. */}
      <span id="safety" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:grid lg:grid-cols-[3.5rem_1fr] lg:gap-10 lg:px-8">
        {/* One thin rail with only content-facing hairlines, so it reads as tabs, not a box */}
        <div
          role="tablist"
          aria-label={DRIVE_SAFETY_TABS.ariaLabel}
          aria-orientation="vertical"
          className="mb-10 flex divide-x divide-line overflow-hidden border-b border-line lg:mb-0 lg:h-full lg:flex-col lg:divide-x-0 lg:divide-y lg:border-b-0 lg:border-r"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
              event.preventDefault();
              moveFocus(1);
            } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
              event.preventDefault();
              moveFocus(-1);
            }
          }}
        >
          {DRIVE_SAFETY_TABS.tabs.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                // Extension-stamped attributes (fdprocessedid) — see AutocompleteInput.
                suppressHydrationWarning
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                type="button"
                role="tab"
                id={`${tab.id}-tab`}
                aria-selected={selected}
                aria-controls={`${tab.id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center px-4 py-3 transition-colors lg:items-start lg:px-0 lg:py-0 lg:pt-6",
                  selected ? "bg-surface" : "hover:bg-surface/60",
                )}
              >
                {/* Sideways on desktop, reading bottom-to-top. */}
                <span
                  className={cn(
                    "text-sm font-semibold uppercase tracking-widest lg:rotate-180 lg:[writing-mode:vertical-rl]",
                    selected ? "text-link" : "text-fg-muted",
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          key={active}
          role="tabpanel"
          id={`${active}-panel`}
          aria-labelledby={`${active}-tab`}
        >
          <ActivePanel />
        </div>
      </div>
    </section>
  );
}
