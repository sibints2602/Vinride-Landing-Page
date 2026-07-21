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
    /** Defensive fallback for estimateFare's own thrown errors — should be unreachable once
     *  pickup/drop/sameLocation validation above has already run, but never let a raw
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
