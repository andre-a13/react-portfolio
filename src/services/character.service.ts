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

type CharacterPortraitUploadResponse = {
    upload_url: string;
    object_key: string;
    public_url: string;
    expires_in: number;
};

async function uploadPortrait( slug : string, file : File )
{
    const uploadRequest = await api.post<CharacterPortraitUploadResponse>(
        `/characters/${slug}/portrait-upload`,
        {
            filename: file.name,
            content_type: file.type,
            size: file.size,
        }
    );

    const uploadResponse = await fetch(uploadRequest.data.upload_url, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        throw new Error("Portrait upload failed");
    }

    await patch(slug, { portraitUrl: uploadRequest.data.public_url });

    return uploadRequest.data.public_url;
}

export default {
    create,
    getBySlug,
    patch,
    uploadPortrait
}
