import React from "react";


interface ListProps { title: string; items: string[]; }
const List: React.FC<ListProps> = ({ title, items }) => (
    <div>
        <h3 className="ccard-listTitle">{title}</h3>
        <ul className="ccard-list">
            {items.map((it, idx) => (
                <li key={`${title}-${idx}`} className="ccard-listItem">{it}</li>
            ))}
        </ul>
    </div>
);


interface SkillsProps { primary: string[]; secondary: string[]; }
export const Skills: React.FC<SkillsProps> = ({ primary, secondary }) => (
    <section className="ccard-lists">
        <List title="Compétences principales" items={primary} />
        <List title="Compétences secondaires" items={secondary} />
    </section>
);