# Vinride Marketing Site — Design

**Date:** 2026-07-21
**Status:** Approved (design), pending implementation plan

## 1. What we're building

A single-page public marketing website for **Vinride**, a ride-hailing company (Uber-like: riders book a car or bike ride with a driver, point-to-point). Not a peer-to-peer rental marketplace — the visual reference material comes from one, but the content model is ride-hailing.

**Scope:** one long landing page at `/` with anchor-scroll navigation. No `/drive`, `/cities`, or blog pages in this iteration. The section components are built standalone so any of them can be lifted into a dedicated page later without rework.

**Goal of the page:** get riders to the (future) app, and get drivers to sign up as captains.

## 2. Content reality

The **only** real asset is the logo (`public/Viride-Logo.png`, plus `Vinride-Logo-BG.jpeg`). No app store listings, no city list, no fare rates, no photography.

Therefore:

- **All** copy, stats, fares, city names and vehicle data live in a single typed module, `content/site.ts`. Swapping in real data is a one-file edit — no hunting through JSX.
- Store badges render as **"Coming soon"** state, not as live links to nonexistent listings.
- Indicative fares carry a visible "indicative rates" note. We do not present invented numbers as fact.
- **No fabricated social proof.** No fake press logos, no fake partner brands, no invented testimonials with realistic-looking named people. The reference site's automaker logo strip is deliberately dropped and replaced by a stats strip whose numbers are placeholders in `content/site.ts`.
- Imagery is CSS/SVG-driven (gradient meshes, abstract map lines, silhouette vehicle shapes) rather than stock photos of real people.

## 3. Design system

### Color

Derived from the logo, which is a map pin split into a green→teal half and a yellow→orange half.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand-yellow` | `#F5B301` | `#F5B301` | primary buttons, active chips, highlights |
| `--brand-amber` | `#EF7D00` | `#EF7D00` | gradient partner to yellow |
| `--brand-green` | `#0FB894` | `#14D3A9` | trust/safety accents, colored text links, driver-earnings figures |
| `--brand-forest` | `#123D2F` | `#123D2F` | deep accent, dark section fills |
| `--bg` | `#FAFAF8` | `#0E1412` | page canvas (warm off-white / charcoal-green, never pure white or black) |
| `--surface` | `#FFFFFF` | `#161E1B` | cards |
| `--fg` | `#14100B` | `#F2F1EC` | body text |
| `--muted` | warm grey | warm grey | secondary text, borders |

**Hard accessibility constraint:** yellow-on-white fails WCAG AA. Rules, enforced at the component level:

1. Yellow-filled surfaces always use near-black (`--fg` light) text. Never white text on yellow.
2. Yellow is never used for body copy or for text links.
3. Green (`--brand-green`) is the colored-text color; the dark variant is used in dark mode to hold contrast.
4. Every text/background pair targets ≥ 4.5:1 (≥ 3:1 for text ≥ 24px).

Tokens are declared once in `app/globals.css` using Tailwind v4's CSS-first `@theme` block, with dark values under a `.dark` selector. No JS color config.

### Typography

- Display face for headings — geometric sans, tight tracking, large sizes (hero ≈ `clamp(2.5rem, 6vw, 4.5rem)`).
- Separate clean sans for body.
- Both self-hosted via `next/font` — zero external font requests, no layout shift.

### Motion

- Reveal-on-scroll for section entry (IntersectionObserver, translate + fade).
- Hover-lift on cards, chip press states.
- Animated count-up on the stats strip, triggered on first view only.
- Everything gated behind `prefers-reduced-motion: reduce` — motion collapses to instant, no parallax.

### Theming

- `class`-based dark mode on `<html>`.
- Toggle in the navbar; choice persisted to `localStorage`, defaulting to `prefers-color-scheme` on first visit.
- A small blocking inline script in `<head>` applies the stored theme before first paint to prevent flash-of-wrong-theme.
- Every section is verified in both themes; dark mode is a first-class design, not an inversion filter.

### Responsive

Mobile-first. Breakpoints at `sm/md/lg`. The fare-estimate widget stacks vertically on mobile; the category grid goes 1 → 2 → 3 columns; nav collapses to a slide-over sheet.

## 4. Page sections (11, in order)

1. **Nav** — logo, anchor links (Ride · Drive · Safety · Company), theme toggle, "Get the app" pill CTA. Sticky, backdrop-blurs after scroll, mobile slide-over menu.
2. **Hero** — headline, subcopy, floating fare-estimate widget (pickup / drop inputs, vehicle-type chips, "Get estimate"), hero vehicle visual, scroll cue.
3. **Stats strip** — four animated counters: rides completed, cities, captains, average rating.
4. **Ride categories** — filter chips (Bike · Auto · Sedan · SUV · Outstation) filtering a card grid; each card shows type, seats, ETA, from-fare.
5. **Why Vinride** — three tinted feature cards: upfront fares, verified captains, 24/7 support.
6. **How it works** — three numbered steps with a connecting line: set destination → get matched → ride & pay.
7. **Fare transparency** — compact per-vehicle-type rate table (base, per-km, waiting) plus a "no surge surprises" note and the indicative-rates disclaimer.
8. **Drive with Vinride** — split layout, green-accented to signal the audience switch: earnings claim, benefits list, captain sign-up CTA.
9. **Safety & trust** — SOS, live trip share, ID-verified captains, insurance cover.
10. **App download** — full-bleed yellow→amber gradient banner, phone mockup, store badges in "Coming soon" state.
11. **Footer** — logo, four link columns, socials, city list, legal links, copyright.

