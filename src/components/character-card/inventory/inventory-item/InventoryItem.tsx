import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import "./inventory-item.scss";

export interface InventoryItemProps {
  name: string;
  onDelete: () => void;
  onEditContent?: (newName: string) => void;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

const InventoryItem: React.FC<InventoryItemProps> = ({
  name,
  onDelete,
  onEditContent,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(name);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isEditing) setTempName(name);
  }, [isEditing, name]);

  const startEdit = () => {
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTempName(name);
  };

  const commitEdit = () => {
    setIsEditing(false);
    onEditContent?.(tempName.trim() || name);
  };

  return (
    <li
      className={`ccard-listItem ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}`}
      draggable={!!draggable}
      onDragStart={(event) => onDragStart?.(event)}
      onDragOver={(event) => onDragOver?.(event)}
      onDrop={(event) => onDrop?.(event)}
      onDragEnd={() => onDragEnd?.()}
      aria-grabbed={isDragging ? "true" : "false"}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="ccard-itemInput"
          value={tempName}
          onChange={(event) => setTempName(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onBlur={commitEdit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitEdit();
            }

            if (event.key === "Escape") {
              event.preventDefault();
              cancelEdit();
            }
          }}
          autoFocus
        />
      ) : (
        <span className="ccard-itemLabel">{name}</span>
      )}

      <div className="ccard-itemActions">
        <button
          type="button"
          className="ccard-itemEditBtn"
          aria-label={`Modifier ${name}`}
          title="Modifier"
          onClick={startEdit}
        >
          <Pencil size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="ccard-itemDelBtn"
          aria-label={`Supprimer ${name}`}
          title="Supprimer"
          onClick={onDelete}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
};

export default InventoryItem;
