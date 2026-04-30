import React from "react";
import { ChevronLeft, ChevronRight, List, Rows3 } from "lucide-react";
import characterService from "../../../services/character.service";
import InventoryItem from "./inventory-item/InventoryItem";
import Modal, { type ModalHandle } from "../../ui/modal/Modal";
import "../skills/skills.scss";
import "./inventory.scss";
import "./inventory-add-modal.scss";

const INVENTORY_ITEMS_PER_PAGE = 5;

interface InventoryProps {
  items: string[];
  title?: string;
  slug: string;
  gold?: number;
  refresh: () => void;
}

type VisibleInventoryItem = {
  item: string;
  index: number;
};

export const Inventory: React.FC<InventoryProps> = ({
  items = [],
  title = "Inventaire",
  slug,
  gold,
  refresh,
}) => {
  const modalRef = React.useRef<ModalHandle>(null);
  const goldTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentGoldRef = React.useRef<number>(gold ?? 0);
  const dragIndexRef = React.useRef<number | null>(null);

  const [itemsList, setItemsList] = React.useState<string[]>(items);
  const [localGold, setLocalGold] = React.useState<number>(gold ?? 0);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [paginationEnabled, setPaginationEnabled] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [draggingIdx, setDraggingIdx] = React.useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = React.useState<number | null>(null);

  const pageCount = Math.max(1, Math.ceil(itemsList.length / INVENTORY_ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, pageCount - 1);
  const pageStart = paginationEnabled ? activePage * INVENTORY_ITEMS_PER_PAGE : 0;
  const canReorder = !paginationEnabled || pageCount === 1;

  const visibleItems = React.useMemo<VisibleInventoryItem[]>(() => {
    const pageItems = paginationEnabled
      ? itemsList.slice(pageStart, pageStart + INVENTORY_ITEMS_PER_PAGE)
      : itemsList;

    return pageItems.map((item, index) => ({
      item,
      index: pageStart + index,
    }));
  }, [itemsList, pageStart, paginationEnabled]);

  React.useEffect(() => {
    setItemsList(items);
  }, [items]);

  React.useEffect(() => {
    if (typeof gold !== "number") return;

    setLocalGold(gold);
    lastSentGoldRef.current = gold;
  }, [gold]);

  React.useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount - 1));
  }, [pageCount]);

  React.useEffect(() => {
    if (!slug || localGold === lastSentGoldRef.current) return;

    if (goldTimerRef.current) clearTimeout(goldTimerRef.current);

    goldTimerRef.current = setTimeout(async () => {
      try {
        lastSentGoldRef.current = localGold;
        await characterService.patch(slug, { gold: localGold });
      } catch (error) {
        console.error("Failed to update gold:", error);
      }
    }, 500);

    return () => {
      if (goldTimerRef.current) clearTimeout(goldTimerRef.current);
    };
  }, [localGold, slug]);

  const closeAddModal = () => {
    setIsAddOpen(false);
    modalRef.current?.close();
  };

  const resetDragState = () => {
    dragIndexRef.current = null;
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const saveInventory = async (updatedItems: string[], errorMessage: string, shouldRefresh = true) => {
    try {
      await characterService.patch(slug, { inventory: updatedItems });
      if (shouldRefresh) refresh();
      return true;
    } catch (error) {
      console.error(errorMessage, error);
      refresh();
      return false;
    }
  };

  const setLastPage = (itemCount: number) => {
    setCurrentPage(Math.max(0, Math.ceil(itemCount / INVENTORY_ITEMS_PER_PAGE) - 1));
  };

  const dec = () => setLocalGold((value) => Math.max(0, value - 1));
  const inc = () => setLocalGold((value) => value + 1);

  const onDragStart = (event: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    setDraggingIdx(index);
    event.dataTransfer.effectAllowed = "move";

    try {
      event.dataTransfer.setData("text/plain", String(index));
    } catch {
      return;
    }
  };

  const onDragOverItem = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) setDragOverIdx(index);
  };

  const onDropItem = async (event: React.DragEvent, index: number) => {
    event.preventDefault();

    const rawSource = event.dataTransfer.getData("text/plain");
    const sourceIndex = dragIndexRef.current ?? Number(rawSource);
    const isValidSource =
      Number.isInteger(sourceIndex) &&
      sourceIndex >= 0 &&
      sourceIndex < itemsList.length;

    if (!isValidSource || sourceIndex === index) {
      resetDragState();
      return;
    }

    const updatedItems = [...itemsList];
    const [movedItem] = updatedItems.splice(sourceIndex, 1);
    updatedItems.splice(index, 0, movedItem);

    setItemsList(updatedItems);
    resetDragState();
    await saveInventory(updatedItems, "Failed to save inventory order:", false);
  };

  const handleAddSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const newItem = formData.get(`new-item-${slug}`)?.toString().trim();

    if (!newItem) return;

    const updatedItems = [...itemsList, newItem];
    setItemsList(updatedItems);
    if (paginationEnabled) setLastPage(updatedItems.length);

    const saved = await saveInventory(updatedItems, "Failed to add item:");
    if (!saved) return;

    form.reset();
    closeAddModal();
  };

  const updateItemLabel = async (index: number, newName: string) => {
    const trimmedName = newName.trim();

    if (!trimmedName || itemsList[index] === trimmedName) return;

    const updatedItems = itemsList.map((item, itemIndex) =>
      itemIndex === index ? trimmedName : item
    );

    setItemsList(updatedItems);
    await saveInventory(updatedItems, "Failed to update item:");
  };

  const deleteItem = async (index: number) => {
    const updatedItems = itemsList.filter((_, itemIndex) => itemIndex !== index);

    setItemsList(updatedItems);
    await saveInventory(updatedItems, "Failed to delete item:");
  };

  return (
    <section className="ccard-lists" aria-label="Inventaire">
      <div>
        <div className="ccard-invHeader">
          <h3 className="ccard-listTitle">{title}</h3>

          <div className="ccard-listActions">
            <div className="ccard-coinCounter" role="group" aria-label="Pieces d'or">
              <button
                type="button"
                className="ccard-coinBtn"
                aria-label="Retirer 1 piece d'or"
                onClick={dec}
                disabled={localGold <= 0}
              >
                -
              </button>

              <div className="ccard-coinDisplay" title="Pieces d'or">
                <svg className="ccard-coinIcon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#F5C518" stroke="#a77b5b" strokeWidth="1" />
                  <circle cx="8" cy="8" r="3" fill="rgba(255,255,255,0.35)" />
                </svg>
                <span className="ccard-coinValue">{localGold}</span>
              </div>

              <button
                type="button"
                className="ccard-coinBtn"
                aria-label="Ajouter 1 piece d'or"
                onClick={inc}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="ccard-addItemBtn"
              aria-haspopup="dialog"
              onClick={() => modalRef.current?.open()}
            >
              + Ajouter un objet
            </button>
          </div>
        </div>

        <div className="ccard-invControls">
          <button
            type="button"
            className={`ccard-pageToggle ${paginationEnabled ? "is-active" : ""}`}
            aria-pressed={paginationEnabled}
            title={paginationEnabled ? "Desactiver la pagination" : "Activer la pagination"}
            onClick={() => setPaginationEnabled((enabled) => !enabled)}
          >
            {paginationEnabled ? <List size={15} aria-hidden="true" /> : <Rows3 size={15} aria-hidden="true" />}
          </button>

          {paginationEnabled && itemsList.length > INVENTORY_ITEMS_PER_PAGE && (
            <div className="ccard-invPager" role="navigation" aria-label="Pagination inventaire">
              <button
                type="button"
                className="ccard-pageBtn"
                aria-label="Page precedente"
                title="Page precedente"
                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                disabled={activePage === 0}
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>

              <span className="ccard-pageStatus">
                {activePage + 1}/{pageCount}
              </span>

              <button
                type="button"
                className="ccard-pageBtn"
                aria-label="Page suivante"
                title="Page suivante"
                onClick={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
                disabled={activePage >= pageCount - 1}
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <ul className="ccard-list ccard-invList" role="list">
          {itemsList.length > 0 ? (
            visibleItems.map(({ item, index }) => (
              <InventoryItem
                key={`${item}-${index}`}
                name={item}
                onEditContent={(newName) => updateItemLabel(index, newName)}
                onDelete={() => deleteItem(index)}
                draggable={canReorder}
                onDragStart={(event) => onDragStart(event, index)}
                onDragOver={(event) => onDragOverItem(event, index)}
                onDrop={(event) => onDropItem(event, index)}
                onDragEnd={resetDragState}
                isDragging={draggingIdx === index}
                isDragOver={dragOverIdx === index}
              />
            ))
          ) : (
            <li className="ccard-listItem" aria-disabled>
              <em style={{ opacity: 0.7 }}>-- vide --</em>
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
        <form onSubmit={handleAddSubmit}>
          <div className="modal__content invAdd-content">
            <label htmlFor={`new-item-${slug}`} className="modal__label invAdd-label">
              Nom de l'objet
            </label>

            <input
              type="text"
              id={`new-item-${slug}`}
              name={`new-item-${slug}`}
              className="modal__input invAdd-input"
              placeholder="Ex: Epee longue"
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
