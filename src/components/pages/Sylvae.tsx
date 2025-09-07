import CharacterCard from "../character-card/CharacterCard"
import type { Character } from "../../types/character"
import './page.scss'

const sylvae: Character = {
    name: "Sylvae Thalorien",
    race: "Elfe de la nuit",
    stats: {
        mental: 60, corps: 60, social: 30
    },
    skillsPrimary: ["Métamorphose animale" , "Vie en nature"],
    skillsSecondary: ["Archerie" , "Communion avec les esprits" , "Discrétion" , "Connaissance des secrets"]
}



export default function Sylvae() {
    return (
        <div className="page">
            <CharacterCard character={sylvae} />
        </div>
    )
}