import type { SkillSet } from "../types/character";

export interface CharacterTeamDto {
    uuid: string;
    name: string;
    illustrationUrl?: string;
}

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
    teams?: CharacterTeamDto[];
}

export type IUpdateCharacter = Partial<IAddCharacter>;
