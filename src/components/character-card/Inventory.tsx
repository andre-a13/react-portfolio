// src/components/CharacterCard/Inventory.tsx
import React from "react";
// Réutilise le style des listes de Skills
import "./skills.scss";

interface InventoryProps {
  /** Liste des noms d'objets (ex: ["Couteau", "Talisman", "Corde"]) */
  items: string[];
  title?: string;
}

export const Inventory: React.FC<InventoryProps> = ({ items = [], title = "Inventaire" }) => {
  return (
    <section className="ccard-lists" aria-label="Inventaire">
      <div>
        <h3 className="ccard-listTitle">{title}</h3>
        <ul className="ccard-list">
          {items.length > 0 ? (
            items.map((name, idx) => (
              <li key={`${name}-${idx}`} className="ccard-listItem">{name}</li>
            ))
          ) : (
            <li className="ccard-listItem" aria-disabled>
              <em style={{ opacity: .7 }}>— vide —</em>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Inventory;
