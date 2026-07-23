"use client";

import { useState } from "react";
import { THEME_TOGGLE } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

type Theme = "light" | "dark";

const STORAGE_KEY = "vinride-theme";

// Reads the theme ThemeScript committed pre-paint so the first render matches; SSR-guarded.
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
      // Must stay literally "light"/"dark" — ThemeScript treats any truthy stored value as valid.
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage disabled: theme still applies this session, just won't persist.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? THEME_TOGGLE.switchToLight : THEME_TOGGLE.switchToDark}
      // Covers the theme-dependent aria-label and extension-stamped attributes like fdprocessedid.
      suppressHydrationWarning
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:text-fg"
    >
      {/* Both icons always render (CSS picks one) so server and client markup stay byte-identical. */}
      <span className="dark:hidden">
        <Icon name="moon" />
      </span>
      <span className="hidden dark:inline">
        <Icon name="sun" />
      </span>
    </button>
  );
}
