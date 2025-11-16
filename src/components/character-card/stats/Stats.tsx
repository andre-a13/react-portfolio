import React from "react";


export interface StatsValues { corps: number; mental: number; social: number; }
const clamp = (n: number) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));


interface RowProps { label: string; value: number; }
const StatRow: React.FC<RowProps> = ({ label, value }) => {
    const v = clamp(value);
    return (
        <div className="ccard-stat">
            <div className="ccard-statName">{label}</div>
            <div className="ccard-bar" aria-hidden="true">
                <div className="ccard-fill" style={{ width: `${v}%` }} />
            </div>
            <output className="ccard-val" aria-label={`Valeur ${label}`}>{v}</output>
        </div>
    );
};


interface StatsProps { values: StatsValues; }
export const Stats: React.FC<StatsProps> = ({ values }) => {
    const total = (values?.corps ?? 0) + (values?.mental ?? 0) + (values?.social ?? 0);
    return (
        <section className="ccard-stats" aria-label={`Compétences (total ${total})`}>
            <StatRow label="Corps" value={values.corps} />
            <StatRow label="Mental" value={values.mental} />
            <StatRow label="Social" value={values.social} />
        </section>
    );
};