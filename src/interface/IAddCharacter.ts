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
    gold ?: number
}

export interface IUpdateCharacter extends Partial<IAddCharacter> {}