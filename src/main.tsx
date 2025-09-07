import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import CharacterPage from "./components/pages/Character.tsx";
import i18n from "./config/i18n";
import "./index.css";
import Sylvae from "./components/pages/Sylvae.tsx";
import Aleatarius from "./components/pages/Aleatarius.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/char" element={<CharacterPage />}/>
          <Route path="/sylvae" element={<Sylvae/>}/>
          <Route path="/aleatarius" element={<Aleatarius/>}/>
      </Routes>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>
);
