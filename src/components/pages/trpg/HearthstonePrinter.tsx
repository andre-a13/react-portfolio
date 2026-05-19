import { useMemo, useState } from "react";
import { Brush, Gem, Home, RotateCcw, ScrollText, Sparkles, WandSparkles } from "lucide-react";
import { Link } from "react-router";
import "./hearthstone-printer.scss";

type GemColor = "white" | "blue" | "violet" | "orange";
type PhaseKey = "ink" | "paint" | "gem";
type Posture = "careful" | "standard" | "bold";
type Retouch = -1 | 0 | 1;
type InhibitionMode = "none" | "double" | "half";

type PhaseState = {
  posture: Posture;
  roll: number;
  trained: boolean;
  retouch: Retouch;
  inhibition: InhibitionMode;
};

const gemRules: Record<GemColor, { label: string; target: number; description: string }> = {
  orange: {
    label: "Orange",
    target: 1,
    description: "Effet pleinement charge, rare et instable.",
  },
  violet: {
    label: "Violette",
    target: 4,
    description: "Effet majeur, resonance soutenue.",
  },
  blue: {
    label: "Bleue",
    target: 7,
    description: "Effet fiable, puissance moyenne.",
  },
  white: {
    label: "Blanche",
    target: 10,
    description: "Effet mineur, faible charge magique.",
  },
};

const effectOptions: Array<{ value: GemColor; label: string }> = [
  { value: "white", label: "Mineur" },
  { value: "blue", label: "Stable" },
  { value: "violet", label: "Majeur" },
  { value: "orange", label: "Legendaire" },
];

const phaseMeta: Record<PhaseKey, { label: string; skill: string; icon: typeof ScrollText }> = {
  ink: {
    label: "Encre",
    skill: "Runologie",
    icon: ScrollText,
  },
  paint: {
    label: "Peinture",
    skill: "Art / Calligraphie",
    icon: Brush,
  },
  gem: {
    label: "Gemme",
    skill: "Gemmologie / Enchantement",
    icon: Gem,
  },
};

const postureLabels: Record<Posture, string> = {
  careful: "Prudent",
  standard: "Standard",
  bold: "Audacieux",
};

const initialPhases: Record<PhaseKey, PhaseState> = {
  ink: {
    posture: "standard",
    roll: 3,
    trained: false,
    retouch: 0,
    inhibition: "none",
  },
  paint: {
    posture: "standard",
    roll: 3,
    trained: false,
    retouch: 0,
    inhibition: "none",
  },
  gem: {
    posture: "standard",
    roll: 3,
    trained: false,
    retouch: 0,
    inhibition: "none",
  },
};

function getPostureScore(posture: Posture, roll: number) {
  const tier = roll <= 2 ? 0 : roll <= 4 ? 1 : 2;

  if (posture === "careful") return [0, 1, 2][tier];
  if (posture === "standard") return [1, 2, 4][tier];
  return [2, 4, 6][tier];
}

function applyInhibition(score: number, mode: InhibitionMode) {
  if (mode === "double") return score * 2;
  if (mode === "half") return Math.floor(score / 2);
  return score;
}

function getVerdict(total: number, target: number) {
  const delta = total - target;

  if (delta === 0) {
    return {
      tone: "success",
      title: "Carte stabilisee",
      text: "Le score atteint exactement la resonance de la gemme.",
    };
  }

  if (Math.abs(delta) === 1) {
    return {
      tone: "warning",
      title: "Presque stable",
      text: delta > 0 ? "La carte est legerement surchargee." : "La carte manque d'un souffle d'infusion.",
    };
  }

  return {
    tone: "danger",
    title: delta > 0 ? "Surcharge arcanique" : "Infusion insuffisante",
    text:
      delta > 0
        ? "L'effet risque de s'emballer ou de se fixer sous une forme deformee."
        : "La gemme ne recoit pas assez de puissance pour tenir l'effet.",
  };
}

