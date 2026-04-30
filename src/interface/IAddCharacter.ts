import type { SkillSet } from "../types/character";

export interface IAddCharacter {
    name : string;
    slug : string;
    race : string;
    portraitUrl? : string;
    stats : SkillSet
    skillsPrimary : string[];
    skillsSecondary : string[];
    inventory : string[];
    gold ?: number;
    notes ?: string;
    current_hp ?: number;
    bonusHealth ?: number;
}

export interface CharacterDto extends IAddCharacter {
    id: string;
}

export type IUpdateCharacter = Partial<IAddCharacter>;
