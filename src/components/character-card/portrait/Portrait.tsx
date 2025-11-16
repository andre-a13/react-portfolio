import React from "react";


interface PortraitProps { src?: string; alt?: string; }


export const Portrait: React.FC<PortraitProps> = ({ src, alt = "Portrait du personnage" }) => (
    <figure className="ccard-portrait" aria-label="Illustration">
        {src ? (
            <img src={src} alt={alt} />
        ) : (
            <div className="ccard-hint">Zone illustration (4:5).<br />Insérez une image ou laissez vide pour un symbole.</div>
        )}
    </figure>
);