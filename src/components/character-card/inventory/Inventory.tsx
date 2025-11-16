import React from "react";
// Réutilise les styles existants
import "../skills/skills.scss";
import "./inventory.scss";
import characterService from "../../../services/character.service";
import type { IUpdateCharacter } from "../../../interface/IAddCharacter";
import InventoryItem from "./inventory-item/InventoryItem";
import Modal, { type ModalHandle } from "../../ui/modal/Modal";
import "./inventory-add-modal.scss";

interface InventoryProps {
  items: string[];
  title?: string;
  slug: string;
  gold?: number;
  refresh: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  items = [],
  title = "Inventaire",
  slug,
  gold,
  refresh
}) => {
  // État local unique (pas de mode contrôlé)
  const [itemsList, setItemsList] = React.useState<string[]>(items);
  const [localGold, setLocalGold] = React.useState<number>(gold ?? 0);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const closeAddModal = () => {
    setIsAddOpen(false)
    modalRef.current?.close();
  };
  const modalRef = React.useRef<ModalHandle>(null);

  // Si la prop gold change (ex: re-hydratation depuis le serveur), on synchronise l'initialisation
  React.useEffect(() => {
    if (typeof gold === "number") setLocalGold(gold);
  }, [gold]);

  // Debounce 500ms (fixe)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = React.useRef<number>(localGold); // évite PATCH si inchangé

  React.useEffect(() => {
    if (items.length)
    {
      setItemsList(items);
    }
  }, [items]);

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

  const handleAddSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newItem = formData.get(`new-item-${slug}`)?.toString().trim();
    if (!newItem) return; // should not happen due to required field

    const updatedItems = [...itemsList, newItem];
    characterService.patch(slug, { inventory: updatedItems })
      .then(() => {
        refresh();
        form.reset();
        closeAddModal();
      })
      .catch((error) => {
        console.error("Failed to add item:", error);
      });

    // closeAddModal();
  };

  const updateItemLabel = async (oldName: string, newName: string) => {
    if (oldName === newName) return; // no change

    const updatedItems = itemsList.map((item) => (item === oldName ? newName : item));
    try {
      await characterService.patch(slug, { inventory: updatedItems });
      refresh();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  const deleteItem = async (name: string) => {
    const updatedItems = items.filter((item) => item !== name);
    try {
      await characterService.patch(slug, { inventory: updatedItems });
      refresh();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }

  }
  return (
    <section className="ccard-lists" aria-label="Inventaire">
      <div>
        <div className="ccard-invHeader">
          <h3 className="ccard-listTitle">{title}</h3>
          <div className="ccard-listActions">

            <div className="ccard-coinCounter" role="group" aria-label="Pièces d'or">
              <button
                type="button"
                className="ccard-coinBtn"
                aria-label="Retirer 1 pièce d'or"
                onClick={dec}
                disabled={localGold <= 0}
              >
                -
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

            <button
              type="button"
              className="ccard-addItemBtn"
              aria-haspopup="dialog"
              onClick={() => modalRef.current?.open()}            >
              + Ajouter un objet
            </button>

          </div>

        </div>

        <ul className="ccard-list">
          {itemsList.length > 0 ? (
            itemsList.map((item, idx) => (
              <InventoryItem
                key={`${item}-${idx}`}
                name={item}
                onEditContent={(newName) => updateItemLabel(item, newName)}
                onDelete={() => deleteItem(item)}
              />
            ))
          ) : (
            <li className="ccard-listItem" aria-disabled>
              <em style={{ opacity: 0.7 }}>— vide —</em>
            </li>
          )}
        </ul>
      </div>

      <Modal
        ref={modalRef}
        onOpen={() => setIsAddOpen(true)}
        onClose={() => setIsAddOpen(false)}
        title="Ajouter un objet"
        subtitle="Inventaire du personnage"
        size="sm"
        align="center"
        panelClassName="notes-panel invAdd-panel"
        headerClassName="notes-header"
        titleClassName="notes-title"
        footerClassName="notes-actions"
      >
        <form

          onSubmit={handleAddSubmit}>
          <div className="modal__content invAdd-content">
            <label htmlFor={`new-item-${slug}`} className="modal__label invAdd-label">
              Nom de l'objet
            </label>

            <input
              type="text"
              id={`new-item-${slug}`}
              name={`new-item-${slug}`}
              className="modal__input invAdd-input"
              placeholder="Ex: Épée longue"
              autoFocus
              required
              minLength={1}
              maxLength={50}
              disabled={!isAddOpen}
            />
          </div>

          <div className="modal__footer invAdd-footer">
            <button
              type="button"
              className="btn-add-item-footer"
              onClick={closeAddModal}
            >
              Annuler
            </button>
            <button type="submit" className="btn-add-item-footer">
              Ajouter
            </button>
          </div>
        </form>
      </Modal>

    </section>
  );
};

export default Inventory;