export default function HearthstonePrinter() {
  const [cardName, setCardName] = useState("Apprenti de Karazhan");
  const [attack, setAttack] = useState(2);
  const [health, setHealth] = useState(3);
  const [effectText, setEffectText] = useState("Cri de guerre : piochez une carte si une ligne de mana est proche.");
  const [effectPower, setEffectPower] = useState<GemColor>("blue");
  const [illustration, setIllustration] = useState("/assets/bg3-light.png");
  const [phases, setPhases] = useState<Record<PhaseKey, PhaseState>>(initialPhases);
  const [slowBrush, setSlowBrush] = useState(false);
  const [useGemReroll, setUseGemReroll] = useState(false);
  const [gemReroll, setGemReroll] = useState(4);
  const [sphereTarget, setSphereTarget] = useState<"none" | PhaseKey>("none");
  const [chronosphere, setChronosphere] = useState(false);
  const [attempt, setAttempt] = useState<1 | 2>(1);

  const gem = gemRules[effectPower];

  const phaseScores = useMemo(() => {
    return (Object.keys(phases) as PhaseKey[]).map((key) => {
      const phase = phases[key];
      const effectiveRoll = key === "gem" && slowBrush && useGemReroll ? gemReroll : phase.roll;
      const baseScore = getPostureScore(phase.posture, effectiveRoll);
      const retouch = phase.trained ? phase.retouch : 0;
      const beforeTools = Math.max(0, baseScore + retouch);
      const afterInhibition = applyInhibition(beforeTools, phase.inhibition);
      const finalScore = sphereTarget === key ? 0 : afterInhibition;

      return {
        key,
        effectiveRoll,
        baseScore,
        retouch,
        beforeTools,
        finalScore,
      };
    });
  }, [gemReroll, phases, slowBrush, sphereTarget, useGemReroll]);

  const totalScore = phaseScores.reduce((sum, phase) => sum + phase.finalScore, 0);
  const verdict = getVerdict(totalScore, gem.target);

  function updatePhase<K extends keyof PhaseState>(key: PhaseKey, field: K, value: PhaseState[K]) {
    setPhases((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  }

  function resetWorkshop() {
    setPhases(initialPhases);
    setSlowBrush(false);
    setUseGemReroll(false);
    setGemReroll(4);
    setSphereTarget("none");
    setChronosphere(false);
    setAttempt(1);
  }

  return (
    <main className="page hearthstone-page">
      <section className="hearthstone-workshop">
        <header className="hearthstone-workshop__header">
          <div>
            <p className="hearthstone-workshop__eyebrow">Atelier de mise en carte</p>
            <h1>Impression Hearthstone</h1>
            <p>
              Composez une carte, choisissez la gemme requise par l'effet, puis ajustez les trois phases de fabrication
              pour atteindre la resonance cible.
            </p>
          </div>
          <Link className="hearthstone-workshop__home" to="/" aria-label="Retour a l'accueil">
            <Home size={20} />
          </Link>
        </header>

        <div className="hearthstone-workshop__layout">
          <section className="hearthstone-panel hearthstone-panel--forge" aria-labelledby="card-setup-title">
            <div className="hearthstone-panel__title">
              <WandSparkles size={20} />
              <h2 id="card-setup-title">Carte</h2>
            </div>

            <label>
              Nom
              <input value={cardName} onChange={(event) => setCardName(event.target.value)} />
            </label>

            <label>
              Illustration
              <input value={illustration} onChange={(event) => setIllustration(event.target.value)} />
            </label>

            <div className="hearthstone-workshop__stats">
              <label>
                Attaque
                <input
                  min="0"
                  type="number"
                  value={attack}
                  onChange={(event) => setAttack(Number(event.target.value))}
                />
              </label>
              <label>
                Vie
                <input
                  min="1"
                  type="number"
                  value={health}
                  onChange={(event) => setHealth(Number(event.target.value))}
                />
              </label>
            </div>

            <label>
              Effet
              <textarea value={effectText} onChange={(event) => setEffectText(event.target.value)} />
            </label>

            <label>
              Puissance de l'effet
              <select value={effectPower} onChange={(event) => setEffectPower(event.target.value as GemColor)}>
                {effectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - gemme {gemRules[option.value].label}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="hearthstone-card-preview" aria-label="Apercu de la carte">
            <div className={`hearthstone-card-preview__gem hearthstone-card-preview__gem--${effectPower}`} />
            <div className="hearthstone-card-preview__image">
              <img src={illustration} alt="" />
            </div>
            <div className="hearthstone-card-preview__body">
              <h2>{cardName || "Carte sans nom"}</h2>
              <p>{effectText || "Aucun effet inscrit."}</p>
            </div>
            <div className="hearthstone-card-preview__stats">
              <span>{attack}</span>
              <span>{health}</span>
            </div>
          </section>
        </div>

        <section className="hearthstone-panel" aria-labelledby="phases-title">
          <div className="hearthstone-panel__title">
            <Sparkles size={20} />
            <h2 id="phases-title">Phases</h2>
          </div>

          <div className="hearthstone-phases">
            {(Object.keys(phaseMeta) as PhaseKey[]).map((key) => {
              const meta = phaseMeta[key];
              const phase = phases[key];
              const score = phaseScores.find((phaseScore) => phaseScore.key === key);
              const Icon = meta.icon;

              return (
                <article className="hearthstone-phase" key={key}>
                  <div className="hearthstone-phase__header">
                    <Icon size={19} />
                    <div>
                      <h3>{meta.label}</h3>
                      <p>{meta.skill}</p>
                    </div>
                  </div>

                  <label>
                    Posture
                    <select
                      value={phase.posture}
                      onChange={(event) => updatePhase(key, "posture", event.target.value as Posture)}
                    >
                      {(Object.keys(postureLabels) as Posture[]).map((posture) => (
                        <option key={posture} value={posture}>
                          {postureLabels[posture]}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Jet de phase
                    <input
                      max="6"
                      min="1"
                      type="number"
                      value={phase.roll}
                      onChange={(event) => updatePhase(key, "roll", Number(event.target.value))}
                    />
                  </label>

                  <label className="hearthstone-check">
                    <input
                      checked={phase.trained}
                      type="checkbox"
                      onChange={(event) => updatePhase(key, "trained", event.target.checked)}
                    />
                    Competence maitrisee
                  </label>

                  <label>
                    Retouche
                    <select
                      disabled={!phase.trained}
                      value={phase.trained ? phase.retouch : 0}
                      onChange={(event) => updatePhase(key, "retouch", Number(event.target.value) as Retouch)}
                    >
                      <option value={-1}>-1</option>
                      <option value={0}>0</option>
                      <option value={1}>+1</option>
                    </select>
                  </label>

                  <label>
                    Pince d'inhibition
                    <select
                      value={phase.inhibition}
                      onChange={(event) => updatePhase(key, "inhibition", event.target.value as InhibitionMode)}
                    >
                      <option value="none">Inactive</option>
                      <option value="double">Doubler</option>
                      <option value="half">Diviser par 2</option>
                    </select>
                  </label>

                  <p className="hearthstone-phase__score">
                    Score: <strong>{score?.finalScore ?? 0}</strong>
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="hearthstone-panel" aria-labelledby="tools-title">
          <div className="hearthstone-panel__title">
            <Gem size={20} />
            <h2 id="tools-title">Outils</h2>
          </div>

          <div className="hearthstone-tools">
            <label className="hearthstone-check">
              <input checked={slowBrush} type="checkbox" onChange={(event) => setSlowBrush(event.target.checked)} />
              Pinceau a diffusion lente
            </label>

            <label className="hearthstone-check hearthstone-check--nested">
              <input
                checked={useGemReroll}
                disabled={!slowBrush}
                type="checkbox"
                onChange={(event) => setUseGemReroll(event.target.checked)}
              />
              Utiliser la relance de Gemme
            </label>

            <label>
              Jet relance
              <input
                disabled={!slowBrush || !useGemReroll}
                max="6"
                min="1"
                type="number"
                value={gemReroll}
                onChange={(event) => setGemReroll(Number(event.target.value))}
              />
            </label>

            <label>
              Sphere de contenance
              <select value={sphereTarget} onChange={(event) => setSphereTarget(event.target.value as "none" | PhaseKey)}>
                <option value="none">Inactive</option>
                <option value="ink">Encre a 0</option>
                <option value="paint">Peinture a 0</option>
                <option value="gem">Gemme a 0</option>
              </select>
            </label>

            <label className="hearthstone-check">
              <input
                checked={chronosphere}
                type="checkbox"
                onChange={(event) => setChronosphere(event.target.checked)}
              />
              Chronosphere
            </label>

            <label>
              Essai
              <select
                disabled={!chronosphere}
                value={attempt}
                onChange={(event) => setAttempt(Number(event.target.value) as 1 | 2)}
              >
                <option value={1}>Premier</option>
                <option value={2}>Reprise</option>
              </select>
            </label>
          </div>
        </section>

        <section className="hearthstone-resolution" aria-labelledby="resolution-title">
          <div>
            <p className="hearthstone-resolution__label">Gemme requise</p>
            <h2 id="resolution-title">{gem.label}</h2>
            <p>{gem.description}</p>
          </div>

          <div className="hearthstone-resolution__numbers">
            <span>
              Cible
              <strong>{gem.target}</strong>
            </span>
            <span>
              Total
              <strong>{totalScore}</strong>
            </span>
          </div>

          <div className={`hearthstone-resolution__verdict hearthstone-resolution__verdict--${verdict.tone}`}>
            <h3>{verdict.title}</h3>
            <p>{verdict.text}</p>
          </div>

          <button className="hearthstone-resolution__reset" type="button" onClick={resetWorkshop}>
            <RotateCcw size={18} />
            Reinitialiser
          </button>
        </section>

        <section className="hearthstone-rules" aria-labelledby="rules-title">
          <h2 id="rules-title">Lecture des regles</h2>
          <div>
            <h3>Ce qui fonctionne deja</h3>
            <p>
              Les trois composants donnent une chaine artisanale claire, et les postures creent un vrai arbitrage entre
              precision et puissance. Les outils sont interessants parce qu'ils corrigent la trajectoire sans simplement
              donner un bonus plat.
            </p>
          </div>
          <div>
            <h3>Points a trancher</h3>
            <ul>
              <li>Definir si le score doit etre atteint exactement, depasse, ou rester dans une marge.</li>
              <li>Preciser la consequence d'un echec: perte des composants, carte instable, effet altere, ou rien.</li>
              <li>Limiter l'usage des outils par creation, surtout la Sphere et la Chronosphere.</li>
              <li>Dire si la Pince d'inhibition s'applique avant ou apres la retouche de competence.</li>
              <li>Donner un role mecanique aux statistiques de la carte, ou les separer totalement de l'effet.</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
