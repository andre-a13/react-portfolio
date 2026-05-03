import React from "react";
import { Link } from "react-router";
import type { CharacterTeamDto } from "../../../interface/IAddCharacter";


interface IdentityProps {
    race: string;
    firstTeam?: CharacterTeamDto;
}


export const Identity: React.FC<IdentityProps> = ({ race, firstTeam }) => (
    <section className="ccard-identity" aria-label="Identite">
        <div className="ccard-field">
            <div className="ccard-label">Race</div>
            <div className="ccard-text" aria-label="Race du personnage">{race}</div>
        </div>
        <div className="ccard-field">
            <div className="ccard-label">Compagnie</div>
            {firstTeam ? (
                <Link className="ccard-text ccard-teamLink" to={`/teams/${firstTeam.uuid}`}>
                    {firstTeam.name}
                </Link>
            ) : (
                <div className="ccard-text" aria-label="Compagnie du personnage">Aucune</div>
            )}
        </div>
    </section>
);
