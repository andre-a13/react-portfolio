import CharacterCard from "../character-card/CharacterCard"
import type { Character } from "../../types/character"
import './page.scss'

const sylvae: Character = {
    name: "Sylvae Thalorien",
    race: "Elfe de la nuit",
    stats: {
        mental: 60, corps: 60, social: 30
    },
    skillsPrimary: ["Métamorphose animale" , "Symbiose avec la nature"],
    skillsSecondary: ["Archerie" , "Communion avec les esprits" , "Discrétion" , "Connaissance des secrets"],
    inventory : ["Arc kaldorei", "Talisman d'élune" ,"Sacoche druidique", "Collier de cuir et talisman d'Aelion" , "Carnet de notes"],
}



export default function Sylvae() {
    return (
        <div className="page">
            <CharacterCard character={sylvae} />
        </div>
    )
}