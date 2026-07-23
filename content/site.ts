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
  /** Standalone sentence for assistive tech; the animated number/suffix/label are aria-hidden. */
  srText: string;
}

export interface Feature {
  title: string;
  body: string;
  /** Icon key resolved by the rendering section (ICONS map, or WhyVinride's FEATURE_ICONS). */
  icon: string;
}

export interface Step {
  title: string;
  body: string;
  /** Small uppercase caption under the body — one concrete product fact. */
  meta: string;
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
  { label: "Stories", href: "#stories" },
  { label: "Drive", href: "#drive" },
  { label: "Safety", href: "#safety" },
];

/** Shared accessible name for Navbar's and MobileMenu's <nav> landmarks (same NAV_LINKS). */
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
    /** Defensive fallback for estimateFare's thrown errors — never let a raw Error reach the DOM. */
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

/** Visually hidden heading naming the stats strip region for screen-reader users. */
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
  // 4×2 grid — order matters: top row's hover wash rises from below, bottom row's falls from above.
  features: [
    { title: "Upfront fares", body: "See the exact price before you confirm. What you're quoted is what you pay.", icon: "receipt" },
    { title: "Verified captains", body: "Every captain is ID-checked, background-screened and rated after each trip.", icon: "shield-check" },
    { title: "Pickup in minutes", body: "Captains stay close by around the clock — most rides arrive in under five.", icon: "bolt" },
    { title: "Pay your way", body: "UPI, cards, wallets or cash. Settle the fare however suits the moment.", icon: "wallet" },
    { title: "Schedule ahead", body: "Book up to three days out and step out to a captain already waiting.", icon: "calendar" },
    { title: "Lost & found, sorted", body: "Left something behind? One tap connects you to your captain's last trip.", icon: "search" },
    { title: "24/7 support", body: "Real humans on call, any hour, in your language.", icon: "headset" },
    { title: "Rewards every ride", body: "Earn coins on each trip and burn them on your next fare.", icon: "gift" },
  ] satisfies Feature[],
} as const;

export const HOW_IT_WORKS = {
  eyebrow: "How it works",
  heading: "Three taps and you're moving.",
  steps: [
    { title: "Set your destination", body: "Enter where you're headed and pick the ride that fits.", meta: "Bike · car · sharing" },
    { title: "Get matched", body: "We find the nearest captain and show you the fare before you confirm.", meta: "Average wait under 5 min" },
    { title: "Ride and pay", body: "Track the trip live, then pay by card, wallet or cash.", meta: "UPI · card · cash" },
  ] satisfies Step[],
} as const;

export interface Story {
  /** Uppercase place tag on the card, e.g. "KOCHI". */
  city: string;
  name: string;
  /** Portrait in /public/avatars — placeholder photos until real ones exist. */
  avatar: string;
  /** Role or relationship line under the name, e.g. "Daily commuter". */
  role: string;
  quote: string;
}

export const CUSTOMER_STORIES = {
  heading: "Built alongside our riders",
  subheading: "Every trip shapes what we build next.",
  /** Rendered as a five-star row; supports halves (e.g. 4.5). */
  rating: 4.5,
  ratingSrText: "Rated 4.5 out of 5 by riders",
  linkLabel: "View all customer stories",
  linkHref: "#stories",
  stories: [
    {
      city: "USA",
      name: "James Micheal",
      avatar: "/avatars/priya-nair.jpg",
      role: "Product designer",
      quote:
        "Fares used to be a gamble at peak hours. With Vinride the price I see is the price I pay — my commute budget finally makes sense.",
    },
    {
      city: "Singapore",
      name: "David Alexander",
      avatar: "/avatars/arjun-shetty.jpg",
      role: "Marketing lead",
      quote:
        "I schedule a bike every morning at 8:40 and it has never missed. The captain is downstairs before my coffee is done.",
    },
    {
      city: "London",
      name: "Linda Elizabeth Richard",
      avatar: "/avatars/sneha-iyer.jpg",
      role: "Analyst",
      quote:
        "My parents follow my late-night rides home on the live link. Nobody stays up worrying anymore.",
    },
    {
      city: "Scotland",
      name: "Christopher Joseph",
      avatar: "/avatars/rahul-verma.jpg",
      role: "Architect",
      quote:
        "Ride sharing costs less than my fuel bill did, and I get an hour of reading back every single day.",
    },
  ] satisfies Story[],
} as const;

