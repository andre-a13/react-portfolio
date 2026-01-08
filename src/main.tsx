import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes";
import i18n from "./config/i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </I18nextProvider>
);
