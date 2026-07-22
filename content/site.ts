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
  /**
   * Full, static sentence announced to assistive tech in place of the
   * animated number + suffix + label, which are visual-only (aria-hidden).
   * Must stand alone as a complete, accurate sentence — e.g. "4 million plus
   * rides completed" rather than a fragment paired with visible text.
   */
  srText: string;
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

/** Shared between Navbar's and MobileMenu's <nav> landmarks — both wrap the
 *  same NAV_LINKS, so both get the same accessible name. */
export const NAV_PRIMARY_LABEL = "Primary" as const;

/** The page's skip-to-content link, in app/page.tsx. */
export const SKIP_LINK_LABEL = "Skip to content" as const;

export const MOBILE_MENU = {
  openMenuLabel: "Open menu",
  dialogLabel: "Menu",
  closeMenuLabel: "Close menu",
} as const;

export const THEME_TOGGLE = {
  switchToLight: "Switch to light theme",
  switchToDark: "Switch to dark theme",
} as const;

export const HERO = {
  eyebrow: "Now rolling in 12 cities",
  heading: "Your city, one tap away.",
  subheading:
    "Bikes, autos, sedans and SUVs — matched in seconds, priced upfront. No surge surprises, no haggling.",
  primaryCta: { label: "Get the app", href: "#download" },
  secondaryCta: { label: "Drive with us", href: "#drive" },
  /** Accessible name for the icon-only scroll cue at the foot of the hero. */
  scrollCueLabel: "Scroll to ride types",
} as const;

export const ESTIMATOR = {
  heading: "Check your fare",
  rideTypeGroupLabel: "Ride type",
  pickupLabel: "Pickup",
  pickupPlaceholder: "Enter a pickup point",
  dropLabel: "Drop",
  dropPlaceholder: "Where to?",
  submitLabel: "Get estimate",
  resultPrefix: "Estimated fare",
  distanceLabel: (km: number) => `${km} km`,
  etaLabel: (minutes: number) => `~${minutes} min`,
  demoNote: "Demo estimate — this does not book a ride.",
  errors: {
    pickupRequired: "Add a pickup point.",
    dropRequired: "Add a drop location.",
    sameLocation: "Pickup and drop can't be the same place.",
    /** Defensive fallback for estimateFare's own thrown errors — should be unreachable now
     *  that both the submit handler AND the vehicle chips run the same pickup/drop/
     *  sameLocation validation before ever calling estimateFare, but never let a raw
     *  Error message reach the DOM. */
    generic: "Couldn't estimate that route. Try a different pickup or drop.",
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

/** Visually hidden heading naming the stats strip section for screen-reader
 *  users, who otherwise land in an unnamed region between the hero and the
 *  ride categories grid. */
export const STATS_SECTION = {
  heading: "Vinride by the numbers",
} as const;

export const STATS: Stat[] = [
  { value: 4, suffix: "M+", label: "Rides completed", srText: "4 million plus rides completed" },
  { value: 12, suffix: "", label: "Cities served", srText: "12 cities served" },
  { value: 60, suffix: "K+", label: "Verified captains", srText: "60 thousand plus verified captains" },
  { value: 4.8, suffix: "★", label: "Average rating", srText: "4.8 out of 5 average rating" },
];

export interface RideOption {
  id: string;
  /** Small accent label on the card, e.g. "Car ride". */
  title: string;
  /** Bold headline line under the label. */
  headline: string;
  /** Quiet caption line, the card's "meta" row. */
  meta: string;
  /** Longer description shown in the right-hand preview. */
  body: string;
  /** Key of the ICONS map in components/ui/Icon.tsx. */
  icon: string;
}

export const RIDE_OPTIONS = {
  eyebrow: "Ride",
  heading: "Three ways to get there.",
  subheading:
    "A quick solo dash, everyday comfort, or a shared seat for less — pick what fits the trip.",
  options: [
    {
      id: "car",
      title: "Car ride",
      headline: "Comfort for the daily commute",
      meta: "Sedans & SUVs",
      body: "Vetted drivers and AC cabs with upfront fares — for the office run, the airport dash or a night out with friends.",
      icon: "car",
    },
    {
      id: "bike",
      title: "Bike ride",
      headline: "Beat the traffic, solo",
      meta: "Fastest & cheapest",
      body: "Zip across town on two wheels. The quickest, most affordable way to cut straight through the jam.",
      icon: "bike",
    },
    {
      id: "share",
      title: "Ride sharing",
      headline: "Share the trip, split the fare",
      meta: "Best value",
      body: "Get matched with riders already heading your way and pay less for the very same route.",
      icon: "users",
    },
  ] satisfies RideOption[],
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
  /**
   * Must render next to earningsValue. The figure is a placeholder, and
   * presenting invented income without a qualifier would read as a guarantee.
   */
  earningsQualifier:
    "Illustrative figure. Actual earnings vary by city, hours driven and demand.",
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
  /** Display text for each store's lifecycle state, keyed by the `state`
   *  literal used in `stores` below. Every state that appears there must
   *  have a matching key here. */
  stateLabels: {
    "coming-soon": "Coming soon",
  } as Record<string, string>,
  /** Shown in place of a raw state slug if a store's `state` is ever missing
   *  from stateLabels above — an unknown state must fail safe rather than
   *  render an internal identifier as marketing copy. */
  unknownStateFallback: "Status unavailable",
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
  /** Visually hidden. Gives the footer's own <h3> columns (Company, Ride,
   *  Captains, Legal, Cities we serve) a proper <h2> ancestor of their own,
   *  instead of nesting under the last visible <h2> before the footer. */
  heading: "Footer",
  blurb: "Ride-hailing built on upfront fares and captains you can trust.",
  socials: [
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "X", href: "#", icon: "x" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
  ],
  citiesHeading: "Cities we serve",
  /**
   * Evaluated at module scope, so on a statically prerendered page the year is
   * baked in at BUILD time, not request time. A deploy that sits untouched
   * across a new year will show a stale year until the next rebuild. Accepted
   * deliberately: making the footer a Client Component just to compute a year
   * costs more than it saves. Rebuild on deploy, or at minimum each January.
   */
  copyright: `© ${new Date().getFullYear()} Vinride. All rights reserved.`,
} as const;