/** Deliberately money-free: invented earnings/commission figures read as guarantees. */
export const DRIVE = {
  eyebrow: "Drive with Vinride",
  heading: "Your hours. Your city. Your call.",
  subheading:
    "Join as a captain and drive when it suits you — no targets, no pressure.",
  hero: {
    title: "You decide when you're on the road.",
    body: "Go online when it suits you, off when it doesn't. The city is always moving — catch it on your schedule.",
    /** Rendered as toggle-style chips inside the hero cell. */
    slots: ["Mornings", "Evenings", "Weekends"],
  },
  /** Icon keys resolve against TILE_ICONS in DriveWithUs, not the shared ICONS map. */
  tiles: [
    {
      icon: "badge-check",
      title: "Insurance on every trip",
      body: "Free cover for you and your vehicle from the moment a ride starts.",
    },
    {
      icon: "phone-call",
      title: "24/7 captain support",
      body: "Real people on the line, day and night.",
    },
  ] satisfies Feature[],
  steps: {
    title: "How to join",
    items: ["Sign up in the app", "Verify your documents", "Start driving"],
  },
  perks: {
    title: "Fuel & service partner discounts",
    body: "Save at partner pumps and garages across town.",
  },
  cta: { label: "Become a captain", href: "#download" },
} as const;

/** Combined Drive/Safety tabbed section — tab ids double as navbar anchors (#drive, #safety). */
export const DRIVE_SAFETY_TABS = {
  ariaLabel: "Drive and safety",
  tabs: [
    { id: "drive", label: "Drive" },
    { id: "safety", label: "Safety" },
  ],
} as const;

export const SAFETY = {
  eyebrow: "Safety",
  heading: "Every ride, watched over.",
  subheading: "Safety isn't a feature we bolt on. It's how the trip is built.",
  /** Icon keys resolve against the animated-icon maps in Safety.tsx, not the shared ICONS map. */
  hero: {
    icon: "bell-ring",
    title: "One-tap SOS",
    body: "Reach emergency services and our safety desk from inside the trip screen.",
    /** Mock of the in-app emergency button — decorative, not a control. */
    pill: "SOS",
    /** Rendered as chips — everyone a single tap can raise. */
    reaches: ["Emergency services", "Safety desk", "Trusted contacts"],
  },
  tiles: [
    { title: "Share your trip", body: "Send a live link so people you trust can follow you the whole way.", icon: "send" },
    { title: "ID-verified captains", body: "Documents and background checks re-verified every year.", icon: "fingerprint" },
  ] satisfies Feature[],
  wide: {
    icon: "circle-check",
    title: "Insurance cover",
    body: "Every trip is covered, for both rider and captain.",
    badges: ["Rider covered", "Captain covered"],
  },
} as const;

export const APP_DOWNLOAD = {
  heading: "Get moving with Vinride.",
  subheading: "The app is on its way. Be first in line when we launch.",
  /** Display text per store lifecycle state — every `state` used in `stores` needs a key here. */
  stateLabels: {
    "coming-soon": "Coming soon",
  } as Record<string, string>,
  /** Fail-safe shown when a store's `state` is missing from stateLabels — never render a raw slug. */
  unknownStateFallback: "Status unavailable",
  /** Both stores are pre-launch. Rendered as disabled "Coming soon" badges — never as links. */
  stores: [
    { platform: "Google Play", state: "coming-soon" as const },
    { platform: "App Store", state: "coming-soon" as const },
  ],
} as const;

export const CITIES: string[] = [
  "USA", "London", "Scotland", "Spain", "Singapore", "Canada", "Australia",
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
  /** Visually hidden <h2> so the footer's <h3> columns don't nest under the last visible <h2>. */
  heading: "Footer",
  socials: [
    { label: "Instagram", href: "#", icon: "instagram" },
    { label: "X", href: "#", icon: "x" },
    { label: "LinkedIn", href: "#", icon: "linkedin" },
  ],
  citiesHeading: "Cities we serve",
  /** Year is baked in at build time (accepted tradeoff) — rebuild each January at minimum. */
  copyright: `© ${new Date().getFullYear()} Vinride. All rights reserved.`,
} as const;
