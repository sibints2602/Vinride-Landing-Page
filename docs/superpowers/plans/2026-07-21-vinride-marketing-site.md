# Vinride Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page public marketing website for Vinride, a ride-hailing company, with a yellow/green brand identity and first-class dark and light themes.

**Architecture:** One route (`/`) composed of eleven independent, self-contained section components. All user-facing copy and placeholder data lives in one typed module (`content/site.ts`) so real data is a single-file swap. The only real logic — fare estimation — is isolated in a pure, unit-tested module (`lib/fare.ts`). Server Components by default; `"use client"` only where interaction demands it.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack default), React 19.2.4, TypeScript 5, Tailwind CSS v4 (CSS-first `@theme`), Vitest (dev-only, for `lib/fare.ts`). Node 22.17.0 installed; Next 16 requires ≥ 20.9.

**Source spec:** `docs/superpowers/specs/2026-07-21-vinride-marketing-site-design.md`

---

## Global Constraints

Every task's requirements implicitly include this section.

**Framework**
- Next.js 16.2.10. **This version has breaking changes vs. training data.** Before writing layout, metadata, font, or image code, read the relevant guide under `node_modules/next/dist/docs/`. Verified facts for this plan are listed below — trust these over memory.
- `next/image`: **`priority` is deprecated in v16.** For the hero image use `loading="eager" fetchPriority="high"`, not `priority`. `width`+`height` required unless statically imported or using `fill`.
- `next/image`: `images.qualities` now defaults to `[75]`. Do not pass a `quality` prop other than 75 without configuring `next.config.ts`.
- `viewport` and `themeColor` must be a **separate `export const viewport: Viewport`**, not fields inside `metadata` (deprecated since 14).
- `metadata` / `viewport` exports work **only in Server Components**.
- Next 16 **no longer overrides `scroll-behavior`** during navigation. Because this site uses smooth anchor scrolling, `<html>` must carry `data-scroll-behavior="smooth"`.
- Turbopack is the default for both `next dev` and `next build`. Do not add a custom webpack config — `next build` will fail.
- `next lint` is removed. Lint with `npm run lint` (already wired to flat-config `eslint`).

**Dependencies**
- **Zero new runtime dependencies.** No UI kit, no animation library, no icon package. Icons are local inline SVG components. Vitest is the only permitted addition, as a devDependency.

**Content**
- No real assets exist except the logo. **Never** invent press logos, partner brands, or testimonials attributed to realistic-looking named people.
- App store badges render in a **"Coming soon"** state — never link to nonexistent listings.
- Fares, stats, and cities are placeholders and live **only** in `content/site.ts`. No user-facing string is hard-coded in a section component.
- Any displayed fare figure is accompanied by the indicative-rates disclaimer from `content/site.ts`.

**Design system (exact values)**
- Brand yellow `#F5B301`, amber `#EF7D00`, green `#0FB894`, green-strong (dark mode) `#14D3A9`, forest `#123D2F`.
- Light: bg `#FAFAF8`, surface `#FFFFFF`, fg `#14100B`. Dark: bg `#0E1412`, surface `#161E1B`, fg `#F2F1EC`.
- **Yellow-filled surfaces always use near-black text (`#14100B`). Never white text on yellow.** Yellow is never used for body copy or text links.
- Colored text links use `--color-link` (green), never yellow.
- All text/background pairs ≥ 4.5:1 (≥ 3:1 for text ≥ 24px), in both themes.
- Theming is `[data-theme="dark"]` attribute-based (not a `.dark` class, not `prefers-color-scheme` media queries).

**Accessibility (non-negotiable, applies to every component)**
- All interactive elements reachable and operable by keyboard, with a visible focus ring.
- Every `<section>` has a unique `id` for anchor navigation and an accessible heading.
- All motion — reveals, counters, hover transforms — is disabled under `prefers-reduced-motion: reduce`.
- Decorative SVGs get `aria-hidden="true"`; meaningful ones get an accessible name.
- No horizontal scroll at any viewport from 320px up.

**Commits**
- Commit after each task, with a conventional-commit message. Do not push.

---

## File Structure

| Path | Responsibility |
|---|---|
| `app/globals.css` | Tailwind import, dark variant, design tokens, base styles. The **only** place raw color values appear. |
| `app/layout.tsx` | Root layout: fonts, metadata, viewport, theme script, `<html>` attributes. |
| `app/page.tsx` | Composes the eleven sections in order. No styling logic. |
| `content/site.ts` | Every user-facing string and placeholder datum, typed. |
| `lib/fare.ts` | Pure fare-estimate logic. No React, no DOM. |
| `lib/fare.test.ts` | Unit tests for the above. |
| `lib/utils.ts` | `cn()` class-name joiner. |
| `components/layout/ThemeScript.tsx` | Blocking inline script preventing theme flash. |
| `components/layout/ThemeToggle.tsx` | Client. Light/dark switch, persists to `localStorage`. |
| `components/layout/Navbar.tsx` | Sticky nav shell. |
| `components/layout/MobileMenu.tsx` | Client. Slide-over menu with focus trap. |
| `components/layout/Footer.tsx` | Footer. |
| `components/ui/Button.tsx` | Button/link primitive with brand variants. |
| `components/ui/Card.tsx` | Surface card primitive. |
| `components/ui/Chip.tsx` | Client. Filter/selection pill. |
| `components/ui/SectionHeading.tsx` | Eyebrow + heading + subcopy block. |
| `components/ui/Reveal.tsx` | Client. Scroll-reveal wrapper. |
| `components/ui/Counter.tsx` | Client. Count-up number. |
| `components/ui/Icon.tsx` | Local inline SVG icon set. |
| `components/sections/*.tsx` | Ten section components, one file each, each self-contained. |

---

## Task Sequencing

Tasks 1–5 are the shared foundation and **must run in order, sequentially**. Every later task depends on the tokens, content module, and UI primitives they produce.

Tasks 6–13 touch disjoint files and depend only on the foundation, so they can be executed **in parallel** by separate agents. Task 14 integrates.

```
1 → 2 → 3 → 4 → 5 → ┬→ 6  (Navbar + MobileMenu)
                    ├→ 7  (Hero + FareEstimator)
                    ├→ 8  (StatsStrip)
                    ├→ 9  (RideCategories)
                    ├→ 10 (WhyVinride + HowItWorks)
                    ├→ 11 (FareTable)
                    ├→ 12 (DriveWithUs + Safety)
                    └→ 13 (AppDownload + Footer)
                              ↓
                         14 (Compose + QA)
```

