import axios from "axios";
import type { IAddCharacter, IUpdateCharacter } from "../interface/IAddCharacter";
import Character from "../models/character";

const api = axios.create({
    baseURL: import.meta.env.VITE_TRPG_API_URL ?? "http://localhost:8000",
    headers: {
        "ngrok-skip-browser-warning": "true",
    },
});

async function create( body : IAddCharacter )
{
    const res = await api.post("/characters", body );
    return res;
}

async function getBySlug( slug : string )
{
    const res = await api.get("/characters/" + slug );
    return new Character(res.data);
}

async function patch( slug : string, body : IUpdateCharacter )
{
    const res = await api.patch("/characters/" + slug, body );
    return res;
}

export default {
    create,
    getBySlug,
    patch
}
