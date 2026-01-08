import React from "react";
import "./inventory-item.scss";

export interface InventoryItemProps {
  name: string;
  onEditContent?: (newName: string) => void;
  onDelete: () => void;

  // Drag & drop related (optional)
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ name, onDelete, onEditContent, draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging, isDragOver }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(name);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // keep tempName in sync if parent updates `name`
  React.useEffect(() => {
    if (!isEditing) setTempName(name);
  }, [name, isEditing]);

  const commitEdit = () => {
    setIsEditing(false);
    onEditContent?.(tempName.trim() || name);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTempName(name);
  };

  return (
    <li
      className={`ccard-listItem ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      draggable={!!draggable}
      onDragStart={(e) => onDragStart?.(e)}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={(e) => onDrop?.(e)}
      onDragEnd={() => onDragEnd?.()}
      aria-grabbed={isDragging ? 'true' : 'false'}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="ccard-itemInput"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitEdit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancelEdit();
            }
          }}
          autoFocus
        />
      ) : (
        <span className="ccard-itemLabel">{name}</span>
      )}

      <div className="ccard-itemActions">
        {/* Edit button (pen icon) */}
        <button
          type="button"
          className="ccard-itemEditBtn"
          aria-label={`Modifier ${name}`}
          title="Modifier"
          onClick={() => {
            setIsEditing(true);
            // focus happens via autoFocus; if already rendered, ensure selection:
            requestAnimationFrame(() => inputRef.current?.select());
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            {/* Simple pencil icon */}
            <path
              d="M3 17.25V21h3.75L17.81 9.94a1.5 1.5 0 0 0 0-2.12l-2.63-2.63a1.5 1.5 0 0 0-2.12 0L3 17.25Z"
              fill="currentColor"
            />
            <path
              d="M18.37 3.29l2.34 2.34a1 1 0 0 1 0 1.41l-1.83 1.83-3.75-3.75 1.83-1.83a1 1 0 0 1 1.41 0Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Delete button (trash) */}
        <button
          type="button"
          className="ccard-itemDelBtn"
          aria-label={`Supprimer ${name}`}
          title="Supprimer"
          onClick={onDelete}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1Zm2 0v1h2V3h-2Zm-5 7h2v8H6v-8Zm5 0h2v8h-2v-8Zm5 0h2v8h-2v-8Z" />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default InventoryItem;