**A note on markup detail:** Tasks 1–4 give complete, literal code — tokens, theme script, content and fare logic are load-bearing and must be exact. Task 5 gives complete code for `Button` (it encodes the contrast rule, so it must not be improvised) and precise behavioral specs for the remaining primitives. Tasks 6–13 specify exact file paths, component signatures, content keys, layout structure, responsive behavior, and accessibility requirements — everything that must be true — but deliberately do not dictate line-by-line JSX. Visual composition within those constraints is the implementer's craft; duplicating full markup here would just be writing the site twice.

---

### Task 1: Design tokens and base styles

**Files:**
- Modify: `app/globals.css` (full rewrite — current content is create-next-app boilerplate)

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utility classes backed by these tokens, used by every later task —
  `bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-fg-muted`, `text-link`, `border-line`,
  `bg-brand-yellow`, `bg-brand-amber`, `text-brand-green`, `bg-brand-forest`, `text-ink`,
  `font-display`, `font-sans`,
  and the `dark:` variant, which keys off `[data-theme="dark"]`.

- [ ] **Step 1: Replace `app/globals.css` entirely**

```css
@import "tailwindcss";

/* Dark mode is attribute-driven, not media-query driven, so the ThemeToggle can
   override the OS preference. Must match the attribute set by ThemeScript. */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* ---- Brand constants: identical in both themes ---- */
@theme {
  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  --color-brand-yellow: #f5b301;
  --color-brand-amber: #ef7d00;
  --color-brand-green: #0fb894;
  --color-brand-green-strong: #14d3a9;
  --color-brand-forest: #123d2f;
  /* Near-black. The ONLY permitted text color on a yellow or amber fill. */
  --color-ink: #14100b;
}

/* ---- Theme-dependent surfaces ---- */
:root {
  --bg: #fafaf8;
  --surface: #ffffff;
  --surface-2: #f2f1ec;
  --fg: #14100b;
  --fg-muted: #6b6660;
  --line: #e5e2da;
  /* Darkened brand green. #0FB894 is only 2.53:1 on white; this is 5.22:1 on
     #ffffff and 4.99:1 on #fafaf8, clearing AA on both surfaces. */
  --link: #087b63;
  --ring: #087b63;
}

[data-theme="dark"] {
  --bg: #0e1412;
  --surface: #161e1b;
  --surface-2: #1e2825;
  --fg: #f2f1ec;
  --fg-muted: #a3a9a5;
  --line: #2a3532;
  --link: #14d3a9;
  --ring: #14d3a9;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-line: var(--line);
  --color-link: var(--link);
}

@layer base {
  html {
    scroll-behavior: smooth;
    /* Sticky nav is 4rem tall; keeps anchor targets from hiding beneath it. */
    scroll-padding-top: 5rem;
    color-scheme: light;
  }

  [data-theme="dark"] {
    color-scheme: dark;
  }

  body {
    background-color: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
  }

  :focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 2: Verify the tokens compile**

Run: `npm run build`
Expected: build succeeds. (The page still renders create-next-app content — that is fine, Task 2 replaces it.)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): add Vinride design tokens and dark variant"
```

---

### Task 2: Root layout, fonts, metadata, and theme script

**Files:**
- Create: `components/layout/ThemeScript.tsx`
- Create: `lib/utils.ts`
- Modify: `app/layout.tsx` (full rewrite)
- Modify: `app/page.tsx` (replace boilerplate with a temporary empty `<main>`)

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces:
  - `<ThemeScript />` — renders the blocking inline theme script. Server Component.
  - `cn(...classes: Array<string | false | null | undefined>): string`
  - CSS variables `--font-outfit` and `--font-inter` on `<html>`, which Task 1's `@theme` block reads.
  - `<html>` carries `data-theme`, `suppressHydrationWarning`, and `data-scroll-behavior="smooth"`.

- [ ] **Step 1: Create `lib/utils.ts`**

```ts
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 2: Create `components/layout/ThemeScript.tsx`**

This is the documented Next 16 anti-flash pattern (`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`). A raw inline `<script>` is required — `next/script` with `beforeInteractive` does **not** block paint. `localStorage` is wrapped in try/catch because private browsing can throw.

```tsx
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("vinride-theme");var t=s||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
```

- [ ] **Step 3: Rewrite `app/layout.tsx`**

`viewport` is a separate export — putting `themeColor` inside `metadata` is deprecated. `data-scroll-behavior="smooth"` is required because Next 16 stopped overriding scroll behavior. `suppressHydrationWarning` is required because the script mutates `<html>` before React hydrates.

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Vinride — Book a ride in minutes",
  description:
    "Vinride is a ride-hailing service for bikes, autos, sedans and SUVs. Upfront fares, verified captains, 24/7 support.",
  openGraph: {
    title: "Vinride — Book a ride in minutes",
    description:
      "Bikes, autos, sedans and SUVs. Upfront fares, verified captains, 24/7 support.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1412" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx` with a placeholder**

```tsx
export default function HomePage() {
  return <main className="flex-1" />;
}
```

- [ ] **Step 5: Verify build and no-flash behavior**

Run: `npm run build`
Expected: succeeds, and the route is listed as `○ (Static)`.

Then run `npm run dev`, open the page, and in DevTools console run:
```js
localStorage.setItem("vinride-theme", "dark")
```
Hard-reload. Expected: the page paints dark immediately — **no white flash on any frame**. Confirm `<html data-theme="dark">` in the elements panel.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/page.tsx components/layout/ThemeScript.tsx lib/utils.ts
git commit -m "feat(layout): add fonts, metadata, viewport and flash-free theme script"
```

---

### Task 3: Content module

**Files:**
- Create: `content/site.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the single source of copy for every section. Exact exported names and types below — later tasks import these by name and must not rename or restructure them.

- [ ] **Step 1: Create `content/site.ts`**

Every value here is a placeholder. Real data replaces the values; the shape stays.

