import CharacterCard from "../character-card/CharacterCard"
import type { Character } from "../../types/character"
import './page.scss'

const aleatarius: Character = {
    name: "Aleatarius Tiragogo",
    race: "Gobelin",
    stats: {
        mental: 80, corps: 20, social: 50
    },
    skillsPrimary: ["Hearthstomancie" , "Chance insolante"],
    skillsSecondary: ["Doigts agiles" , "Prestidigation" , "Ingénieur" , "Alchimie"]
}



export default function Aleatarius() {
    return (
        <div className="page">
            <CharacterCard character={aleatarius} />
        </div>
    )
}