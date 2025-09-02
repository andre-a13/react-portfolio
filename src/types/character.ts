export interface SkillSet {
    corps: number; // 0–100 (min 20 recommandé)
    mental: number; // 0–100
    social: number; // 0–100
}


export interface Character {
    name: string;
    race: string;
    portraitUrl?: string;
    stats: SkillSet;
    skillsPrimary: string[]; // 2 éléments
    skillsSecondary: string[]; // 0–3 éléments
}