```ts
export type VehicleTypeId = "bike" | "auto" | "sedan" | "suv" | "outstation";

export interface VehicleType {
  id: VehicleTypeId;
  label: string;
  tagline: string;
  seats: number;
  etaMinutes: number;
  /** Currency-formatted starting fare, e.g. "₹29". Display only. */
  fromFare: string;
}

export interface FareRate {
  vehicleId: VehicleTypeId;
  baseFare: number;
  perKm: number;
  perMinute: number;
  minimumFare: number;
}

export interface Stat {
  value: number;
  /** Rendered after the animated number, e.g. "M+", "+", "★". */
  suffix: string;
  label: string;
}

export interface Feature {
  title: string;
  body: string;
  /** Must match a key of the ICONS map in components/ui/Icon.tsx. */
  icon: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const BRAND = {
  name: "Vinride",
  logoSrc: "/Viride-Logo.png",
  tagline: "Move your city.",
  currencySymbol: "₹",
} as const;

/** Shown anywhere a fare figure appears. Non-negotiable — the numbers are invented. */
export const DISCLAIMER =
  "Indicative rates shown for illustration. Final fares vary by city, distance, time and demand.";

export const NAV_LINKS: NavLink[] = [
  { label: "Ride", href: "#ride" },
  { label: "Fares", href: "#fares" },
  { label: "Drive", href: "#drive" },
  { label: "Safety", href: "#safety" },
];

export const HERO = {
  eyebrow: "Now rolling in 12 cities",
  heading: "Your city, one tap away.",
  subheading:
    "Bikes, autos, sedans and SUVs — matched in seconds, priced upfront. No surge surprises, no haggling.",
  primaryCta: { label: "Get the app", href: "#download" },
  secondaryCta: { label: "Drive with us", href: "#drive" },
} as const;

export const ESTIMATOR = {
  heading: "Check your fare",
  pickupLabel: "Pickup",
  pickupPlaceholder: "Enter a pickup point",
  dropLabel: "Drop",
  dropPlaceholder: "Where to?",
  submitLabel: "Get estimate",
  resultPrefix: "Estimated fare",
  demoNote: "Demo estimate — this does not book a ride.",
  errors: {
    pickupRequired: "Add a pickup point.",
    dropRequired: "Add a drop location.",
    sameLocation: "Pickup and drop can't be the same place.",
  },
} as const;

/** Placeholder localities powering the input datalists. */
export const LOCALITIES: string[] = [
  "City Centre",
  "Airport Terminal 1",
  "Central Railway Station",
  "Tech Park",
  "University Campus",
  "Riverside Mall",
  "Old Town",
  "Stadium Road",
];

export const VEHICLE_TYPES: VehicleType[] = [
  { id: "bike", label: "Bike", tagline: "Beat the traffic, solo.", seats: 1, etaMinutes: 2, fromFare: "₹29" },
  { id: "auto", label: "Auto", tagline: "Short hops, fair meters.", seats: 3, etaMinutes: 3, fromFare: "₹45" },
  { id: "sedan", label: "Sedan", tagline: "Comfort for the everyday commute.", seats: 4, etaMinutes: 4, fromFare: "₹89" },
  { id: "suv", label: "SUV", tagline: "Room for the whole crew.", seats: 6, etaMinutes: 6, fromFare: "₹149" },
  { id: "outstation", label: "Outstation", tagline: "City to city, one fare.", seats: 4, etaMinutes: 15, fromFare: "₹1,499" },
];

export const FARE_RATES: FareRate[] = [
  { vehicleId: "bike", baseFare: 15, perKm: 6, perMinute: 0.5, minimumFare: 29 },
  { vehicleId: "auto", baseFare: 25, perKm: 11, perMinute: 0.8, minimumFare: 45 },
  { vehicleId: "sedan", baseFare: 45, perKm: 16, perMinute: 1.2, minimumFare: 89 },
  { vehicleId: "suv", baseFare: 70, perKm: 22, perMinute: 1.6, minimumFare: 149 },
  { vehicleId: "outstation", baseFare: 500, perKm: 14, perMinute: 1, minimumFare: 1499 },
];

export const STATS: Stat[] = [
  { value: 4, suffix: "M+", label: "Rides completed" },
  { value: 12, suffix: "", label: "Cities served" },
  { value: 60, suffix: "K+", label: "Verified captains" },
  { value: 4.8, suffix: "★", label: "Average rating" },
];

export const RIDES_SECTION = {
  eyebrow: "Rides",
  heading: "A ride for every trip.",
  subheading: "From a two-minute hop across town to a two-hour haul between cities.",
  allLabel: "All",
  filterGroupLabel: "Filter ride types",
  seatsLabel: (seats: number) => (seats === 1 ? "1 seat" : `${seats} seats`),
  etaLabel: (minutes: number) => `~${minutes} min away`,
  fromLabel: "from",
} as const;

export const WHY_VINRIDE = {
  eyebrow: "Why Vinride",
  heading: "Built to be the ride you can trust.",
  subheading: "No hidden charges, no guesswork, no waiting alone at midnight.",
  features: [
    { title: "Upfront fares", body: "See the exact price before you confirm. What you're quoted is what you pay.", icon: "tag" },
    { title: "Verified captains", body: "Every captain is ID-checked, background-screened and rated after each trip.", icon: "shield" },
    { title: "24/7 support", body: "Real humans on call, any hour, in your language.", icon: "headset" },
  ] satisfies Feature[],
} as const;

export const HOW_IT_WORKS = {
  eyebrow: "How it works",
  heading: "Three taps and you're moving.",
  steps: [
    { title: "Set your destination", body: "Enter where you're headed and pick the ride that fits." },
    { title: "Get matched", body: "We find the nearest captain and show you the fare before you confirm." },
    { title: "Ride and pay", body: "Track the trip live, then pay by card, wallet or cash." },
  ] satisfies Step[],
} as const;

export const FARES_SECTION = {
  eyebrow: "Fares",
  heading: "Priced upfront. Every time.",
  subheading: "No surge multipliers hidden in the fine print.",
  columns: { vehicle: "Ride", base: "Base fare", perKm: "Per km", perMinute: "Per min", minimum: "Minimum" },
  noSurgeNote: "No surge pricing during regular hours.",
} as const;

export const DRIVE = {
  eyebrow: "Drive with Vinride",
  heading: "Own your hours. Keep more of the fare.",
  subheading:
    "Join as a captain and drive when it suits you — mornings, evenings, weekends, your call.",
  earningsValue: "₹32,000",
  earningsLabel: "Average monthly earnings for full-time captains",
  benefits: [
    "Weekly payouts, straight to your bank",
    "Lower commission than the big platforms",
    "Free insurance cover on every trip",
    "Fuel and service partner discounts",
  ],
  cta: { label: "Become a captain", href: "#download" },
} as const;

export const SAFETY = {
  eyebrow: "Safety",
  heading: "Every ride, watched over.",
  subheading: "Safety isn't a feature we bolt on. It's how the trip is built.",
  features: [
    { title: "One-tap SOS", body: "Reach emergency services and our safety desk from inside the trip screen.", icon: "siren" },
    { title: "Share your trip", body: "Send a live link so people you trust can follow you the whole way.", icon: "share" },
    { title: "ID-verified captains", body: "Documents and background checks re-verified every year.", icon: "badge" },
    { title: "Insurance cover", body: "Every trip is covered, for both rider and captain.", icon: "umbrella" },
  ] satisfies Feature[],
} as const;

export const APP_DOWNLOAD = {
  heading: "Get moving with Vinride.",
  subheading: "The app is on its way. Be first in line when we launch.",
  /** Both stores are pre-launch. Rendered as disabled "Coming soon" badges — never as links. */
  stores: [
    { platform: "Google Play", state: "coming-soon" as const },
    { platform: "App Store", state: "coming-soon" as const },
  ],
} as const;

export const CITIES: string[] = [
  "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kochi", "Coimbatore",
  "Mysuru", "Vizag", "Madurai", "Mangaluru", "Trichy", "Vijayawada",
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Newsroom", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    heading: "Ride",
    links: [
      { label: "Book a ride", href: "#ride" },
      { label: "Fares", href: "#fares" },
      { label: "Safety", href: "#safety" },
      { label: "Cities", href: "#cities" },
    ],
  },
  {
    heading: "Captains",
    links: [
      { label: "Become a captain", href: "#drive" },
      { label: "Earnings", href: "#drive" },
      { label: "Requirements", href: "#" },
      { label: "Captain support", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Cookie policy", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

export const FOOTER = {
  blurb: "Ride-hailing built on upfront fares and captains you can trust.",
  socials: [
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "X", href: "#", icon: "x" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
  ],
  citiesHeading: "Cities we serve",
  copyright: `© ${new Date().getFullYear()} Vinride. All rights reserved.`,
} as const;
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add content/site.ts
git commit -m "feat(content): add typed site content module with placeholder data"
```

