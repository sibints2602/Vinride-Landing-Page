"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HERO, NAV_LINKS } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  const close = () => setOpen(false);

  // Lock body scroll while the panel is open. The cleanup runs both on close
  // and on unmount (React always runs effect cleanups on unmount), so scroll
  // is restored even if the component disappears while the menu is open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Move focus into the panel on open, trap Tab within it, close on Escape.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const initial = getFocusable()[0] ?? panel;
    initial.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Return focus to the trigger once the panel closes.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-fg md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Icon name="menu" />
      </button>

      {/*
        Always mounted (rather than `{open && (...)}`) so the slide/fade can
        animate on both open AND close — an unmounted node has nothing to
        transition on exit. `inert` when closed removes the whole subtree
        from the tab order and the accessibility tree at the platform level
        (stronger than aria-hidden alone, and it can't be defeated by a
        stray tabIndex), and `pointer-events-none` stops the full-viewport
        wrapper from swallowing clicks meant for content behind it while
        hidden. Visibility itself is driven by transform/opacity so the
        transition can play; duration/easing come from token utility
        classes only (no inline styles), so the reduced-motion override in
        globals.css (which collapses `transition-duration` via `!important`)
        still applies.
      */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        inert={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink/50 transition-opacity duration-300 ease-out",
            open ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
          onClick={close}
        />
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          aria-hidden={!open}
          tabIndex={-1}
          className={cn(
            "absolute inset-y-0 right-0 flex h-full w-full max-w-xs flex-col gap-8 overflow-y-auto bg-surface p-6 shadow-sm transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted hover:text-fg"
              aria-label="Close menu"
              onClick={close}
            >
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-lg font-medium text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Button
            href={HERO.primaryCta.href}
            variant="primary"
            size="lg"
            onClick={close}
            className="mt-auto"
          >
            {HERO.primaryCta.label}
          </Button>
        </div>
      </div>
    </>
  );
}
