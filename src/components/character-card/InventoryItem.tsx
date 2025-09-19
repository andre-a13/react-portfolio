import React from "react";
import "./inventory-item.scss";

export interface InventoryItemProps {
    name: string;
    onDelete: () => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ name , onDelete }) => {
    
    return (
        <li className="ccard-listItem">
            <span className="ccard-itemLabel">{name}</span>

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
        </li>
    );
};

export default InventoryItem;
