import CharacterCard from "../character-card/CharacterCard"
import type { Character } from "../../types/character"
import './page.scss'

const valerius: Character = {
    name: "Valerius",
    race: "Humain",
    stats: {
        mental: 50, corps: 50, social: 50
    },
    skillsPrimary: ["Arts martiaux" , "Foi en la lumière"],
    skillsSecondary: ["Survie et vie en nature" , "Connaissance des cultes" , "Forgeron amateur"],
    inventory : ["Cestes", "Armure en cuir" ,"Médaillon de la main d'argent", "Flasque" , "Outils de forgeron"],
}



export default function Valerius() {
    return (
        <div className="page">
            <CharacterCard character={valerius} />
        </div>
    )
}