### Fare estimator behaviour

Front-end only. No API, no map SDK, no geocoding in this iteration.

- Pickup/drop are free-text inputs with a datalist of placeholder localities from `content/site.ts`.
- On submit it computes a plausible fare range from the selected vehicle type's placeholder rates and a deterministic pseudo-distance derived from the input strings, then renders the range inline beneath the widget.
- The result panel is explicitly labelled as an estimate demo. It never claims to have booked anything.
- Empty inputs produce an inline validation message, not a silent no-op.

## 5. Architecture

Existing stack, unchanged: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4. No new runtime dependencies — no UI kit, no animation library, no icon package (icons are local inline SVG components).

```
app/
  layout.tsx            root layout, fonts, metadata, ThemeScript
  page.tsx              composes the 11 sections in order
  globals.css           @theme tokens, dark overrides, base styles
components/
  layout/
    Navbar.tsx  MobileMenu.tsx  Footer.tsx
    ThemeToggle.tsx  ThemeScript.tsx
  sections/
    Hero.tsx  FareEstimator.tsx  StatsStrip.tsx  RideCategories.tsx
    WhyVinride.tsx  HowItWorks.tsx  FareTable.tsx  DriveWithUs.tsx
    Safety.tsx  AppDownload.tsx
  ui/
    Button.tsx  Card.tsx  Chip.tsx  SectionHeading.tsx
    Reveal.tsx  Counter.tsx  Icon.tsx
content/
  site.ts               ALL copy + placeholder data, typed
lib/
  fare.ts               estimate calculation, pure + unit-testable
  utils.ts              cn() class helper
```

**Boundaries.**

- `content/site.ts` is the single source of copy and data. Section components read from it; they never hard-code user-facing strings.
- `lib/fare.ts` is pure — inputs in, fare range out, no React, no DOM. It is the only piece with real logic, so it is the only piece that needs unit tests.
- `components/ui/*` know nothing about Vinride; they are presentational primitives.
- `components/sections/*` are self-contained: each renders a full-width `<section>` with its own id anchor and pulls its own slice of content. Composing them in a different order, or moving one to a future dedicated page, requires no edits inside them.
- Server Components by default. `"use client"` only where genuinely needed: `ThemeToggle`, `MobileMenu`, `FareEstimator`, `RideCategories` (filter state), `Reveal`, `Counter`.

**Framework caution.** `AGENTS.md` warns that this Next.js version has breaking changes versus training data. Before writing app-router, metadata, or font code, the relevant guide under `node_modules/next/dist/docs/` gets read first.

## 6. Error handling

Small surface, but explicitly:

- Fare estimator: empty or whitespace-only inputs → inline field error, not a crash and not a silent return.
- `lib/fare.ts` receiving an unknown vehicle type → throws, caught at the component boundary and surfaced as "Couldn't estimate that route", rather than rendering `NaN`.
- Theme script: `localStorage` access wrapped in try/catch (private browsing can throw); falls back to system preference.
- IntersectionObserver absent → `Reveal` renders content visible immediately rather than leaving the page blank.
- Images: local assets only, with explicit width/height to avoid CLS.

## 7. Verification

No test framework is installed and one is not warranted for a static marketing page. Verification is:

**Automated**
- `npm run build` succeeds with no type errors.
- `npm run lint` clean.
- Unit tests for `lib/fare.ts` only, if a runner is added; otherwise its behaviour is exercised manually across each vehicle type.

**Manual checklist, run before calling it done**
- Every section renders correctly in both light and dark themes.
- No flash-of-wrong-theme on hard reload with dark stored.
- Contrast checked on yellow buttons, green links, muted text — both themes.
- Full keyboard traversal: nav, mobile menu (focus trap + Escape), chips, estimator, all CTAs. Visible focus rings throughout.
- `prefers-reduced-motion: reduce` disables reveals, counters and hover transforms.
- Layouts at 375px, 768px, 1280px, 1920px. No horizontal scroll at any width.
- Anchor links scroll to the right section with sticky-nav offset accounted for.

## 8. Explicitly out of scope

Real maps/geocoding, booking or auth flows, a backend or API, a CMS, blog, testimonials, cities-served map, FAQ accordion, i18n, analytics, dedicated sub-pages. Each is a follow-up with its own spec.