---

### Task 4: Fare estimation logic (TDD)

**Files:**
- Create: `lib/fare.ts`
- Create: `lib/fare.test.ts`
- Modify: `package.json` (add vitest devDependency + `test` script)

**Interfaces:**
- Consumes: `VehicleTypeId`, `FARE_RATES` from `content/site.ts`.
- Produces, used by Task 7's `FareEstimator`:
  - `class UnknownVehicleError extends Error`
  - `class InvalidRouteError extends Error`
  - `interface FareEstimate { distanceKm: number; etaMinutes: number; low: number; high: number }`
  - `estimateFare(vehicleId: VehicleTypeId, pickup: string, drop: string): FareEstimate` — throws `InvalidRouteError` on blank or identical inputs, `UnknownVehicleError` on an unknown vehicle id.

This module is pure — no React, no DOM, no randomness. Given the same inputs it always returns the same output, which is what makes it testable and what stops the UI showing a different "estimate" on every render.

- [ ] **Step 1: Add Vitest**

```bash
npm install -D vitest
```

Then add to the `scripts` block of `package.json`:
```json
"test": "vitest run"
```

- [ ] **Step 2: Write the failing tests**

Create `lib/fare.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  estimateFare,
  InvalidRouteError,
  UnknownVehicleError,
} from "./fare";

describe("estimateFare", () => {
  it("is deterministic for the same inputs", () => {
    const a = estimateFare("sedan", "City Centre", "Tech Park");
    const b = estimateFare("sedan", "City Centre", "Tech Park");
    expect(a).toEqual(b);
  });

  it("normalises casing and surrounding whitespace", () => {
    const a = estimateFare("sedan", "City Centre", "Tech Park");
    const b = estimateFare("sedan", "  city centre ", "TECH PARK");
    expect(a).toEqual(b);
  });

  it("produces a plausible distance between 2 and 30 km", () => {
    const { distanceKm } = estimateFare("auto", "Old Town", "Riverside Mall");
    expect(distanceKm).toBeGreaterThanOrEqual(2);
    expect(distanceKm).toBeLessThanOrEqual(30);
  });

  it("returns a low bound below the high bound", () => {
    const { low, high } = estimateFare("suv", "Airport Terminal 1", "Stadium Road");
    expect(low).toBeLessThan(high);
  });

  it("never quotes below the vehicle's minimum fare", () => {
    const { low } = estimateFare("bike", "A", "B");
    expect(low).toBeGreaterThanOrEqual(29);
  });

  it("prices an SUV above a bike for the same route", () => {
    const bike = estimateFare("bike", "City Centre", "Tech Park");
    const suv = estimateFare("suv", "City Centre", "Tech Park");
    expect(suv.low).toBeGreaterThan(bike.low);
  });

  it("returns whole-rupee values", () => {
    const { low, high } = estimateFare("sedan", "Old Town", "Tech Park");
    expect(Number.isInteger(low)).toBe(true);
    expect(Number.isInteger(high)).toBe(true);
  });

  it("throws InvalidRouteError on a blank pickup", () => {
    expect(() => estimateFare("sedan", "   ", "Tech Park")).toThrow(InvalidRouteError);
  });

  it("throws InvalidRouteError on a blank drop", () => {
    expect(() => estimateFare("sedan", "City Centre", "")).toThrow(InvalidRouteError);
  });

  it("throws InvalidRouteError when pickup and drop match", () => {
    expect(() => estimateFare("sedan", "Tech Park", " tech park ")).toThrow(InvalidRouteError);
  });

  it("throws UnknownVehicleError for an unrecognised vehicle", () => {
    expect(() =>
      // @ts-expect-error deliberately testing an invalid id at runtime
      estimateFare("hovercraft", "City Centre", "Tech Park"),
    ).toThrow(UnknownVehicleError);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./fare"`.

- [ ] **Step 4: Implement `lib/fare.ts`**

