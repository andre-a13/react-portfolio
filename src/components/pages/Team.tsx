import { type FormEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router";
import type Character from "../../models/character";
import characterService from "../../services/character.service";
import teamService from "../../services/team.service";
import type { TeamDto } from "../../interface/IAddTeam";
import "./page.scss";

type TeamCharacter = {
  character: Character | null;
  slug: string;
  name: string;
};

export default function Team() {
  const { uuid } = useParams();
  const [team, setTeam] = useState<TeamDto | null>(null);
  const [characters, setCharacters] = useState<TeamCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberSlug, setMemberSlug] = useState("");
  const [memberStatus, setMemberStatus] = useState<string | null>(null);
  const [memberSubmitting, setMemberSubmitting] = useState(false);

  const fetchTeam = useCallback(async () => {
    if (!uuid) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await teamService.getByUuid(uuid);
      setTeam(data);

      const loadedCharacters = await Promise.all(
        (data.characters ?? []).map(async (summary) => {
          try {
            const character = await characterService.getBySlug(summary.slug);
            return {
              character,
              slug: summary.slug,
              name: summary.name,
            };
          } catch {
            return {
              character: null,
              slug: summary.slug,
              name: summary.name,
            };
          }
        })
      );
      setCharacters(loadedCharacters);
    } catch (err: unknown) {
      console.error("Error fetching team:", err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setNotFound(true);
      } else if (axios.isAxiosError(err)) {
        setError(`Error: ${err.response?.status ?? "network"} ${err.message}`);
      } else {
        setError("An error occurred while fetching the team.");
      }
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  async function handleAddMember(e: FormEvent) {
    e.preventDefault();
    if (!uuid || !memberSlug.trim()) return;

    setMemberSubmitting(true);
    setMemberStatus(null);

    try {
      await teamService.addMember(uuid, memberSlug.trim());
      setMemberSlug("");
      setIsAddingMember(false);
      setMemberStatus("Member added.");
      await fetchTeam();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMemberStatus(`Error: ${err.response?.status ?? "network"} ${err.message}`);
        return;
      }
      setMemberStatus("Network error: unable to add member");
    } finally {
      setMemberSubmitting(false);
    }
  }

  return (
    <div className="page">
      {loading && (
        <div className="character-message loading">
          <div className="spinner" aria-hidden="true" />
          <p>Loading team...</p>
        </div>
      )}

      {error && !loading && (
        <div className="character-message error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <p>
            <Link to="/teams">Return to teams</Link>
          </p>
        </div>
      )}

      {notFound && !loading && (
        <div className="character-message not-found">
          <h2>Team not found</h2>
          <p>We couldn't find a team for "{uuid}".</p>
          <p>
            <Link to="/teams">Return to teams</Link>
          </p>
        </div>
      )}

      {!loading && !error && !notFound && team && (
        <section className="team-detail">
          <header className="team-detail__header">
            <h1>{team.name}</h1>
            <button style={{display:"none"}} type="button" onClick={() => setIsAddingMember((value) => !value)}>
              Add member
            </button>
          </header>

          {isAddingMember && (
            <form className="team-detail__member-form" onSubmit={handleAddMember}>
              <label>Character slug</label>
              <div className="team-detail__member-row">
                <input
                  value={memberSlug}
                  onChange={(e) => setMemberSlug(e.target.value)}
                  placeholder="character-slug"
                  required
                />
                <button type="submit" disabled={memberSubmitting}>
                  {memberSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          )}

          {memberStatus && <p className="team-detail__member-status">{memberStatus}</p>}

          {characters.length === 0 ? (
            <p className="team-detail__empty">No characters assigned.</p>
          ) : (
            <div className="team-detail__grid">
              {characters.map(({ character, slug, name }) => {
                const portraitUrl = character?.portraitUrl || `/assets/${slug}_jdr.jpg`;

                return (
                  <Link className="team-detail__portrait" key={slug} to={`/characters/${slug}`}>
                    <img src={portraitUrl} alt={name} />
                    <span>{name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
