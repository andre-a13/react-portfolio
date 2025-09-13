import React from "react";
// Réutilise les styles existants
import "./skills.scss";
import "./inventory.scss";
import characterService from "../../services/character.service";
import type { IUpdateCharacter } from "../../interface/IAddCharacter";

interface InventoryProps {
  items: string[];
  title?: string;
  slug: string;
  gold?: number;
}

export const Inventory: React.FC<InventoryProps> = ({
  items = [],
  title = "Inventaire",
  slug,
  gold,
}) => {
  // État local unique (pas de mode contrôlé)
  const [localGold, setLocalGold] = React.useState<number>(gold ?? 0);

  // Si la prop gold change (ex: re-hydratation depuis le serveur), on synchronise l'initialisation
  React.useEffect(() => {
    if (typeof gold === "number") setLocalGold(gold);
  }, [gold]);

  // Debounce 500ms (fixe)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = React.useRef<number>(localGold); // évite PATCH si inchangé

  React.useEffect(() => {
    if (!slug) return;

    // déjà envoyé ? inutile de reprogrammer
    if (localGold === lastSentRef.current) return;

    // reset précédent
    if (timerRef.current) clearTimeout(timerRef.current);

    // programme l’envoi dans 500ms
    timerRef.current = setTimeout(async () => {
      try {
        lastSentRef.current = localGold;
        const body: IUpdateCharacter = { gold: localGold }
        await characterService.patch(slug, body);
      } catch (err) {
        // UI optimiste ; log en cas d’erreur
        console.error("Échec de la mise à jour de l'or:", err);
      }
    }, 500);

    // cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localGold, slug]);

  const dec = () => setLocalGold((v) => Math.max(0, v - 1));
  const inc = () => setLocalGold((v) => v + 1);

  return (
    <section className="ccard-lists" aria-label="Inventaire">
      <div className="ccard-invHeader">
        <h3 className="ccard-listTitle">{title}</h3>

        <div className="ccard-coinCounter" role="group" aria-label="Pièces d'or">
          <button
            type="button"
            className="ccard-coinBtn"
            aria-label="Retirer 1 pièce d'or"
            onClick={dec}
            disabled={localGold <= 0}
          >
            −
          </button>

          <div className="ccard-coinDisplay" title="Pièces d'or">
            <svg className="ccard-coinIcon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#F5C518" stroke="#a77b5b" strokeWidth="1" />
              <circle cx="8" cy="8" r="3" fill="rgba(255,255,255,0.35)" />
            </svg>
            <span className="ccard-coinValue">{localGold}</span>
          </div>

          <button
            type="button"
            className="ccard-coinBtn"
            aria-label="Ajouter 1 pièce d'or"
            onClick={inc}
          >
            +
          </button>
        </div>
      </div>

      <ul className="ccard-list">
        {items.length > 0 ? (
          items.map((name, idx) => (
            <li key={`${name}-${idx}`} className="ccard-listItem">
              {name}
            </li>
          ))
        ) : (
          <li className="ccard-listItem" aria-disabled>
            <em style={{ opacity: 0.7 }}>— vide —</em>
          </li>
        )}
      </ul>
    </section>
  );
};

export default Inventory;