```ts
import { FARE_RATES, type FareRate, type VehicleTypeId } from "@/content/site";

export class UnknownVehicleError extends Error {
  constructor(vehicleId: string) {
    super(`Unknown vehicle type: ${vehicleId}`);
    this.name = "UnknownVehicleError";
  }
}

export class InvalidRouteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRouteError";
  }
}

export interface FareEstimate {
  distanceKm: number;
  etaMinutes: number;
  low: number;
  high: number;
}

const MIN_KM = 2;
const MAX_KM = 30;
/** Average city speed in km/h, used to derive a trip duration from distance. */
const AVG_SPEED_KMH = 22;
/** The quote is presented as a ±8% band rather than a single false-precision number. */
const BAND = 0.08;

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Derives a stable pseudo-distance from the two location strings.
 *
 * There is no map or geocoding service in this build, so distance is a
 * deterministic hash of the route rather than a real measurement. Deterministic
 * matters: a random value would make the same route quote differently on every
 * keystroke, which reads as broken.
 */
function pseudoDistanceKm(pickup: string, drop: string): number {
  const route = `${normalise(pickup)}->${normalise(drop)}`;
  let hash = 2166136261;
  for (let i = 0; i < route.length; i += 1) {
    hash ^= route.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const span = MAX_KM - MIN_KM;
  const offset = Math.abs(hash) % (span * 10);
  return MIN_KM + offset / 10;
}

function findRate(vehicleId: VehicleTypeId): FareRate {
  const rate = FARE_RATES.find((entry) => entry.vehicleId === vehicleId);
  if (!rate) {
    throw new UnknownVehicleError(vehicleId);
  }
  return rate;
}

export function estimateFare(
  vehicleId: VehicleTypeId,
  pickup: string,
  drop: string,
): FareEstimate {
  const from = normalise(pickup);
  const to = normalise(drop);

  if (!from) {
    throw new InvalidRouteError("Pickup location is required.");
  }
  if (!to) {
    throw new InvalidRouteError("Drop location is required.");
  }
  if (from === to) {
    throw new InvalidRouteError("Pickup and drop must be different.");
  }

  const rate = findRate(vehicleId);
  const distanceKm = pseudoDistanceKm(pickup, drop);
  const etaMinutes = Math.max(5, Math.round((distanceKm / AVG_SPEED_KMH) * 60));

  const raw =
    rate.baseFare + distanceKm * rate.perKm + etaMinutes * rate.perMinute;
  const fare = Math.max(raw, rate.minimumFare);

  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    etaMinutes,
    low: Math.max(rate.minimumFare, Math.round(fare * (1 - BAND))),
    high: Math.round(fare * (1 + BAND)),
  };
}
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npm test`
Expected: PASS — 11 passed.

If the minimum-fare test fails for `bike`, the cause is `low` being clamped after rounding; the clamp in the return block is what guarantees it. Do not weaken the test to make it pass.

- [ ] **Step 6: Commit**

```bash
git add lib/fare.ts lib/fare.test.ts package.json package-lock.json
git commit -m "feat(fare): add deterministic fare estimation with unit tests"
```

---

### Task 5: UI primitives

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Chip.tsx`
- Create: `components/ui/SectionHeading.tsx`
- Create: `components/ui/Reveal.tsx`
- Create: `components/ui/Counter.tsx`
- Create: `components/ui/Icon.tsx`

**Interfaces:**
- Consumes: `cn` from `lib/utils`, tokens from Task 1.
- Produces — every later task uses these exact signatures:
  - `<Button variant="primary" | "secondary" | "ghost" size="md" | "lg" href?: string {...props}>` — renders `<a>` when `href` is present, otherwise `<button>`.
  - `<Card className?: string tone?: "surface" | "yellow" | "green" | "forest">`
  - `<Chip selected: boolean onClick: () => void>` (client)
  - `<SectionHeading eyebrow?: string heading: string subheading?: string align?: "left" | "center" as?: "h2" | "h3">`
  - `<Reveal delay?: number className?: string>` (client)
  - `<Counter value: number suffix?: string />` (client)
  - `<Icon name: string className?: string />` — `name` must be one of: `tag`, `shield`, `headset`, `siren`, `share`, `badge`, `umbrella`, `sun`, `moon`, `menu`, `close`, `arrow-right`, `check`, `pin`, `instagram`, `x`, `linkedin`, `google-play`, `apple`.

- [ ] **Step 1: Build `Button.tsx`**

The variant styles encode the contrast rule so no caller can get it wrong:

```tsx
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Near-black text on yellow. Never white — it fails contrast.
  primary:
    "bg-brand-yellow text-ink hover:bg-brand-amber hover:text-ink shadow-sm",
  secondary:
    "bg-surface text-fg border border-line hover:border-brand-green",
  ghost: "text-fg hover:text-link",
};

const SIZES: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Build `Card.tsx`, `SectionHeading.tsx`, `Chip.tsx`**

Requirements:
- `Card` — rounded-2xl surface with a `border-line` border and `bg-surface`; `tone` variants tint the background (`yellow` → a low-opacity yellow wash with `text-fg`, `green` → green wash, `forest` → `bg-brand-forest` with light text). Tinted tones must keep body text at `text-fg`, never yellow.
- `SectionHeading` — optional uppercase tracked eyebrow in `text-link`, then the heading in `font-display` at `text-3xl md:text-4xl lg:text-5xl`, then optional `text-fg-muted` subheading capped at `max-w-2xl`. The `as` prop controls the heading level so section nesting stays semantically correct.
- `Chip` — `"use client"`. Rounded-full pill, `aria-pressed={selected}`, selected state is `bg-brand-yellow text-ink`, unselected is `bg-surface-2 text-fg-muted border border-line`.

- [ ] **Step 3: Build `Reveal.tsx` and `Counter.tsx`**

Both are `"use client"`. Both must degrade safely.

`Reveal` requirements:
- Wraps children in a div that starts at `opacity-0 translate-y-4` and transitions to `opacity-100 translate-y-0` once intersecting.
- Uses `IntersectionObserver` with `threshold: 0.15`, unobserving after the first trigger.
- **If `IntersectionObserver` is undefined, or `prefers-reduced-motion: reduce` matches, render visible immediately.** A blank page is a far worse failure than a missing animation.
- `delay` prop applies a `transition-delay` in ms.

`Counter` requirements:
- Counts from 0 to `value` over ~1.2s using `requestAnimationFrame`, starting on first intersection only.
- Preserves one decimal place if `value` is fractional (so `4.8` never renders as `5`), otherwise renders an integer.
- Under `prefers-reduced-motion: reduce`, renders the final value immediately with no animation.
- Cancels its animation frame on unmount.

- [ ] **Step 4: Build `Icon.tsx`**

A single file exporting `Icon`, backed by a `Record<string, React.ReactNode>` of inline 24×24 SVG paths using `stroke="currentColor"`, `fill="none"`, `strokeWidth={1.75}`. Every icon name listed in the Interfaces block above must exist. Brand marks (`instagram`, `x`, `linkedin`, `apple`, `google-play`) use `fill="currentColor"` glyph paths instead.

The root `<svg>` gets `aria-hidden="true"` and `focusable="false"` — these are decorative; callers supply accessible names on the surrounding control.

