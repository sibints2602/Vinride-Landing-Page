"use client";

import { useState } from "react";
import { THEME_TOGGLE } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

type Theme = "light" | "dark";

const STORAGE_KEY = "vinride-theme";

// Reads the theme ThemeScript already committed to the DOM before paint, so
// the very first client render matches reality instead of assuming "light"
// and correcting a beat later (which is what an effect-based read would do).
// Guarded for SSR: static generation runs this in Node, where `document`
// doesn't exist.
function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";

  function toggleTheme() {
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      // Must stay the literal string "light" or "dark" — ThemeScript treats
      // any truthy stored value as valid, so writing anything else would
      // silently break persistence on the next load.
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled: theme still applies this
      // session, it just won't persist across reloads.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? THEME_TOGGLE.switchToLight : THEME_TOGGLE.switchToDark}
      suppressHydrationWarning
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:text-fg"
    >
      {/*
       * Both icons always render — which one is visible is decided by the
       * `dark:` CSS variant (driven by the `data-theme` attribute ThemeScript
       * already set before paint), not by the `theme` state. That keeps the
       * server-rendered markup and the first client render byte-identical:
       * conditionally rendering only one icon based on client-read state
       * causes React to hydrate a structurally different SVG (different
       * children) than the server sent, which is severe enough that React
       * discards the whole client render and redoes it from scratch — which
       * re-applies the hardcoded data-theme="light" from RootLayout's JSX
       * and silently reverts the user's actual theme a moment after load.
       */}
      <span className="dark:hidden">
        <Icon name="moon" />
      </span>
      <span className="hidden dark:inline">
        <Icon name="sun" />
      </span>
    </button>
  );
}
