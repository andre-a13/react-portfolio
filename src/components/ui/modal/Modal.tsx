import React from "react";
import { createPortal } from "react-dom";
import "./modal.scss";

export type ModalHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

export type ModalProps = {
  id?: string;
  labelledBy?: string;         // id of the title element
  ariaLabel?: string;          // fallback if labelledBy not provided
  initialOpen?: boolean;
  closeOnBackdrop?: boolean;   // default: true
  closeOnEsc?: boolean;        // default: true
  preventScroll?: boolean;     // default: true
  containerClassName?: string; // extra class for .modal
  backdropClassName?: string;  // extra class for .modal__backdrop
  panelClassName?: string;     // extra class for .modal__panel
  onOpen?: () => void;
  onClose?: () => void;
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
    containerClassName,
    backdropClassName,
    panelClassName,
    onOpen,
    onClose,
    children,
  },
  ref
) {
  const [open, setOpen] = React.useState(initialOpen);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastFocused = React.useRef<Element | null>(null);

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
    // restore focus after close
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

  const modal = (
    <div
      className={`modal ${containerClassName ?? ""}`}
      role="dialog"
      aria-modal="true"
      id={id}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
    >
      <div
        className={`modal__backdrop ${backdropClassName ?? ""}`}
        onClick={closeOnBackdrop ? doClose : undefined}
      />
      <div
        ref={panelRef}
        className={`modal__panel ${panelClassName ?? ""}`}
        role="document"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
});

export default Modal;
