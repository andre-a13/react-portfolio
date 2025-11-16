import React from "react";
import "./character-card.scss";
import "./identity/identity.scss";
import "./stats/stats.scss";
import "./portrait/portrait.scss";
import "./skills/skills.scss";


import { Identity } from "./identity/Identity";
import { Stats } from "./stats/Stats";
import { Portrait } from "./portrait/Portrait";
import { Skills } from "./skills/Skills";
import Inventory from "./inventory/Inventory";
import type Character from "../../models/character";
import Notes from "./notes/Notes";
import HpBadge from "./hpbadge/HpBadge";
import characterService from "../../services/character.service";


interface CharacterCardProps {
    character: Character;
    portraitUrl ?: string;
    editableIdentity?: boolean; // pour activer contentEditable sur Nom/Race si tu veux
    className?: string;
    refresh : () => void;
}


export const CharacterCard: React.FC<CharacterCardProps> = ({ character, editableIdentity = false, className, portraitUrl, refresh  }) => {

    const increaseHp = async () => {
        if (character.current_hp >= character.getMaxHp()) return;
        await characterService.patch(character.slug, { current_hp: character.current_hp + 1 });
        refresh();
    }

    const decreaseHp = async () => {
        if (character.current_hp <= 0) return;
        await characterService.patch(character.slug, { current_hp: character.current_hp - 1 });
        refresh();
    }

    return (
        <main className={`ccard-sheet ${className ?? ""}`} role="document" aria-label="Fiche de personnage — Carte d'identité">
            <HpBadge showIcon={false} currentHp= {character.current_hp} maxHp={character.getMaxHp()} onIncreaseHp={increaseHp} onDecreaseHp={decreaseHp} label="Pv :" />
            <h1 className="ccard-title">Fiche de personnage
                <Notes slug={character.slug} notes={character.notes} />
            </h1>
            <Identity name={character.name} race={character.race} editable={editableIdentity} />


            <section className="ccard-grid">
                <div className="ccard-row">
                    <Stats values={character.stats} />
                    <Portrait src={character.portraitUrl ?? portraitUrl ?? ""} />
                </div>
                <Skills primary={character.skillsPrimary} secondary={character.skillsSecondary} />
                <Inventory slug={character.slug} items={character.inventory ?? []} gold={character.gold} refresh={refresh} />
            </section>
        
        </main>
    );
};


export default CharacterCard;