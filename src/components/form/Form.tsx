import React, { useState } from "react";

type Stats = { corps: number; mental: number; social: number };

export default function Form() {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [slug, setSlug] = useState("");
  const [portraitUrl, setPortraitUrl] = useState("");
  const [corps, setCorps] = useState(0);
  const [mental, setMental] = useState(0);
  const [social, setSocial] = useState(0);
  const [skillsPrimary, setSkillsPrimary] = useState("");
  const [skillsSecondary, setSkillsSecondary] = useState("");
  const [inventory, setInventory] = useState("");


  const [status, setStatus] = useState<string | null>(null);

  function csvToList(s: string) {
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const payload = {
      name,
      race,
      slug,
      portraitUrl: portraitUrl || undefined,
      stats: { corps: Number(corps), mental: Number(mental), social: Number(social) } as Stats,
      skillsPrimary: csvToList(skillsPrimary),
      skillsSecondary: csvToList(skillsSecondary),
      inventory: csvToList(inventory),
    };

    try {
      const res = await fetch("http://localhost:8000/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setStatus(`Error: ${res.status} ${text}`);
        return;
      }

      const data = await res.json();
      setStatus(`Created: ${data.id} ${data.name}`);
      // reset minimal fields
      setName("");
      setRace("");
      setSlug("");
      setPortraitUrl("");
      setSkillsPrimary("");
      setSkillsSecondary("");
      setInventory("");
    } catch (err: any) {
      setStatus(`Network error: ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
      <h2>Create Character</h2>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Race</label>
        <input value={race} onChange={(e) => setRace(e.target.value)} required />
      </div>
      <div>
        <label>Slug (url-safe)</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>
      <div>
        <label>Portrait URL</label>
        <input value={portraitUrl} onChange={(e) => setPortraitUrl(e.target.value)} />
      </div>

      <fieldset>
        <legend>Stats (0 - 100)</legend>
        <div>
          <label>Corps</label>
          <input type="number" value={corps} onChange={(e) => setCorps(Number(e.target.value))} min={0} max={100} />
        </div>
        <div>
          <label>Mental</label>
          <input type="number" value={mental} onChange={(e) => setMental(Number(e.target.value))} min={0} max={100} />
        </div>
        <div>
          <label>Social</label>
          <input type="number" value={social} onChange={(e) => setSocial(Number(e.target.value))} min={0} max={100} />
        </div>
      </fieldset>

      <div>
        <label>Primary Skills (comma separated)</label>
        <input value={skillsPrimary} onChange={(e) => setSkillsPrimary(e.target.value)} />
      </div>
      <div>
        <label>Secondary Skills (comma separated)</label>
        <input value={skillsSecondary} onChange={(e) => setSkillsSecondary(e.target.value)} />
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
  );
}
