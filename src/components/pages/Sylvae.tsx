import { useEffect, useState } from "react";
import CharacterCard from "../character-card/CharacterCard"
import './page.scss'
import characterService from "../../services/character.service";
import type Character from "../../models/character";
import axios from "axios";

// const sylvae: Character = {
//     name: "Sylvae Thalorien",
//     race: "Elfe de la nuit",
//     stats: {
//         mental: 60, corps: 60, social: 30
//     },
//     skillsPrimary: ["Métamorphose animale", "Symbiose avec la nature"],
//     skillsSecondary: ["Archerie", "Communion avec les esprits", "Discrétion", "Connaissance des secrets"],
//     inventory: ["Arc kaldorei", "Talisman d'élune", "Sacoche druidique", "Collier de cuir et talisman d'Aelion", "Carnet de notes"],
// }

export default function Sylvae() {

    const [char, setChar] = useState<Character | null>(null);
    axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';


    const fetchCharacter = async () => {
        try {
            const response = await characterService.getBySlug("sylvae");
            setChar(response);
        } catch (error) {
            console.error("Error fetching character:", error);
        }
    }

    useEffect(() => {
        fetchCharacter();
    }, []);

    return (
        <div className="page">
            {char && <CharacterCard portraitUrl="/assets/sylvae.png" refresh={fetchCharacter} character={char} />     }        
        </div>
    )
}