An unknown `name` returns `null` rather than throwing, so one typo can't blank out a whole section.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
git add components/ui
git commit -m "feat(ui): add button, card, chip, heading, reveal, counter and icon primitives"
```

---

## Parallel Section Tasks (6–13)

Each of these consumes Tasks 1–5 and touches only its own files. **Common requirements for every section component:**

- Renders a single top-level `<section id="...">` with the id given in the task.
- Vertical rhythm: `py-20 md:py-28`. Content sits in a shared container: `mx-auto w-full max-w-7xl px-5 sm:px-8`.
- Every string comes from `content/site.ts`. No hard-coded user-facing copy.
- Server Component unless the task explicitly says `"use client"`.
- Wrap entering content in `<Reveal>`; use `delay` to stagger grids.
- Verified in both themes and at 375 / 768 / 1280px before commit.

---

### Task 6: Navbar and mobile menu

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/MobileMenu.tsx`
- Create: `components/layout/ThemeToggle.tsx`

**Interfaces:**
- Consumes: `NAV_LINKS`, `BRAND`, `HERO.primaryCta` from `@/content/site`; `Button`, `Icon` from `@/components/ui/*`; `cn`.
- Produces: `<Navbar />`, used by Task 14.

**Requirements:**

`ThemeToggle` — `"use client"`.
- Reads the current theme from `document.documentElement.getAttribute("data-theme")` in a **lazy `useState` initializer**, so React's initial state matches the DOM that `ThemeScript` already set. Reading it in an effect instead causes a visible flicker.
- Guard against SSR: the initializer must return `"light"` when `typeof document === "undefined"`.
- On toggle: set the attribute on `<html>` and write to `localStorage` under the key **`vinride-theme`** — this key must match `ThemeScript` exactly or the choice won't survive a reload.
- Wrap the `localStorage` write in try/catch.
- Renders as a `<button>` with `aria-label` reflecting the action ("Switch to dark theme" / "Switch to light theme"), showing the `sun` or `moon` icon.

`Navbar` — Server Component wrapper.
- `<header>` fixed to the top, full width, `z-50`, with `backdrop-blur` and a translucent `bg-bg/80` plus a `border-b border-line`.
- Left: logo via `next/image` from `BRAND.logoSrc`, 32×32, `alt="Vinride"`, wrapped in a link to `#top`.
- Centre (`hidden md:flex`): `NAV_LINKS` as anchor links, `text-fg-muted hover:text-fg`.
- Right: `ThemeToggle`, then a `Button variant="primary" size="md"` for `HERO.primaryCta`. On mobile the CTA is hidden and the menu trigger shows instead.
- Because the header is fixed, `app/page.tsx` content needs top padding — Task 14 handles this.

`MobileMenu` — `"use client"`.
- Trigger button (`md:hidden`) with `aria-expanded`, `aria-controls`, and `aria-label="Open menu"`, using the `menu` icon.
- Opens a full-height slide-over panel with `role="dialog"` and `aria-modal="true"`.
- **Focus is moved into the panel on open and restored to the trigger on close.**
- **Escape closes it.** Tab is trapped within the panel while open.
- Body scroll is locked while open and restored on close — including if the component unmounts while open.
- Selecting any link closes the menu.

**Verification before commit:**
- Toggle the theme, hard-reload — the choice persists with no flash.
- Open the mobile menu at 375px using only the keyboard; confirm Tab cycles inside it, Escape closes it, and focus returns to the trigger.
- Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/layout
git commit -m "feat(nav): add navbar, mobile menu and theme toggle"
```

---

### Task 7: Hero and fare estimator

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `components/sections/FareEstimator.tsx`

**Interfaces:**
- Consumes: `HERO`, `ESTIMATOR`, `LOCALITIES`, `VEHICLE_TYPES`, `BRAND`, `DISCLAIMER` from `@/content/site`; `estimateFare`, `InvalidRouteError`, `UnknownVehicleError`, `type FareEstimate` from `@/lib/fare`; `Button`, `Chip`, `Icon`, `Reveal`.
- Produces: `<Hero />` (contains `<FareEstimator />` internally), used by Task 14. Section id: **`top`**.

**Requirements:**

`Hero` — Server Component.
- Full-width, generous top padding to clear the fixed navbar (`pt-32 md:pt-40`).
- Background: a soft radial yellow→amber glow behind the headline, plus a subtle green accent, built with CSS gradients — no image files. Must be visibly different but equally intentional in dark mode (dim the glow; do not just invert).
- `HERO.eyebrow` as a small pill, then `HERO.heading` as the page's only `<h1>` at `text-4xl sm:text-5xl lg:text-6xl font-display`, then `HERO.subheading` at `max-w-xl text-fg-muted`.
- Two CTAs: `primaryCta` as `Button variant="primary" size="lg"`, `secondaryCta` as `variant="secondary"`.
- The estimator card floats over the composition, as in the reference: `rounded-2xl bg-surface border border-line shadow-xl` with negative bottom offset on `lg`.
- Hero vehicle visual: an inline SVG silhouette of a car built from the brand gradient — **not** a stock photo, since none exists. If a raster hero image is added later it must use `loading="eager" fetchPriority="high"`, never the deprecated `priority` prop.

`FareEstimator` — `"use client"`.
- State: `pickup`, `drop`, `vehicleId` (defaults to `"sedan"`), `result: FareEstimate | null`, `error: string | null`.
- Layout: on `lg`, a single row — pickup input, drop input, submit button. Stacks vertically below `md`.
- Both inputs are `<input list="vinride-localities">` backed by one `<datalist>` populated from `LOCALITIES`. Each has a visible `<label>` (not placeholder-only labelling).
- Vehicle selection is a row of `<Chip>` components from `VEHICLE_TYPES`, in a `role="group"` with `aria-label="Ride type"`.
- Submit is a real `<form onSubmit>` so Enter works, with `noValidate` and our own validation.
- **Validation, exactly:** blank pickup → `ESTIMATOR.errors.pickupRequired`; blank drop → `ESTIMATOR.errors.dropRequired`; identical values → `ESTIMATOR.errors.sameLocation`. The message renders in an element with `role="alert"` and is wired to the offending input via `aria-describedby` + `aria-invalid`. Never a silent no-op.
- Call `estimateFare` inside a try/catch. Catch `InvalidRouteError` and `UnknownVehicleError` and surface a friendly message ("Couldn't estimate that route.") — **never let `NaN` or a raw error reach the DOM.**
- Result panel shows `ESTIMATOR.resultPrefix`, the range as `₹low – ₹high`, the distance and ETA, then `ESTIMATOR.demoNote` and `DISCLAIMER` in small muted text. It must be unambiguous that nothing was booked.
- Changing the vehicle type while a result is showing recomputes it immediately.

**Verification before commit:**
- Submit empty → correct inline error, focus is not lost.
- Same value in both fields → `sameLocation` error.
- Valid route → a stable range; re-submitting the identical route gives the identical number.
- Switching Bike → SUV raises the estimate.
- Whole flow operable by keyboard only.
- Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/Hero.tsx components/sections/FareEstimator.tsx
git commit -m "feat(hero): add hero section with interactive fare estimator"
```

