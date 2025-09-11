import axios from "axios";
import type { IAddCharacter, IUpdateCharacter } from "../interface/IAddCharacter";
import Character from "../models/character";

const baseEndpoints = import.meta.env.VITE_TRPG_API_URL + "/characters";

async function create( body : IAddCharacter )
{
    const res = axios.post( baseEndpoints, body );
    return res;
}

async function getBySlug( slug : string )
{
    const res = await axios.get( baseEndpoints + "/" + slug );
    return new Character(res.data);
}

async function patch( slug : string, body : IUpdateCharacter )
{
    const res = axios.patch( baseEndpoints + "/" + slug, body );
    return res;
}

export default {
    create,
    getBySlug,
    patch
}
