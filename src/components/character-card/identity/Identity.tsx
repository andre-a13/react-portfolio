import React from "react";


interface IdentityProps {
    name: string;
    race: string;
    editable?: boolean;
}


export const Identity: React.FC<IdentityProps> = ({ name, race, editable }) => (
    <section className="ccard-identity" aria-label="Identité">
        <div className="ccard-field">
            <div className="ccard-label">Nom du personnage</div>
            <div
                className="ccard-value"
                contentEditable={!!editable}
                suppressContentEditableWarning
                aria-label="Nom du personnage"
            >{name}</div>
        </div>
        <div className="ccard-field">
            <div className="ccard-label">Race</div>
            <div
                className="ccard-text"
                suppressContentEditableWarning
                aria-label="Race du personnage"
            >{race}</div>
        </div>
    </section>
);  