import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import Aleatarius from "./components/pages/Jace.tsx";
import Sylvae from "./components/pages/Sylvae.tsx";
import Jace from "./components/pages/Valerius.tsx";
import i18n from "./config/i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sylvae" element={<Sylvae />} />
        <Route path="/aleatarius" element={<Aleatarius />} />
        <Route path="/jace" element={<Jace />} />
      </Routes>
    </BrowserRouter>
  </I18nextProvider>
);
