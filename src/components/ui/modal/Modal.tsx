import React from "react";
import { createPortal } from "react-dom";
import "./modal.scss";

export type ModalHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

type BackdropVariant = "default" | "transparent" | "none";
type ModalSize = "sm" | "md" | "lg" | "xl";
type ModalAlign = "center" | "top";

export type ModalProps = {
  id?: string;

  /** Accessibility */
  labelledBy?: string;          // id of the title element
  ariaLabel?: string;           // fallback if labelledBy not provided

  /** Open behavior */
  initialOpen?: boolean;
  closeOnBackdrop?: boolean;    // default: true
  closeOnEsc?: boolean;         // default: true
  preventScroll?: boolean;      // default: true

  /** Structure / content */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  showCloseButton?: boolean;    // default: true
  closeButtonLabel?: string;    // default: "Fermer"
  footer?: React.ReactNode;     // optional footer area

  /** Layout & look */
  size?: ModalSize;             // default: "md"
  align?: ModalAlign;           // default: "center"
  backdrop?: BackdropVariant;   // default: "default"

  /** Class overrides */
  containerClassName?: string;
  backdropClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  closeButtonClassName?: string;

  /** Inline style overrides (also see CSS vars in SCSS) */
  containerStyle?: React.CSSProperties;
  backdropStyle?: React.CSSProperties;
  panelStyle?: React.CSSProperties;

  /** Hooks */
  onOpen?: () => void;
  onClose?: () => void;

  /** Props for the body node (e.g., aria attributes) */
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;

  children: React.ReactNode;
};

export const Modal = React.forwardRef<ModalHandle, ModalProps>(function Modal(
  {
    id,
    labelledBy,
    ariaLabel,
    initialOpen = false,
    closeOnBackdrop = true,
    closeOnEsc = true,
    preventScroll = true,

    title,
    subtitle,
    icon,
    showCloseButton = true,
    closeButtonLabel = "Fermer",
    footer,

    size = "md",
    align = "center",
    backdrop = "default",

    containerClassName,
    backdropClassName,
    panelClassName,
    headerClassName,
    titleClassName,
    subtitleClassName,
    bodyClassName,
    footerClassName,
    closeButtonClassName,

    containerStyle,
    backdropStyle,
    panelStyle,

    onOpen,
    onClose,

    bodyProps,
    children,
  },
  ref
) {
  const [open, setOpen] = React.useState(initialOpen);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastFocused = React.useRef<Element | null>(null);

  const reactId = React.useId();
  const titleId =
    labelledBy ??
    (title ? `${id ?? "modal"}-title-${reactId.replace(/:/g, "")}` : undefined);

  const doOpen = React.useCallback(() => {
    if (open) return;
    lastFocused.current = document.activeElement ?? null;
    setOpen(true);
    onOpen?.();
  }, [open, onOpen]);

  const doClose = React.useCallback(() => {
    if (!open) return;
    setOpen(false);
    onClose?.();
    if (lastFocused.current instanceof HTMLElement) {
      lastFocused.current.focus();
    }
  }, [open, onClose]);

  const toggle = React.useCallback(() => (open ? doClose() : doOpen()), [open, doClose, doOpen]);

  React.useImperativeHandle(
    ref,
    () => ({
      open: doOpen,
      close: doClose,
      toggle,
      isOpen: () => open,
    }),
    [doOpen, doClose, toggle, open]
  );

  // ESC to close
  React.useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") doClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, doClose]);

  // Body scroll lock
  React.useEffect(() => {
    if (!open || !preventScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, preventScroll]);

  // Focus panel when opening
  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const showBackdrop = backdrop !== "none";
  const isTransparentBackdrop = backdrop === "transparent";

  const modal = (
    <div
      className={`modal ${containerClassName ?? ""}`}
      style={containerStyle}
      role="dialog"
      aria-modal="true"
      id={id}
      aria-labelledby={titleId}
      aria-label={titleId ? undefined : ariaLabel}
      data-align={align}
      data-open
    >
      {showBackdrop && (
        <div
          className={`modal__backdrop ${isTransparentBackdrop ? "is-transparent" : ""} ${backdropClassName ?? ""}`}
          style={backdropStyle}
          onClick={closeOnBackdrop ? doClose : undefined}
        />
      )}

      <div
        ref={panelRef}
        className={`modal__panel modal__panel--${size} ${panelClassName ?? ""}`}
        role="document"
        tabIndex={-1}
        style={panelStyle}
      >
        {(title || showCloseButton || icon || subtitle) && (
          <div className={`modal__header ${headerClassName ?? ""}`}>
            {icon ? <div className="modal__icon" aria-hidden="true">{icon}</div> : null}

            <div className="modal__titles">
              {title ? (
                typeof title === "string" ? (
                  <h3 id={titleId} className={`modal__title ${titleClassName ?? ""}`}>{title}</h3>
                ) : (
                  <div id={titleId} className={`modal__title ${titleClassName ?? ""}`}>{title}</div>
                )
              ) : null}
              {subtitle ? (
                <p className={`modal__subtitle ${subtitleClassName ?? ""}`}>{subtitle}</p>
              ) : null}
            </div>

            {showCloseButton && (
              <button
                type="button"
                className={`modal__close ${closeButtonClassName ?? ""}`}
                aria-label={closeButtonLabel}
                onClick={doClose}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className={`modal__body ${bodyClassName ?? ""}`} {...bodyProps}>
          {children}
        </div>

        {footer !== undefined && (
          <div className={`modal__footer ${footerClassName ?? ""}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
});

export default Modal;
