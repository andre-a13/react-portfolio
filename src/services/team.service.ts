import axios from "axios";
import type { IAddTeam, TeamDto } from "../interface/IAddTeam";

const api = axios.create({
  baseURL: import.meta.env.VITE_TRPG_API_URL ?? "http://localhost:8000",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

async function create(body: IAddTeam) {
  const res = await api.post<TeamDto>("/teams", body);
  return res;
}

async function list() {
  const res = await api.get<TeamDto[]>("/teams");
  return res.data;
}

async function getByUuid(uuid: string) {
  const res = await api.get<TeamDto>("/teams/" + uuid);
  return res.data;
}

async function addMember(uuid: string, characterSlug: string) {
  const res = await api.post<TeamDto>(`/teams/${uuid}/characters/${characterSlug}`);
  return res.data;
}

export default {
  addMember,
  create,
  getByUuid,
  list,
};
