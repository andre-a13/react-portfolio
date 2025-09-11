import "./App.scss";
import Content from "./components/content/content";
import LangSwitch from "./components/lang-switch/LangSwitch";
import Section from "./components/sections/Section";

const datas = [
  {
    children: <Content />,
    asset: "/assets/bg.jpg",
    theme: {
      "--color-background": "#0D1117",
      "--color-primary": "#58A6FF",
      "--color-secondary": "#1F6FEB",
      "--color-accent": "#D2A8FF",
      "--color-text": "#C9D1D9",
      "--color-card": "#161B22",
      "--color-shadow": "rgba(88, 166, 255, 0.4)",
      "--color-text-background": "#f3f3e9", // Blanc cassé pour le texte, assurant une bonne lisibilité
    },
  },
  {
    children: <Content />,
    asset: "/assets/bg2.jpg",
    theme: {
      "--color-background": "#3f5025",
      "--color-primary": "#6f884f",
      "--color-secondary": "#b89b62",
      "--color-accent": "#5e2d1c",
      "--color-text": "#f3f3e9",
      "--color-card": "#726d50",
      "--color-shadow": "rgba(111, 136, 79, 0.4)",
      "--color-text-background": "#f3f3e9", // Blanc cassé pour le texte, assurant une bonne lisibilité
    },
  },
  {
    children: <Content />,
    asset: "/assets/bg3-light.png",
    theme: {
      "--color-background": "#e6eff5", // Bleu clair neigeux
      "--color-primary": "#a6bfcf", // Bleu-gris froid et doux
      "--color-secondary": "#c58b3a", // Doré/cuivré inspiré des forges naines
      "--color-accent": "#4f2d1c", // Brun foncé pour profondeur (pierres, bois)
      "--color-text": "#1f1f1f", // Presque noir pour lisibilité optimale
      "--color-card": "#fdfdfd", // Fond de cartes ou blocs (quasi blanc neige)
      "--color-shadow": "rgba(166, 191, 207, 0.4)", // Ajouté pour correspondre au type attendu
      "--color-text-background": "#f3f3e9", // Blanc cassé pour le texte, assurant une bonne lisibilité
    },
  },
  {
    children: <Content />,
    asset: "/assets/e33.jpeg",
    theme: {
      "--color-background": "#1a1a1a", // Un noir profond pour le fond
      "--color-primary": "#3a3a3a", // Un gris foncé pour les éléments principaux
      "--color-secondary": "#5a5a5a", // Un gris moyen pour les éléments secondaires
      "--color-accent": "#8a2d1c", // Une teinte rougeâtre pour les accents
      "--color-text": "#f3f3e9", // Un blanc cassé pour le texte, assurant une bonne lisibilité
      "--color-card": "#2a2a2a", // Un gris très foncé pour les cartes
      "--color-shadow": "rgba(58, 58, 58, 0.6)", // Une ombre grise pour la profondeur
      "--color-text-background": "#f3f3e9", // Blanc cassé pour le texte, assurant une bonne lisibilité
    },
  },
];

function App() {
  const randomIndex = Math.floor(Math.random() * datas.length);
  const selectedData = datas[randomIndex];
  console.log("Selected theme:", selectedData.theme);

  return (
    <div className="app">
      <div className="lang-management">
        <LangSwitch />
      </div>
      <Section data={selectedData}>{selectedData.children}</Section>
      {/* {datas.map((d, i) => {
        return (
          <Section key={`sec-${i}`} data={d as any}>
            {d.children}
          </Section>
        );
      })} */}
    </div>
  );
}

export default App;
