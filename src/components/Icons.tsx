import type { SVGProps } from "react";
import type { Metric, ServiceIcon, Social } from "../data/content";

type IconProps = SVGProps<SVGSVGElement>;

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ children, viewBox = "0 0 24 24", ...props }: IconProps) {
  return (
    <svg
      viewBox={viewBox}
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Shared gradient for the duotone icons. Rendered once per page. */
export function IconDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="icon-defs">
      <defs>
        <linearGradient
          id="g-icon"
          gradientUnits="userSpaceOnUse"
          x1="4"
          y1="4"
          x2="44"
          y2="44"
        >
          <stop offset="0" style={{ stopColor: "var(--icon-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--icon-b)" }} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const ArrowIcon = (props: IconProps) => (
  <Svg {...props}>
    <path {...line} d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);
export const ChevronIcon = ({
  direction,
  ...props
}: IconProps & { direction: "left" | "right" | "down" }) => (
  <Svg {...props}>
    <path
      {...line}
      d={
        direction === "left"
          ? "M15 5l-7 7 7 7"
          : direction === "right"
            ? "M9 5l7 7-7 7"
            : "M6 9l6 6 6-6"
      }
    />
  </Svg>
);
export const MenuIcon = (props: IconProps) => (
  <Svg {...props}>
    <path {...line} d="M4 7h16M4 12h16M10 17h10" />
  </Svg>
);
export const CloseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path {...line} d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const PauseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path {...line} d="M9 6v12M15 6v12" />
  </Svg>
);
export const PlayIcon = (props: IconProps) => (
  <Svg {...props}>
    <path {...line} d="M8 5.5v13l10-6.5z" />
  </Svg>
);
export const UserIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle {...line} cx="12" cy="8.5" r="3.6" />
    <path {...line} d="M4.8 19.5c1.2-3.3 3.9-5 7.2-5s6 1.7 7.2 5" />
  </Svg>
);

export function SocialIcon({
  name,
  ...props
}: IconProps & { name: Social["icon"] }) {
  return (
    <Svg {...props}>
      {name === "instagram" && (
        <>
          <rect {...line} x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle {...line} cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </>
      )}
      {name === "telegram" && (
        <path {...line} d="M20.5 4 3.4 10.9l6 2.2 2.3 6.4L20.5 4zM9.4 13.1 14 9.6" />
      )}
      {name === "linkedin" && (
        <>
          <rect {...line} x="3.5" y="3.5" width="17" height="17" rx="3.5" />
          <path {...line} d="M8 10.6V16.5M11.8 16.5v-5.9M11.8 13.1c0-1.6 1-2.6 2.4-2.6s2.1.9 2.1 2.5v3.5" />
          <circle cx="8" cy="7.7" r="1" fill="currentColor" />
        </>
      )}
      {name === "youtube" && (
        <>
          <rect {...line} x="2.8" y="5.8" width="18.4" height="12.4" rx="4" />
          <path d="M10.3 9.4v5.2l4.4-2.6z" fill="currentColor" />
        </>
      )}
    </Svg>
  );
}

const grad = "url(#g-icon)";

/** Small planet with an orbit: the site's recurring motif (hero rings, closing orb). */
export const OrbitGlyph = (props: IconProps) => (
  <Svg viewBox="0 0 32 32" {...props}>
    <circle cx="16" cy="16" r="6.5" fill="currentColor" />
    <ellipse cx="16" cy="16" rx="14" ry="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-18 16 16)" />
  </Svg>
);

/**
 * Duotone service icons. Each has a small hover motion tied to what the service does (see global.css).
 * The gradient lives inside each icon so it inherits the card's own hue variables.
 */
