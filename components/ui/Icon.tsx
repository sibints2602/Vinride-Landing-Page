import type { ReactNode } from "react";

/**
 * Brand marks are drawn as solid glyphs (fill, evenodd cutouts for negative
 * space) instead of the stroke style used everywhere else, matching how real
 * wordmarks/logos are usually authored.
 */
const BRAND_ICONS = new Set([
  "instagram",
  "x",
  "linkedin",
  "google-play",
  "apple",
]);

const ICONS: Record<string, ReactNode> = {
  tag: (
    <>
      <path d="M3 3h8l10 10-8 8L3 11V3Z" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  shield: <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  "arrow-down": (
    <>
      <path d="M12 4.5v15" />
      <path d="m6 13.5 6 6 6-6" />
    </>
  ),
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  car: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  bike: (
    <>
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  headset: (
    <>
      <path d="M4 12a8 8 0 0 1 16 0" />
      <rect x="3" y="12" width="4" height="6" rx="1.5" />
      <rect x="17" y="12" width="4" height="6" rx="1.5" />
    </>
  ),
  siren: (
    <>
      <path d="M12 3v2" />
      <path d="M5 13a7 7 0 0 1 14 0v6H5v-6Z" />
      <path d="M3 21h18" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.3 10.7 15.7 7.3" />
      <path d="M8.3 13.3 15.7 16.7" />
    </>
  ),
  badge: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  umbrella: (
    <>
      <path d="M3 12a9 9 0 0 1 18 0Z" />
      <path d="M12 12v7a2 2 0 0 1-4 0" />
      <path d="M12 3v1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  menu: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  check: <polyline points="4 12 9.5 17.5 20 6" />,
  pin: (
    <>
      <path d="M12 22s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  instagram: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 3h6a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V9a6 6 0 0 1 6-6Z M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z M17 8.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
    />
  ),
  x: <path d="M4 4h6l2 4 2-4h6l-5 8 5 8h-6l-2-4-2 4H4l5-8Z" />,
  linkedin: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z M6.5 9h2.2v9H6.5Z M7.6 5.3a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z M11 9h2.1v1.3c.5-.9 1.5-1.5 2.7-1.5 2.3 0 3.4 1.5 3.4 4V18h-2.2v-4.6c0-1.3-.4-2.1-1.6-2.1-1.1 0-1.8.8-1.8 2.1V18H11Z"
    />
  ),
  "google-play": (
    <path d="M4 3.5v17a1 1 0 0 0 1.5.87L20 12.87a1 1 0 0 0 0-1.74L5.5 2.63A1 1 0 0 0 4 3.5Z" />
  ),
  apple: (
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.817-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701Z" />
  ),
};

export interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const glyph = ICONS[name];
  if (!glyph) return null;

  const isBrand = BRAND_ICONS.has(name);

  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={isBrand ? "currentColor" : "none"}
      stroke={isBrand ? "none" : "currentColor"}
      strokeWidth={isBrand ? undefined : 1.75}
      strokeLinecap={isBrand ? undefined : "round"}
      strokeLinejoin={isBrand ? undefined : "round"}
    >
      {glyph}
    </svg>
  );
}
