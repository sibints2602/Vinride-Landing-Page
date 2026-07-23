"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

interface AutocompleteInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  /** Most matches to show; the list stays short and scannable. */
  maxItems?: number;
}

/** Themed <datalist> replacement using the ARIA combobox pattern; free typing still allowed. */
export function AutocompleteInput({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
  ariaInvalid,
  ariaDescribedBy,
  maxItems = 6,
}: AutocompleteInputProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    const matches = query
      ? options.filter((o) => o.toLowerCase().includes(query))
      : options;
    return matches.slice(0, maxItems);
  }, [value, options, maxItems]);

  const showList = open && filtered.length > 0;

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

  function choose(option: string) {
    onChange(option);
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
        setActive((a) => Math.min(a + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Enter":
        if (showList && active >= 0) {
          event.preventDefault();
          choose(filtered[active]);
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
          {filtered.map((option, i) => (
            <li
              key={option}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(event) => {
                // Prevent the input from blurring before the click resolves.
                event.preventDefault();
                choose(option);
              }}
              className={cn(
                "flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm text-fg transition-colors",
                i === active && "bg-surface-2",
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
