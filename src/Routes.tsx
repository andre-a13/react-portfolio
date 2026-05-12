import { Route, Routes } from "react-router";
import App from "./App";
import CharacterPage from "./components/pages/Character";
import CreateCharacter from "./components/pages/CreateCharacter";
import CreateTeam from "./components/pages/CreateTeam";
import RetroLab from "./components/pages/RetroLab";
import Team from "./components/pages/Team";
import Teams from "./components/pages/Teams";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      {/* Legacy explicit character paths kept but now use the generic CharacterPage for fetching */}
      <Route path="/sylvae" element={<CharacterPage presetSlug="sylvae" portraitUrl="/assets/sylvae_jdr.jpg" />} />
      <Route path="/aleatarius" element={<CharacterPage presetSlug="aleatarius" portraitUrl="/assets/aleatarius_jdr.jpg" />} />
      <Route path="/jace" element={<CharacterPage presetSlug="jace" portraitUrl="/assets/jace_jdr.jpg" />} />
      <Route path="/maribeth" element={<CharacterPage presetSlug="maribeth" portraitUrl="/assets/maribeth_jdr.jpg" />} />

      {/* Dynamic routes */}
      <Route path="/characters/:slug" element={<CharacterPage />} />
      <Route path="/characters/new" element={<CreateCharacter />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/create" element={<CreateTeam />} />
      <Route path="/teams/:uuid" element={<Team />} />
      <Route path="/retrolab" element={<RetroLab />} />
      <Route path="/:slug" element={<CharacterPage />} />
    </Routes>
  );
}
