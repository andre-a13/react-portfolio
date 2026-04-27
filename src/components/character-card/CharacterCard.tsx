import React from "react";
import { Pencil } from "lucide-react";
import "./character-card.scss";
import "./identity/identity.scss";
import "./stats/stats.scss";
import "./portrait/portrait.scss";
import "./skills/skills.scss";


import { Identity } from "./identity/Identity";
import { Stats } from "./stats/Stats";
import { Portrait } from "./portrait/Portrait";
import { Skills } from "./skills/Skills";
import Inventory from "./inventory/Inventory";
import type Character from "../../models/character";
import Notes from "./notes/Notes";
import HpBadge from "./hpbadge/HpBadge";
import characterService from "../../services/character.service";
import type { SkillSet } from "../../types/character";


interface CharacterCardProps {
    character: Character;
    portraitUrl ?: string;
    editableIdentity?: boolean; // pour activer contentEditable sur Nom/Race si tu veux
    className?: string;
    refresh : () => void;
    designMode?: boolean;
    onToggleDesignMode?: () => void;
}


export const CharacterCard: React.FC<CharacterCardProps> = ({ character, editableIdentity = false, className, portraitUrl, refresh, designMode = false, onToggleDesignMode  }) => {
    const [stats, setStats] = React.useState<SkillSet>(character.stats);
    const [primarySkills, setPrimarySkills] = React.useState<string[]>(character.skillsPrimary ?? []);
    const [secondarySkills, setSecondarySkills] = React.useState<string[]>(character.skillsSecondary ?? []);
    const [currentHp, setCurrentHp] = React.useState(character.current_hp);
    const maxHp = React.useMemo(() => Math.round((stats.corps / 5) + 5), [stats.corps]);
    const previousStatsRef = React.useRef(character.stats);
    const statsSaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        setStats(character.stats);
        setPrimarySkills(character.skillsPrimary ?? []);
        setSecondarySkills(character.skillsSecondary ?? []);
        previousStatsRef.current = character.stats;
        setCurrentHp(character.current_hp);
    }, [character.current_hp, character.skillsPrimary, character.skillsSecondary, character.slug, character.stats]);

    React.useEffect(() => {
        const previousStats = previousStatsRef.current;
        const statsChanged =
            stats.corps !== previousStats.corps ||
            stats.mental !== previousStats.mental ||
            stats.social !== previousStats.social;

        if (!statsChanged) return;

        if (statsSaveTimerRef.current) clearTimeout(statsSaveTimerRef.current);

        statsSaveTimerRef.current = setTimeout(async () => {
            try {
                await characterService.patch(character.slug, { stats });
                previousStatsRef.current = stats;
            } catch (error) {
                console.error("Failed to update stats:", error);
                setStats(previousStatsRef.current);
            }
        }, 500);

        return () => {
            if (statsSaveTimerRef.current) clearTimeout(statsSaveTimerRef.current);
        };
    }, [character.slug, stats]);

    const updateStat = (key: keyof SkillSet, value: number) => {
        setStats((currentStats) => ({
            ...currentStats,
            [key]: value,
        }));
    };

    const addPrimarySkill = async (value: string) => {
        const newSkill = value.trim();
        if (!newSkill) return;

        savePrimarySkills([...primarySkills, newSkill]);
    };

    const deletePrimarySkill = (index: number) => {
        const updatedSkills = primarySkills.filter((_, skillIndex) => skillIndex !== index);
        savePrimarySkills(updatedSkills);
    };

    const movePrimarySkill = (fromIndex: number, toIndex: number) => {
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= primarySkills.length || toIndex >= primarySkills.length) return;

        const updatedSkills = [...primarySkills];
        const [movedSkill] = updatedSkills.splice(fromIndex, 1);
        updatedSkills.splice(toIndex, 0, movedSkill);
        savePrimarySkills(updatedSkills);
    };

    const savePrimarySkills = async (updatedSkills: string[]) => {
        const previousSkills = primarySkills;
        setPrimarySkills(updatedSkills);

        try {
            await characterService.patch(character.slug, { skillsPrimary: updatedSkills });
        } catch (error) {
            console.error("Failed to update primary skills:", error);
            setPrimarySkills(previousSkills);
        }
    };

    const addSecondarySkill = async (value: string) => {
        const newSkill = value.trim();
        if (!newSkill) return;

        saveSecondarySkills([...secondarySkills, newSkill]);
    };

    const deleteSecondarySkill = (index: number) => {
        const updatedSkills = secondarySkills.filter((_, skillIndex) => skillIndex !== index);
        saveSecondarySkills(updatedSkills);
    };

    const moveSecondarySkill = (fromIndex: number, toIndex: number) => {
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= secondarySkills.length || toIndex >= secondarySkills.length) return;

        const updatedSkills = [...secondarySkills];
        const [movedSkill] = updatedSkills.splice(fromIndex, 1);
        updatedSkills.splice(toIndex, 0, movedSkill);
        saveSecondarySkills(updatedSkills);
    };

    const saveSecondarySkills = async (updatedSkills: string[]) => {
        const previousSkills = secondarySkills;
        setSecondarySkills(updatedSkills);

        try {
            await characterService.patch(character.slug, { skillsSecondary: updatedSkills });
        } catch (error) {
            console.error("Failed to update secondary skills:", error);
            setSecondarySkills(previousSkills);
        }
    };

    const updateHp = async (nextHp: number) => {
        const clampedHp = Math.max(0, Math.min(nextHp, maxHp));
        if (clampedHp === currentHp) return;

        const previousHp = currentHp;
        setCurrentHp(clampedHp);

        try {
            await characterService.patch(character.slug, { current_hp: clampedHp });
        } catch (error) {
            console.error("Failed to update HP:", error);
            setCurrentHp(previousHp);
        }
    };

    const increaseHp = () => {
        updateHp(currentHp + 1);
    }

    const decreaseHp = () => {
        updateHp(currentHp - 1);
    }

    return (
        <main className={`ccard-sheet ${className ?? ""}`} role="document" aria-label="Fiche de personnage — Carte d'identité">
            <HpBadge showIcon={false} currentHp= {currentHp} maxHp={maxHp} onIncreaseHp={increaseHp} onDecreaseHp={decreaseHp} label="Pv :" />
            <h1 className="ccard-title">Fiche de personnage
                <button
                    type="button"
                    className={`ccard-modeToggle ${designMode ? "is-active" : ""}`}
                    aria-label={designMode ? "Passer en mode lecture" : "Passer en mode edition"}
                    aria-pressed={designMode}
                    title={designMode ? "Mode edition actif" : "Activer le mode edition"}
                    onClick={onToggleDesignMode}
                >
                    <Pencil size={17} strokeWidth={2.2} aria-hidden="true" />
                </button>
                <Notes slug={character.slug} notes={character.notes} />
            </h1>
            <Identity name={character.name} race={character.race} editable={editableIdentity} />


            <section className="ccard-grid">
                <div className="ccard-row">
                    <Stats values={stats} editable={designMode} onChange={updateStat} />
                    <Portrait src={character.portraitUrl ?? portraitUrl ?? ""} />
                </div>
                <Skills
                    primary={primarySkills}
                    secondary={secondarySkills}
                    editable={designMode}
                    movable
                    onAddPrimarySkill={addPrimarySkill}
                    onDeletePrimarySkill={deletePrimarySkill}
                    onMovePrimarySkill={movePrimarySkill}
                    onAddSecondarySkill={addSecondarySkill}
                    onDeleteSecondarySkill={deleteSecondarySkill}
                    onMoveSecondarySkill={moveSecondarySkill}
                />
                <Inventory slug={character.slug} items={character.inventory ?? []} gold={character.gold} refresh={refresh} />
            </section>
        
        </main>
    );
};


export default CharacterCard;
