"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

/** Minimum shape the combobox needs; consumers pass richer objects (e.g. a geocoded Place). */
export interface AutocompleteSuggestion {
  id: string;
  label: string;
}

interface AutocompleteInputProps<T extends AutocompleteSuggestion> {
  id: string;
  value: string;
  /** Free typing — fires on every keystroke. */
  onChange: (value: string) => void;
  /** Ready-to-show matches, owned and fetched by the parent (async/debounced). */
  suggestions: T[];
  /** A suggestion was picked (click / Enter) — parent captures the full object, incl. any coords. */
  onSelect: (suggestion: T) => void;
  /** True while the parent is fetching; shows a quiet loading row instead of stale matches. */
  loading?: boolean;
  loadingLabel?: string;
  placeholder?: string;
  className?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

/** Themed combobox (ARIA pattern) over parent-supplied suggestions; free typing stays allowed. */
export function AutocompleteInput<T extends AutocompleteSuggestion>({
  id,
  value,
  onChange,
  suggestions,
  onSelect,
  loading = false,
  loadingLabel = "Searching…",
  placeholder,
  className,
  ariaInvalid,
  ariaDescribedBy,
}: AutocompleteInputProps<T>) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const hasMatches = suggestions.length > 0;
  const showList = open && (hasMatches || loading);

  // Keep the highlighted index in range as matches stream in/out.
  useEffect(() => {
    setActive((a) => (a >= suggestions.length ? -1 : a));
  }, [suggestions]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function choose(suggestion: T) {
    onSelect(suggestion);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActive((a) => Math.min(a + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Enter":
        if (showList && active >= 0 && suggestions[active]) {
          event.preventDefault();
          choose(suggestions[active]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
          setActive(-1);
        }
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        // Extensions stamp attrs like fdprocessedid pre-hydration; suppress mismatch noise here only.
        suppressHydrationWarning
        id={id}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && active >= 0 ? `${listId}-opt-${active}` : undefined
        }
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedBy}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        className={className}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full min-w-48 overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-lift-lg"
        >
          {hasMatches
            ? suggestions.map((suggestion, i) => (
                <li
                  key={suggestion.id}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(event) => {
                    // Prevent the input from blurring before the click resolves.
                    event.preventDefault();
                    choose(suggestion);
                  }}
                  className={cn(
                    "flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm text-fg transition-colors",
                    i === active && "bg-surface-2",
                  )}
                >
                  {suggestion.label}
                </li>
              ))
            : (
                <li
                  role="option"
                  aria-selected={false}
                  aria-disabled
                  className="flex select-none items-center rounded-xl px-3 py-2 text-sm text-fg-muted"
                >
                  {loadingLabel}
                </li>
              )}
        </ul>
      )}
    </div>
  );
}
