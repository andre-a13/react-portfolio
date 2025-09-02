import CharacterCard from "../character-card/CharacterCard"
import type { Character } from "../../types/character"
import './page.scss'

const data: Character = {
    name: "Erwyn",
    race: "Humain",
    stats: {
        mental: 50, corps: 50, social: 50
    },
    skillsPrimary: [],
    skillsSecondary: []
}

export default function CharacterPage() {
    return (
        <div className="page">
            <CharacterCard character={data} />
        </div>
    )
}