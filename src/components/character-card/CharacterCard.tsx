import React from "react";
import "./character-card.scss";
import "./identity.scss";
import "./stats.scss";
import "./portrait.scss";
import "./skills.scss";


import { Identity } from "./Identity";
import { Stats } from "./Stats";
import { Portrait } from "./Portrait";
import { Skills } from "./Skills";
import type { Character } from "../../types/character";
import Inventory from "./Inventory";


interface CharacterCardProps {
    character: Character;
    editableIdentity?: boolean; // pour activer contentEditable sur Nom/Race si tu veux
    className?: string;
}


export const CharacterCard: React.FC<CharacterCardProps> = ({ character, editableIdentity = false, className }) => {
    return (
        <main className={`ccard-sheet ${className ?? ""}`} role="document" aria-label="Fiche de personnage — Carte d'identité">
            <h1 className="ccard-title">Fiche de personnage</h1>
            <Identity name={character.name} race={character.race} editable={editableIdentity} />


            <section className="ccard-grid">
                <div className="ccard-row">
                    <Stats values={character.stats} />
                    <Portrait src={character.portraitUrl} />
                </div>
                <Skills primary={character.skillsPrimary} secondary={character.skillsSecondary} />
                <Inventory items={character.inventory ?? []} />
            </section>
        
        </main>
    );
};


export default CharacterCard;