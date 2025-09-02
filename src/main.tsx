import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import CharacterPage from "./components/pages/Character.tsx";
import i18n from "./config/i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/char" element={<CharacterPage />}/>
      </Routes>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>
);
