import React from "react";
import characterService from "../../services/character.service";
import "./notes.scss";
import { Modal, type ModalHandle } from "../ui/modal/Modal";

type NotesProps = {
  slug: string;
  notes: string;
};

export const Notes: React.FC<NotesProps> = ({ slug, notes }) => {
  const modalRef = React.useRef<ModalHandle>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [text, setText] = React.useState(notes ?? "");
  const initialRef = React.useRef(notes ?? "");
  const timer = React.useRef<number | null>(null);

  // keep local state in sync when slug or incoming notes change
  React.useEffect(() => {
    setText(notes ?? "");
    initialRef.current = notes ?? "";
  }, [slug, notes]);

  const save = React.useCallback(
    async (payload: string) => {
      try {
        await characterService.patch(slug, { notes: payload });
        initialRef.current = payload;
      } catch (e) {
        console.error("Failed to save notes:", e);
      }
    },
    [slug]
  );

  // Debounced autosave while modal is open
  React.useEffect(() => {
    if (!isOpen) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (text !== initialRef.current) save(text);
    }, 800) as unknown as number;

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [text, isOpen, save]);

  // Ctrl/Cmd+S => instant save
  const onEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      save(text);
    }
  };

  const modalId = `notes-${slug}`;
  const titleId = `notes-title-${slug}`;

  return (
    <>
      <button
        type="button"
        className="btn notes-open"
        title="Open character notes (Ctrl/Cmd+S to save)"
        aria-haspopup="dialog"
        aria-controls={modalId}
        onClick={() => modalRef.current?.open()}
      >
        📝 Notes
      </button>

      <Modal
        ref={modalRef}
        id={modalId}
        labelledBy={titleId}
        title="Character Notes"
        headerClassName="notes-header"
        titleClassName="notes-title"
        size="lg"
        showCloseButton
        ariaLabel="Character Notes"
        closeOnBackdrop

        onOpen={() => setIsOpen(true)}
        onClose={() => {
          setIsOpen(false);
          if (text !== initialRef.current) save(text);
        }}
        panelClassName="notes-panel"
      >
        <textarea
          className="notes-textarea"
          placeholder="Write anything about this character…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onEditorKeyDown}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default Notes;