---

### Task 8: Stats strip

**Files:**
- Create: `components/sections/StatsStrip.tsx`

**Interfaces:**
- Consumes: `STATS` from `@/content/site`; `Counter`, `Reveal`. Section id: **`stats`**.
- Produces: `<StatsStrip />`.

**Requirements:**
- A band with `bg-surface-2` and hairline `border-y border-line`, deliberately shorter than other sections (`py-12 md:py-16`) so it reads as a divider between hero and content.
- Four items: `grid-cols-2 gap-8 md:grid-cols-4`.
- Each shows `<Counter value suffix />` in `font-display text-4xl md:text-5xl`, with the label beneath in `text-sm text-fg-muted`.
- The `4.8★` rating must render as `4.8`, not `5` — verify the decimal path explicitly.
- Numbers animate once on first scroll into view; static under reduced motion.

**Verification:** both themes; reduced-motion shows final values instantly; no layout shift as digits change width (reserve space with `tabular-nums`). Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/StatsStrip.tsx
git commit -m "feat(stats): add animated stats strip"
```

---

### Task 9: Ride categories

**Files:**
- Create: `components/sections/RideCategories.tsx`

**Interfaces:**
- Consumes: `RIDES_SECTION`, `VEHICLE_TYPES`, `DISCLAIMER` from `@/content/site`; `Card`, `Chip`, `Icon`, `SectionHeading`, `Reveal`. Section id: **`ride`**.
- Produces: `<RideCategories />`.

**Requirements:**
- `"use client"` (holds filter state).
- Heading block: `SectionHeading` fed from `RIDES_SECTION` (already defined in Task 3 — do not hard-code these strings).
- Filter row: a `RIDES_SECTION.allLabel` chip plus one `<Chip>` per vehicle type, in a `role="group"` with `aria-label={RIDES_SECTION.filterGroupLabel}`. Horizontally scrollable on mobile without clipping focus rings.
- Grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`, filtered by the active chip. "All" shows every type.
- Each card shows: an SVG silhouette for the vehicle, `label` as an `<h3>`, `tagline`, then a meta row built with `RIDES_SECTION.seatsLabel(seats)`, `RIDES_SECTION.etaLabel(etaMinutes)` and `` `${RIDES_SECTION.fromLabel} ${fromFare}` ``. The fare is emphasised but rendered in `text-fg`, never yellow text.
- Cards lift on hover (`-translate-y-1` + shadow), instant under reduced motion.
- `DISCLAIMER` renders once below the grid in small muted text.
- Filtering must not cause a layout jump that scrolls the section out of view.

**Verification:** every chip filters correctly; "All" restores; keyboard-operable; both themes; no horizontal page scroll at 375px. Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/RideCategories.tsx
git commit -m "feat(rides): add filterable ride categories grid"
```

---

### Task 10: Why Vinride and How it works

**Files:**
- Create: `components/sections/WhyVinride.tsx`
- Create: `components/sections/HowItWorks.tsx`

**Interfaces:**
- Consumes: `WHY_VINRIDE`, `HOW_IT_WORKS` from `@/content/site`; `Card`, `Icon`, `SectionHeading`, `Reveal`. Section ids: **`why`** and **`how`**.
- Produces: `<WhyVinride />`, `<HowItWorks />`.

**Requirements:**

`WhyVinride`
- Centred `SectionHeading` from `WHY_VINRIDE`.
- Three cards, `grid gap-6 md:grid-cols-3`, each a different tint — card 1 `tone="yellow"`, card 2 `tone="surface"`, card 3 `tone="green"` — echoing the reference's pastel trio while staying on-brand.
- Each card: icon in a rounded badge (from `feature.icon` via `<Icon>`), `title` as `<h3>`, `body` as muted text.
- Staggered reveal: delays 0 / 80 / 160ms.
- **Contrast check:** body text on the yellow-tinted card must still hit 4.5:1. Use a low-opacity wash (~8% light, ~14% dark), not a solid yellow fill.

`HowItWorks`
- Three numbered steps, `md:grid-cols-3`, connected by a horizontal line on `md+` and a vertical line on mobile — drawn with a bordered pseudo-element or absolutely-positioned div, `aria-hidden`.
- Each step shows a large numeral (01/02/03) in `font-display` at low opacity behind or beside the content.
- Ordered content must be a real `<ol>`, so the sequence is conveyed to screen readers rather than only visually.

**Verification:** both themes; connector line doesn't overflow at any width; reduced motion. Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/WhyVinride.tsx components/sections/HowItWorks.tsx
git commit -m "feat(sections): add why-vinride and how-it-works"
```

---

### Task 11: Fare transparency table

**Files:**
- Create: `components/sections/FareTable.tsx`

**Interfaces:**
- Consumes: `FARES_SECTION`, `FARE_RATES`, `VEHICLE_TYPES`, `BRAND`, `DISCLAIMER` from `@/content/site`; `SectionHeading`, `Icon`, `Reveal`, `Card`. Section id: **`fares`**.
- Produces: `<FareTable />`.

**Requirements:**
- Server Component.
- A real semantic `<table>` with `<caption class="sr-only">`, `<thead>`, and `<th scope="col">` / `<th scope="row">`. Not a div grid — this is tabular data and screen readers should get the row/column relationships.
- Columns from `FARES_SECTION.columns`; one row per `FARE_RATES` entry, with the human label resolved by matching `vehicleId` against `VEHICLE_TYPES`.
- Amounts prefixed with `BRAND.currencySymbol`. Numeric cells use `tabular-nums` and right-align on `sm+`.
- **Mobile (<640px): the table must not force horizontal page scroll.** Either wrap it in an `overflow-x-auto` container that scrolls independently (with the section itself never overflowing), or render stacked per-vehicle cards below `sm`. Either is acceptable; page-level horizontal scroll is not.
- Zebra striping via `bg-surface-2` on alternating rows, subtle in both themes.
- `FARES_SECTION.noSurgeNote` appears beside a `check` icon; `DISCLAIMER` renders directly beneath the table.

