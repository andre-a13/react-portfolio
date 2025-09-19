import React from "react";

export interface HpBadgeProps {
  /** Max HP to display (required) */
  maxHp: number;

  /** Label next to the value (e.g., "PV", "HP"). Default: "PV" */
  label?: string;

  /** Accessible label override (otherwise auto-generated) */
  ariaLabel?: string;

  /** If true, positions absolutely (top-left of the parent). Default: true */
  absolute?: boolean;

  /** Offset from the top when absolute-positioned (px). Default: 12 */
  offsetTop?: number;

  /** Offset from the left when absolute-positioned (px). Default: 12 */
  offsetLeft?: number;

  /** Show small heart icon before the value. Default: true */
  showIcon?: boolean;

  /** Optional className to extend styling */
  className?: string;

  /** Optional inline style override */
  style?: React.CSSProperties;
}

/**
 * Floating Max HP bubble for the Character Card.
 * NOTE: Ensure the parent (card) has `position: relative` for absolute placement.
 */
const HpBadge: React.FC<HpBadgeProps> = ({
  maxHp,
  label = "PV",
  ariaLabel,
  absolute = true,
  offsetTop = 24,
  offsetLeft = 24,
  showIcon = true,
  className,
  style,
}) => {
  // Computed accessibility label
  const a11y = ariaLabel ?? `${label} max : ${maxHp}`;

  // Inline style uses your parchment variables if present
  const containerStyle: React.CSSProperties = {
    position: absolute ? "absolute" : "static",
    top: absolute ? offsetTop : undefined,
    left: absolute ? offsetLeft : undefined,
    zIndex: 5,
    pointerEvents: "auto",
    ...style,
  };

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 700,
    lineHeight: 1,
    // Colors & borders borrow from your parchment theme with sensible fallbacks
    color: "var(--parchment-ink, #2c2417)",
    background:
      "radial-gradient(120% 90% at 10% 5%, rgba(255,255,255,.18), transparent 60%), " +
      "linear-gradient(0deg, rgba(255,255,255,.07), rgba(255,255,255,.07)), " +
      "var(--parchment, #f4e8c1)",
    border: "1px solid var(--parchment-line, #8b5e34)",
    boxShadow:
      "0 1px 0 #b38b59 inset, 0 0 10px rgba(0,0,0,.06) inset, 0 4px 10px var(--shadow, rgba(0,0,0,.25))",
    WebkitUserSelect: "none",
    userSelect: "none",
  };

  const valueStyle: React.CSSProperties = {
    display: "inline-grid",
    gridAutoFlow: "column",
    alignItems: "center",
    gap: 6,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: 0.2,
  };

  const iconWrapStyle: React.CSSProperties = {
    display: "grid",
    placeItems: "center",
    width: 18,
    height: 18,
    borderRadius: 999,
    // Warm heart token background
    background:
      "radial-gradient(120% 90% at 20% 20%, rgba(255,255,255,.4), transparent 60%), " +
      "linear-gradient(180deg, #ff9ba6, #e05260)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.45), 0 0 0 1px rgba(0,0,0,.06)",
  };

  const iconStyle: React.CSSProperties = {
    display: "block",
    width: 12,
    height: 12,
    color: "#7a0e1a",
  };

  const labelStyle: React.CSSProperties = {
    opacity: 0.85,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.3,
    textTransform: "uppercase" as const,
  };

  const numberStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
  };

  return (
    <div
      className={`hp-badge ${className ?? ""}`}
      style={containerStyle}
      aria-label={a11y}
      role="status"
    >
      <div className="hp-badge__pill" style={pillStyle}>
        {showIcon && (
          <span className="hp-badge__icon" style={iconWrapStyle} aria-hidden="true">
            <svg viewBox="0 0 24 24" style={iconStyle}>
              <path
                d="M12 21s-7.5-4.7-9.5-8.3C1 10 2.2 6.9 5 6.2 7 5.6 8.9 6.6 10 8c1.1-1.4 3-2.4 5-1.8 2.8.7 4 3.8 2.5 6.5C19.5 16.3 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}

        <span className="hp-badge__value" style={valueStyle}>
          <span className="hp-badge__label" style={labelStyle}>
            {label}
          </span>
          <span className="hp-badge__number" style={numberStyle}>
            {maxHp}
          </span>
        </span>
      </div>
    </div>
  );
};

export default HpBadge;
