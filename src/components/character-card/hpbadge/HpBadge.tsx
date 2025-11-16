import React from "react";
import "./HpBadge.scss";

export interface HpBadgeProps {
  /** Current HP to display (required) */
  currentHp: number;

  /** Max HP to display (required) */
  maxHp: number;

  /** Label next to the value (e.g., "PV", "HP"). Default: "PV" */
  label?: string;

  /** Accessible label override (otherwise auto-generated) */
  ariaLabel?: string;

  /** If true, positions absolutely (top-left of the parent). Default: true */
  absolute?: boolean;

  /** Offset from the top when absolute-positioned (px). Default: 24 */
  offsetTop?: number;

  /** Offset from the left when absolute-positioned (px). Default: 24 */
  offsetLeft?: number;

  /** Show small heart icon before the value. Default: true */
  showIcon?: boolean;

  /** Optional className to extend styling */
  className?: string;

  /** Optional inline style override */
  style?: React.CSSProperties;

  /** Increase current HP (parent handles clamping) */
  onIncreaseHp?: () => void;

  /** Decrease current HP (parent handles clamping) */
  onDecreaseHp?: () => void;
}

/**
 * Floating HP bubble for the Character Card.
 * Shows current / max HP and an optional small popup with +/- controls.
 * NOTE: Ensure the parent (card) has `position: relative` for absolute placement.
 */
const HpBadge: React.FC<HpBadgeProps> = ({
  currentHp,
  maxHp,
  label = "PV",
  ariaLabel,
  absolute = true,
  offsetTop = 24,
  offsetLeft = 24,
  showIcon = true,
  className,
  style,
  onIncreaseHp,
  onDecreaseHp,
}) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const hasControls = Boolean(onIncreaseHp || onDecreaseHp);

  // Computed accessibility label
  const a11y = ariaLabel ?? `${label} ${currentHp} / ${maxHp}`;

  // Inline style uniquement pour la position dynamique
  const containerStyle: React.CSSProperties = {
    position: absolute ? "absolute" : "static",
    top: absolute ? offsetTop : undefined,
    left: absolute ? offsetLeft : undefined,
    ...style,
  };

  const classes = ["hp-badge", className].filter(Boolean).join(" ");

  const togglePopup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPopupOpen((open) => !open);
  };

  return (
    <div
      className={classes}
      style={containerStyle}
      aria-label={a11y}
      role="status"
    >
      <div className="hp-badge__pill">
        {showIcon && (
          <span className="hp-badge__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="hp-badge__icon-svg">
              <path
                d="M12 21s-7.5-4.7-9.5-8.3C1 10 2.2 6.9 5 6.2 7 5.6 8.9 6.6 10 8c1.1-1.4 3-2.4 5-1.8 2.8.7 4 3.8 2.5 6.5C19.5 16.3 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}

        <span className="hp-badge__value">
          <span className="hp-badge__label">{label}</span>
          <span className="hp-badge__number">
            {currentHp} / {maxHp}
          </span>
        </span>

        {hasControls && (
          <>
            <button
              type="button"
              className="hp-badge__toggle"
              onClick={togglePopup}
              aria-label={isPopupOpen ? "Close HP controls" : "Open HP controls"}
            >
              ±
            </button>

            {isPopupOpen && (
              <div
                className="hp-badge__popup"
                role="group"
                aria-label="HP controls"
              >
                <button
                  type="button"
                  className="hp-badge__popup-btn hp-badge__popup-btn--plus"
                  onClick={onIncreaseHp}
                  disabled={!onIncreaseHp}
                  aria-label="Increase HP"
                >
                  +
                </button>
                <button
                  type="button"
                  className="hp-badge__popup-btn hp-badge__popup-btn--minus"
                  onClick={onDecreaseHp}
                  disabled={!onDecreaseHp}
                  aria-label="Decrease HP"
                >
                  -
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HpBadge;
