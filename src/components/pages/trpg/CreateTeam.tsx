import React, { useState } from "react";
import axios from "axios";
import teamService from "../../../services/team.service";
import type { IAddTeam } from "../../../interface/IAddTeam";
import "./create-team.scss";

export default function CreateTeam() {
  const [uuid, setUuid] = useState("");
  const [name, setName] = useState("");
  const [illustrationUrl, setIllustrationUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const payload: IAddTeam = {
      name,
      uuid: uuid || undefined,
      illustrationUrl: illustrationUrl || undefined,
    };

    try {
      const res = await teamService.create(payload);
      setStatus(`Created: ${res.data.uuid} ${res.data.name}`);
      setUuid("");
      setName("");
      setIllustrationUrl("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatus(`Error: ${err.response?.status ?? "network"} ${err.message}`);
        return;
      }
      setStatus("Network error: unable to create team");
    }
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
        <h2>Create Team</h2>

        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label>UUID</label>
          <input
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            placeholder="Generated automatically when empty"
          />
        </div>

        <div>
          <label>Illustration URL</label>
          <input
            type="url"
            value={illustrationUrl}
            onChange={(e) => setIllustrationUrl(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Create</button>
        </div>

        {status && (
          <div style={{ marginTop: 12 }}>
            <strong>{status}</strong>
          </div>
        )}
      </form>
    </div>
  );
}