export function ServiceGlyph({ name }: { name: ServiceIcon }) {
  const grad = `url(#g-icon-${name})`;
  return (
    <Svg viewBox="0 0 48 48" className={`glyph glyph-${name}`}>
      <defs>
        <linearGradient id={`g-icon-${name}`} gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="44" y2="44">
          <stop offset="0" style={{ stopColor: "var(--icon-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--icon-b)" }} />
        </linearGradient>
      </defs>
      {name === "sound" && (
        <>
          <path
            d="M9 27v-3a15 15 0 0 1 30 0v3"
            fill="none"
            stroke={grad}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <rect x="5.5" y="25" width="9.5" height="15" rx="3.6" fill={grad} />
          <rect x="33" y="25" width="9.5" height="15" rx="3.6" fill={grad} />
          <g className="g-eq" fill={grad}>
            <rect x="19" y="27" width="2.6" height="10" rx="1.3" />
            <rect x="22.7" y="22" width="2.6" height="15" rx="1.3" />
            <rect x="26.4" y="29" width="2.6" height="8" rx="1.3" />
          </g>
        </>
      )}
      {name === "marketing" && (
        <>
          <g className="g-bars" fill={grad}>
            <rect x="7" y="30" width="7.5" height="11" rx="2" opacity="0.45" />
            <rect x="19" y="25" width="7.5" height="16" rx="2" opacity="0.7" />
            <rect x="31" y="19" width="7.5" height="22" rx="2" />
          </g>
          <path
            className="g-trend"
            d="M6 21l10-8 7 4.5L37 7M30.5 7H37v6.5"
            fill="none"
            stroke={grad}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {name === "web" && (
        <>
          <circle cx="24" cy="24" r="16.5" fill={grad} opacity="0.16" />
          <circle cx="24" cy="24" r="16.5" fill="none" stroke={grad} strokeWidth="3" />
          <ellipse
            className="g-meridian"
            cx="24"
            cy="24"
            rx="7"
            ry="16.5"
            fill="none"
            stroke={grad}
            strokeWidth="2.4"
          />
          <path d="M8.5 18.5h31M8.5 29.5h31" stroke={grad} strokeWidth="2.4" />
        </>
      )}
      {name === "photo" && (
        <>
          <path d="M15.5 13.5 18.3 9h11.4l2.8 4.5z" fill={grad} />
          <rect x="5" y="13" width="38" height="27" rx="6.5" fill={grad} />
          <circle cx="24" cy="26.5" r="9.2" className="g-cut" />
          <circle className="g-lens" cx="24" cy="26.5" r="5.6" fill={grad} />
          <rect x="34" y="17" width="4.5" height="3" rx="1.5" className="g-cut" />
        </>
      )}
      {name === "vfx" && (
        <g className="g-cube">
          <path d="M24 6.5 40 15.5 24 24.5 8 15.5z" fill={grad} opacity="0.4" />
          <path d="M8 15.5v17.5l16 9V24.5z" fill={grad} opacity="0.7" />
          <path d="M40 15.5v17.5l-16 9V24.5z" fill={grad} />
          <path
            d="M24 6.5 40 15.5v17.5l-16 9-16-9V15.5zM24 24.5v17.5M8 15.5l16 9 16-9"
            fill="none"
            stroke={grad}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}
      {name === "print" && (
        <>
          <rect x="13" y="6" width="22" height="11" rx="2" fill={grad} opacity="0.45" />
          <rect x="5" y="15" width="38" height="18" rx="5" fill={grad} />
          <circle cx="36.5" cy="21" r="1.9" className="g-cut" />
          <g className="g-paper">
            <rect
              x="13"
              y="27"
              width="22"
              height="15"
              rx="2"
              className="g-cut"
              stroke={grad}
              strokeWidth="2.4"
            />
            <path d="M17.5 33h13M17.5 37.5h8" stroke={grad} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </>
      )}
    </Svg>
  );
}

export function MetricGlyph({ name }: { name: Metric["icon"] }) {
  return (
    <Svg viewBox="0 0 48 48" className="glyph">
      {name === "star" && (
        <path
          d="M24 5.5l5.6 11.6 12.7 1.7-9.3 8.8 2.3 12.6L24 34.1 12.7 40.2 15 27.6l-9.3-8.8 12.7-1.7z"
          fill={grad}
        />
      )}
      {name === "folder" && (
        <>
          <path d="M5 13.5a4 4 0 0 1 4-4h9.5l4 4.5H39a4 4 0 0 1 4 4v1H5z" fill={grad} opacity="0.5" />
          <rect x="5" y="17" width="38" height="23" rx="4" fill={grad} />
        </>
      )}
      {name === "people" && (
        <>
          <circle cx="13" cy="17" r="5" fill={grad} opacity="0.55" />
          <circle cx="35" cy="17" r="5" fill={grad} opacity="0.55" />
          <path d="M3.5 36c.8-5.4 4.4-8.5 9.5-8.5 2.2 0 4 .5 5.5 1.6M44.5 36c-.8-5.4-4.4-8.5-9.5-8.5-2.2 0-4 .5-5.5 1.6" fill={grad} opacity="0.55" />
          <circle cx="24" cy="16" r="7" fill={grad} />
          <path d="M11.5 40c1-7.4 5.9-11.5 12.5-11.5S35.5 32.6 36.5 40z" fill={grad} />
        </>
      )}
    </Svg>
  );
}
