import {
  BriefcaseBusiness,
  FileUser,
  Mail,
  MessageSquareText,
  UserRound,
  Wrench,
} from "lucide-react";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import SkillsCard from "./SkillsCard";

type ChapterId = "profile" | "skills" | "experience" | "contact";

type ContentProps = {
  onOpenChat: (trigger: HTMLButtonElement) => void;
};

const CHAPTERS = [
  { id: "profile" as const, icon: UserRound },
  { id: "skills" as const, icon: Wrench },
  { id: "experience" as const, icon: BriefcaseBusiness },
  { id: "contact" as const, icon: Mail },
];

function translatedList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

const EXPERIENCE_IDS = ["pwc", "webexpr"] as const;
const PROJECT_IDS = ["intranet", "hrTools", "alteryx", "trpg", "portfolioAssistant"] as const;

type ExperienceId = (typeof EXPERIENCE_IDS)[number];
type ProjectId = (typeof PROJECT_IDS)[number];

const PERSONAL_PROJECT_IDS: readonly ProjectId[] = ["trpg", "portfolioAssistant"];

function handleRovingTabKey<T extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  items: readonly T[],
  activeItem: T,
  onSelect: (item: T) => void,
  refs: Array<HTMLButtonElement | null>,
) {
  const activeIndex = items.indexOf(activeItem);
  let nextIndex: number | undefined;

  if (["ArrowRight", "ArrowDown"].includes(event.key)) {
    nextIndex = (activeIndex + 1) % items.length;
  }
  if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
    nextIndex = (activeIndex - 1 + items.length) % items.length;
  }
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = items.length - 1;
  if (nextIndex === undefined) return;

  event.preventDefault();
  onSelect(items[nextIndex]);
  refs[nextIndex]?.focus();
}