**Verification:** no page-level horizontal scroll at 320px and 375px; header/row relationships intact; both themes. Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/FareTable.tsx
git commit -m "feat(fares): add fare transparency table"
```

---

### Task 12: Drive with Vinride and Safety

**Files:**
- Create: `components/sections/DriveWithUs.tsx`
- Create: `components/sections/Safety.tsx`

**Interfaces:**
- Consumes: `DRIVE`, `SAFETY` from `@/content/site`; `Button`, `Card`, `Icon`, `SectionHeading`, `Reveal`. Section ids: **`drive`** and **`safety`**.
- Produces: `<DriveWithUs />`, `<Safety />`.

**Requirements:**

`DriveWithUs`
- This is the audience switch from rider to captain, so it must read as a distinct zone: `bg-brand-forest` with light text, green-accented — the one section that is dark in **both** themes.
- Split layout: `grid lg:grid-cols-2 gap-12 items-center`.
- Left: `SectionHeading` (light-text variant), the benefits list with `check` icons, and the CTA `Button`.
- Right: an earnings card showing `DRIVE.earningsValue` large in `font-display` with `DRIVE.earningsLabel` beneath, on a `bg-surface`-on-forest card so it pops.
- The earnings figure is a placeholder and must sit next to a small qualifier that it's indicative — do not present invented income as a guarantee.
- **Contrast:** on `#123D2F`, use `#F2F1EC` for body text and `#14D3A9` for accents. Do not use `--color-link`'s light-theme value here.

`Safety`
- Centred `SectionHeading` from `SAFETY`.
- Four feature cards, `grid gap-6 sm:grid-cols-2 lg:grid-cols-4`, each with its `<Icon>`, `title` as `<h3>`, and `body`.
- Icons sit in green-tinted circular badges, tying safety to the brand's green half.
- Staggered reveal at 0 / 80 / 160 / 240ms.

**Verification:** forest section legible in both themes (it does not change with theme — confirm it doesn't clash against the dark page background); contrast checked on the forest fill; reduced motion. Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/DriveWithUs.tsx components/sections/Safety.tsx
git commit -m "feat(sections): add captain recruitment and safety sections"
```

---

### Task 13: App download banner and footer

**Files:**
- Create: `components/sections/AppDownload.tsx`
- Create: `components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `APP_DOWNLOAD`, `FOOTER`, `FOOTER_COLUMNS`, `CITIES`, `BRAND` from `@/content/site`; `Icon`, `Reveal`, `Card`. Section ids: **`download`** and **`cities`** (the cities block lives in the footer).
- Produces: `<AppDownload />`, `<Footer />`.

**Requirements:**

`AppDownload`
- Full-bleed banner: `bg-gradient-to-br from-brand-yellow to-brand-amber`, `rounded-3xl` inside the container, generous padding.
- **All text on this banner is `text-ink` (near-black).** This is the highest-risk contrast spot on the page — white text here fails AA. No exceptions.
- Left: `APP_DOWNLOAD.heading` as `<h2>`, subheading, then the store badges.
- **Store badges are not links.** Each renders as a non-interactive badge with the platform icon, the platform name, and a visible "Coming soon" label, with `aria-disabled="true"`. Rendering a dead `<a href="#">` styled as an App Store button would be misleading.
- Right: a CSS/SVG phone mockup showing an abstract booking screen — no screenshot, since the app doesn't exist.

`Footer`
- `<footer>` with `border-t border-line`, `bg-surface-2`.
- Top row: brand column (logo, `FOOTER.blurb`, social icon links with accessible names from `FOOTER.socials`) plus the four `FOOTER_COLUMNS`, as `grid gap-10 sm:grid-cols-2 lg:grid-cols-5`.
- Cities block with `id="cities"`: `FOOTER.citiesHeading` then `CITIES` as a wrapped list of muted text.
- Bottom bar: `FOOTER.copyright`, separated by a hairline border.
- Link columns use `<nav>` with `aria-label` matching each column heading, and real `<ul>`/`<li>` lists.
- Social links get `aria-label` (the icon alone is `aria-hidden`).

**Verification:** contrast on the yellow banner measured, both themes; badges are clearly non-interactive and not focusable as links; footer reflows cleanly at 375px. Run `npx tsc --noEmit && npm run lint`.

```bash
git add components/sections/AppDownload.tsx components/layout/Footer.tsx
git commit -m "feat(sections): add app download banner and site footer"
```

---

### Task 14: Compose the page and full QA pass

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: every component from Tasks 6–13.
- Produces: the finished page.

- [ ] **Step 1: Compose `app/page.tsx`**

```tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { RideCategories } from "@/components/sections/RideCategories";
import { WhyVinride } from "@/components/sections/WhyVinride";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FareTable } from "@/components/sections/FareTable";
import { DriveWithUs } from "@/components/sections/DriveWithUs";
import { Safety } from "@/components/sections/Safety";
import { AppDownload } from "@/components/sections/AppDownload";

export default function HomePage() {
  return (
    <>
      <a
        href="#ride"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand-yellow focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsStrip />
        <RideCategories />
        <WhyVinride />
        <HowItWorks />
        <FareTable />
        <DriveWithUs />
        <Safety />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run the full automated check**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```
Expected: tests pass, no type errors, no lint warnings, build succeeds and reports `/` as `○ (Static)`.

- [ ] **Step 3: Manual QA — work the checklist and record actual results**

Do not mark this step complete on assumption. Run each check and note what happened.

- [ ] Every section renders correctly in light theme.
- [ ] Every section renders correctly in dark theme.
- [ ] Set dark, hard-reload: no flash of light theme on any frame.
- [ ] Theme choice survives a full browser restart.
- [ ] Contrast measured with DevTools on: yellow primary buttons, the yellow download banner, green text links, `text-fg-muted` body text, and the forest Drive section — both themes, all ≥ 4.5:1.
- [ ] Full keyboard traversal front to back: skip link, nav, theme toggle, mobile menu (trap + Escape + focus restore), estimator, chips, all CTAs. Focus ring visible on every stop.
- [ ] With `prefers-reduced-motion: reduce` enabled in DevTools rendering settings: no reveals, no counter animation, no hover transforms, anchor jumps are instant.
- [ ] Layout at 320, 375, 768, 1280 and 1920px. **No horizontal page scroll at any width.**
- [ ] Every nav anchor scrolls to its section with the sticky header cleared (verifies `scroll-padding-top` and `data-scroll-behavior`).
- [ ] Estimator: empty submit, same-location submit, and a valid route all behave per Task 7.
- [ ] No console errors or hydration warnings on load or on theme toggle.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(page): compose Vinride landing page from all sections"
```

---

## Definition of Done

- `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean.
- All fourteen tasks committed.
- The Step 3 manual QA checklist completed with observed results, not assumed ones.
- Every placeholder value still lives in `content/site.ts` — grep the section components for `₹` and for hard-coded copy to confirm none leaked out.
