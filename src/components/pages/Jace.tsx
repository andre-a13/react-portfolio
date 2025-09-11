import CharacterCard from "../character-card/CharacterCard"
import './page.scss'
import characterService from "../../services/character.service"
import { useState, useEffect } from "react"
import axios from "axios"
import type Character from "../../models/character"

export default function Aleatarius() {

    const [char, setChar] = useState<Character | null>(null);
    axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

    const fetchCharacter = async () => {
        try {
            const response = await characterService.getBySlug("aleatarius");
            setChar(response);
        } catch (error) {
            console.error("Error fetching character:", error);
        }
    }

    useEffect(() => {
        if (!char)
            fetchCharacter();
    }, []);


    return (
        <div className="page">
            {char && <CharacterCard refresh={fetchCharacter} character={char} />}
        </div>
    )
}