function ExperienceChapter() {
  const { t } = useTranslation();
  const [activeExperience, setActiveExperience] = useState<ExperienceId>("pwc");
  const [activeProject, setActiveProject] = useState<ProjectId>("intranet");
  const experienceTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const projectTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const points = translatedList(
    t(`portfolio.experience.${activeExperience}.points`, { returnObjects: true }),
  );
  const technologies = translatedList(
    t(`portfolio.experience.projects.${activeProject}.technologies`, { returnObjects: true }),
  );
  const projectKind = PERSONAL_PROJECT_IDS.includes(activeProject) ? "personal" : "professional";

  return (
    <div className="portfolio-chapter portfolio-chapter--experience">
      <div className="portfolio-chapter__heading">
        <h1>{t("portfolio.experience.title")}</h1>
        <p>{t("portfolio.experience.intro")}</p>
      </div>

      <div className="experience-switch" role="tablist" aria-label={t("portfolio.experience.selectorLabel")}>
        {EXPERIENCE_IDS.map((experience, index) => (
          <button
            key={experience}
            id={`experience-tab-${experience}`}
            ref={(element) => {
              experienceTabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-controls="experience-panel"
            aria-selected={activeExperience === experience}
            tabIndex={activeExperience === experience ? 0 : -1}
            onClick={() => setActiveExperience(experience)}
            onKeyDown={(event) =>
              handleRovingTabKey(
                event,
                EXPERIENCE_IDS,
                activeExperience,
                setActiveExperience,
                experienceTabRefs.current,
              )
            }
          >
            {t(`portfolio.experience.${experience}.shortTitle`)}
          </button>
        ))}
      </div>

      <article
        id="experience-panel"
        className="experience-summary"
        role="tabpanel"
        aria-labelledby={`experience-tab-${activeExperience}`}
      >
        <div className="experience-summary__meta">
          <h2>{t(`portfolio.experience.${activeExperience}.title`)}</h2>
          <p>{t(`portfolio.experience.${activeExperience}.period`)}</p>
        </div>
        <ul>
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </article>

      <section className="project-highlights" aria-labelledby="project-highlights-title">
        <div className="project-highlights__heading">
          <h2 id="project-highlights-title">{t("portfolio.experience.projects.title")}</h2>
          <p>{t("portfolio.experience.projects.intro")}</p>
        </div>

        <div
          className="project-switch"
          role="tablist"
          aria-label={t("portfolio.experience.projects.selectorLabel")}
        >
          {PROJECT_IDS.map((project, index) => (
            <button
              key={project}
              id={`project-tab-${project}`}
              ref={(element) => {
                projectTabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-controls="project-panel"
              aria-selected={activeProject === project}
              tabIndex={activeProject === project ? 0 : -1}
              onClick={() => setActiveProject(project)}
              onKeyDown={(event) =>
                handleRovingTabKey(
                  event,
                  PROJECT_IDS,
                  activeProject,
                  setActiveProject,
                  projectTabRefs.current,
                )
              }
            >
              {t(`portfolio.experience.projects.${project}.shortTitle`)}
            </button>
          ))}
        </div>

        <article
          id="project-panel"
          className="project-summary"
          role="tabpanel"
          aria-labelledby={`project-tab-${activeProject}`}
        >
          <div className="project-summary__meta">
            <div>
              <span>{t(`portfolio.experience.projects.kinds.${projectKind}`)}</span>
              <h3>{t(`portfolio.experience.projects.${activeProject}.title`)}</h3>
            </div>
            <p>{t(`portfolio.experience.projects.${activeProject}.context`)}</p>
          </div>
          <p className="project-summary__description">
            {t(`portfolio.experience.projects.${activeProject}.description`)}
          </p>
          <ul className="project-summary__technologies" aria-label={t("portfolio.experience.projects.technologiesLabel")}>
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

function Content({ onOpenChat }: ContentProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith("en") ? "en" : "fr";
  const [activeChapter, setActiveChapter] = useState<ChapterId>("profile");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = CHAPTERS.findIndex((chapter) => chapter.id === activeChapter);

  function selectChapter(index: number) {
    const chapter = CHAPTERS[index];
    if (!chapter) return;
    setActiveChapter(chapter.id);
    tabRefs.current[index]?.focus();
  }

  function handleChapterKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      selectChapter((activeIndex + 1) % CHAPTERS.length);
    }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      selectChapter((activeIndex - 1 + CHAPTERS.length) % CHAPTERS.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectChapter(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectChapter(CHAPTERS.length - 1);
    }
  }

  function renderActiveChapter() {
    if (activeChapter === "skills") {
      return (
        <div className="portfolio-chapter portfolio-chapter--skills">
          <div className="portfolio-chapter__heading">
            <h1>{t("portfolio.skills.title")}</h1>
            <p>{t("portfolio.skills.intro")}</p>
          </div>
          <SkillsCard />
        </div>
      );
    }

    if (activeChapter === "experience") return <ExperienceChapter />;

    if (activeChapter === "contact") {
      return (
        <div className="portfolio-chapter portfolio-chapter--contact">
          <div className="portfolio-chapter__heading">
            <h1>{t("portfolio.contact.title")}</h1>
            <p>{t("portfolio.contact.intro")}</p>
          </div>
          <div className="contact-options">
            <a href="mailto:arnaud.a.dev@gmail.com">
              <Mail size={20} aria-hidden="true" />
              <span>
                <strong>{t("portfolio.contact.emailLabel")}</strong>
                arnaud.a.dev@gmail.com
              </span>
            </a>
            <a href="https://linkedin.com/in/arnaud-andre-356314177" target="_blank" rel="noreferrer">
              <MessageSquareText size={20} aria-hidden="true" />
              <span>
                <strong>LinkedIn</strong>
                {t("portfolio.contact.linkedinLabel")}
              </span>
            </a>
          </div>
          <p className="contact-mobility">{t("portfolio.contact.mobility")}</p>
          <button className="portfolio-action" type="button" onClick={(event) => onOpenChat(event.currentTarget)}>
            {t("portfolio.actions.ask")}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      );
    }

    const facts = translatedList(t("portfolio.profile.facts", { returnObjects: true }));
    return (
      <div className="portfolio-chapter portfolio-chapter--profile">
        <div className="profile-title">
          <p>{t("portfolio.profile.name")}</p>
          <h1>{t("portfolio.profile.role")}</h1>
        </div>
        <p className="profile-intro">{t("portfolio.profile.intro")}</p>
        <ul className="profile-facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <div className="portfolio-actions">
          <button className="portfolio-action" type="button" onClick={(event) => onOpenChat(event.currentTarget)}>
            {t("portfolio.actions.ask")}
            <span aria-hidden="true">→</span>
          </button>
          <Link className="portfolio-text-action" to={`/cv/full-stack?lang=${language}`}>
            <FileUser size={18} aria-hidden="true" />
            {t("portfolio.actions.resume")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-dossier">
      <nav className="chapter-navigation" aria-label={t("portfolio.navigationLabel")}>
        {CHAPTERS.map(({ id, icon: Icon }, index) => (
          <button
            key={id}
            id={`chapter-tab-${id}`}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-controls="portfolio-chapter-panel"
            aria-selected={activeChapter === id}
            tabIndex={activeChapter === id ? 0 : -1}
            onClick={() => setActiveChapter(id)}
            onKeyDown={handleChapterKeyDown}
          >
            <span className="chapter-navigation__index">0{index + 1}</span>
            <Icon size={18} aria-hidden="true" />
            <span>{t(`portfolio.chapters.${id}`)}</span>
          </button>
        ))}
      </nav>

      <section
        key={activeChapter}
        id="portfolio-chapter-panel"
        className="chapter-panel"
        role="tabpanel"
        aria-labelledby={`chapter-tab-${activeChapter}`}
        tabIndex={0}
      >
        {renderActiveChapter()}
      </section>
    </div>
  );
}

export default Content;
