"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectMenuProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Extra classes for the trigger button, e.g. layout from the parent. */
  className?: string;
}

/**
 * A styled, accessible replacement for a native <select>: the browser's own
 * option popup can't be themed cross-platform, so this renders a listbox we
 * control. Implements the ARIA listbox pattern — button with
 * aria-haspopup/expanded, a focusable listbox with aria-activedescendant, full
 * keyboard support (Up/Down/Home/End/Enter/Esc), and click-outside to close.
 */
export function SelectMenu({
  id,
  value,
  onChange,
  options,
  className,
}: SelectMenuProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  // Which option the keyboard/pointer is highlighting while the list is open.
  const [active, setActive] = useState(selectedIndex);
  const current = options[selectedIndex];

  function openMenu() {
    setActive(selectedIndex);
    setOpen(true);
  }

  // Move focus into the list on open; close on any outside pointer press.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    btnRef.current?.focus();
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openMenu();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((a) => Math.min(a + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-sm text-fg",
          className,
        )}
      >
        <span className="truncate">{current.label}</span>
        <Icon name="chevron-down" className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listId}-opt-${active}`}
          onKeyDown={onListKeyDown}
          className="absolute left-0 top-full z-30 mt-2 max-h-64 w-full min-w-[11rem] overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-lift-lg focus:outline-none"
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(event) => {
                // Keep focus off the <li> so the list doesn't blur before the
                // click resolves.
                event.preventDefault();
                choose(i);
              }}
              className={cn(
                "flex cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2 text-sm text-fg transition-colors",
                i === active && "bg-surface-2",
              )}
            >
              {option.label}
              {option.value === value && (
                <Icon name="check" className="h-4 w-4 text-link" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
