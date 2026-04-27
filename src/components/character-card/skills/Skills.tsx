import React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface ListProps {
    title: string;
    items: string[];
    editable?: boolean;
    movable?: boolean;
    addLabel?: string;
    onAddItem?: (value: string) => void;
    onDeleteItem?: (index: number) => void;
    onMoveItem?: (fromIndex: number, toIndex: number) => void;
}

const List: React.FC<ListProps> = ({
    title,
    items,
    editable = false,
    movable = false,
    addLabel = "Ajouter",
    onAddItem,
    onDeleteItem,
    onMoveItem,
}) => {
    const [draft, setDraft] = React.useState("");
    const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
    const dragIndexRef = React.useRef<number | null>(null);

    const submitAdd: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const value = draft.trim();
        if (!value) return;

        onAddItem?.(value);
        setDraft("");
    };

    const resetDrag = () => {
        dragIndexRef.current = null;
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const startDrag = (event: React.DragEvent, index: number) => {
        if (!movable || !onMoveItem) return;

        dragIndexRef.current = index;
        setDraggingIndex(index);
        event.dataTransfer.effectAllowed = "move";
        try {
            event.dataTransfer.setData("text/plain", String(index));
        } catch {
            // Some browsers may reject dataTransfer writes in restricted contexts.
        }
    };

    const dragOver = (event: React.DragEvent, index: number) => {
        if (!movable || !onMoveItem) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDragOverIndex(index);
    };

    const dropItem = (event: React.DragEvent, index: number) => {
        if (!movable || !onMoveItem) return;

        event.preventDefault();
        const sourceIndex = dragIndexRef.current ?? Number(event.dataTransfer.getData("text/plain"));
        resetDrag();

        if (!Number.isFinite(sourceIndex) || sourceIndex === index) return;
        onMoveItem(sourceIndex, index);
    };

    return (
        <div>
            <div className="ccard-listHeader">
                <h3 className="ccard-listTitle">{title}</h3>
            </div>
            <ul className="ccard-list">
                {items.map((it, idx) => (
                    <li
                        key={`${title}-${idx}`}
                        className={`ccard-listItem ccard-skillItem ${draggingIndex === idx ? "is-dragging" : ""} ${dragOverIndex === idx ? "is-drag-over" : ""}`}
                        draggable={movable && Boolean(onMoveItem)}
                        onDragStart={(event) => startDrag(event, idx)}
                        onDragOver={(event) => dragOver(event, idx)}
                        onDrop={(event) => dropItem(event, idx)}
                        onDragEnd={resetDrag}
                    >
                        {movable && onMoveItem && (
                            <span className="ccard-skillDragHandle" aria-hidden="true">
                                <GripVertical size={15} strokeWidth={2.2} />
                            </span>
                        )}
                        <span className="ccard-skillLabel">{it}</span>
                        {editable && onDeleteItem && (
                            <button
                                className="ccard-skillDelete"
                                type="button"
                                aria-label={`Supprimer ${it}`}
                                title="Supprimer"
                                onClick={() => onDeleteItem(idx)}
                            >
                                <Trash2 size={15} strokeWidth={2.2} aria-hidden="true" />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {editable && onAddItem && (
                <form className="ccard-skillAdd" onSubmit={submitAdd}>
                    <input
                        className="ccard-skillAddInput"
                        type="text"
                        value={draft}
                        maxLength={60}
                        placeholder={addLabel}
                        aria-label={addLabel}
                        onChange={(event) => setDraft(event.target.value)}
                    />
                    <button
                        className="ccard-skillAddButton"
                        type="submit"
                        aria-label={addLabel}
                        disabled={!draft.trim()}
                    >
                        <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                </form>
            )}
        </div>
    );
};

interface SkillsProps {
    primary: string[];
    secondary: string[];
    editable?: boolean;
    movable?: boolean;
    onAddPrimarySkill?: (value: string) => void;
    onDeletePrimarySkill?: (index: number) => void;
    onMovePrimarySkill?: (fromIndex: number, toIndex: number) => void;
    onAddSecondarySkill?: (value: string) => void;
    onDeleteSecondarySkill?: (index: number) => void;
    onMoveSecondarySkill?: (fromIndex: number, toIndex: number) => void;
}

export const Skills: React.FC<SkillsProps> = ({
    primary,
    secondary,
    editable = false,
    movable = false,
    onAddPrimarySkill,
    onDeletePrimarySkill,
    onMovePrimarySkill,
    onAddSecondarySkill,
    onDeleteSecondarySkill,
    onMoveSecondarySkill,
}) => (
    <section className="ccard-lists">
        <List
            title="Competences principales"
            items={primary}
            editable={editable}
            movable={movable}
            addLabel="Ajouter une competence principale"
            onAddItem={onAddPrimarySkill}
            onDeleteItem={onDeletePrimarySkill}
            onMoveItem={onMovePrimarySkill}
        />
        <List
            title="Competences secondaires"
            items={secondary}
            editable={editable}
            movable={movable}
            addLabel="Ajouter une competence secondaire"
            onAddItem={onAddSecondarySkill}
            onDeleteItem={onDeleteSecondarySkill}
            onMoveItem={onMoveSecondarySkill}
        />
    </section>
);
