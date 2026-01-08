import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import characterService from "../../services/character.service";
import CharacterCard from "../character-card/CharacterCard";
import './page.scss'
import axios from "axios";
import type Character from "../../models/character";

type Props = {
  presetSlug?: string;
  portraitUrl?: string;
};

export default function CharacterPage({ presetSlug, portraitUrl }: Props) {
  const params = useParams();
  const slug = presetSlug ?? params.slug ?? "";
  const [char, setChar] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

  const fetchCharacter = async () => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const response = await characterService.getBySlug(slug as string);
      setChar(response);
    } catch (err: any) {
      console.error("Error fetching character:", err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("An error occurred while fetching the character.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const computedPortrait = portraitUrl ?? (slug ? `/assets/${slug}_jdr.jpg` : undefined);

  return (
    <div className="page">
      {loading && (
        <div className="character-message loading">
          <div className="spinner" aria-hidden="true" />
          <p>Loading character…</p>
        </div>
      )}

      {error && !loading && (
        <div className="character-message error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <p>
            <Link to="/">Return to home</Link>
          </p>
        </div>
      )}

      {notFound && !loading && (
        <div className="character-message not-found">
          <h2>Character not found</h2>
          <p>We couldn't find a character for "{slug}". Try browsing the list or check the URL.</p>
          <p>
            <Link to="/">Return to home</Link>
          </p>
        </div>
      )}

      {!loading && !error && !notFound && char && (
        <CharacterCard portraitUrl={computedPortrait} refresh={fetchCharacter} character={char} />
      )}
    </div>
  );
}
