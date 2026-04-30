import type { SkillSet } from "../types/character";
import type { CharacterDto } from "../interface/IAddCharacter";

export default class Character {
    id: string;
    name: string;
    slug: string;
    stats: SkillSet;
    race : string;
    skillsPrimary: string[];
    skillsSecondary: string[];
    portraitUrl?: string;
    inventory: string[];
    gold : number = 0;
    notes : string = "";
    current_hp : number = 0;
    bonusHealth : number = 0;
    constructor(data: CharacterDto) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.race = data.race;
        this.stats = data.stats;
        this.skillsPrimary = data.skillsPrimary;
        this.skillsSecondary = data.skillsSecondary;
        this.inventory = data.inventory;
        this.gold = data.gold ?? 0;
        this.portraitUrl = data.portraitUrl;
        this.notes = data.notes ?? "";
        this.bonusHealth = data.bonusHealth ?? 0;
        this.current_hp = data.current_hp ?? this.getMaxHp();

    }

    getMaxHp(): number {
        return Math.round((this.stats.corps / 5 ) + 5 + this.bonusHealth)
    }

    increaseHp(amount: number = 1) {
        this.current_hp = Math.min(this.current_hp + amount, this.getMaxHp());
    }
    decreaseHp(amount: number = 1) {
        this.current_hp = Math.max(this.current_hp - amount, 0);
    }
    
}
