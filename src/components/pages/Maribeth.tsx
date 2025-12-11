import { useState, useEffect } from "react";
import characterService from "../../services/character.service";
import CharacterCard from "../character-card/CharacterCard"
import './page.scss'
import axios from "axios";
import type Character from "../../models/character";

export default function Maribeth() {

    const [char, setChar] = useState<Character | null>(null);
    axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

        const fetchCharacter = async () => {
            try {
                const response = await characterService.getBySlug("maribeth");
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
                {char && <CharacterCard portraitUrl="/assets/maribeth_jdr.jpg" refresh={fetchCharacter} character={char} />}
            </div>
        )
    }