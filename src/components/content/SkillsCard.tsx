import { useRef, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { skillsData } from "../../datas/skills-data";
import { useTranslation } from "react-i18next";
import { trackAnalyticsEvent, type AnalyticsItem } from "../../services/analytics.service";

const ANALYTICS_SKILL_IDS: AnalyticsItem[] = [
  "frontend",
  "microsoft",
  "cloud",
  "delivery",
  "collaboration",
];

function SkillsCard(): JSX.Element {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedCategory = skillsData[activeCategory];

  function selectCategory(index: number) {
    const normalizedIndex = (index + skillsData.length) % skillsData.length;
    setActiveCategory(normalizedIndex);
    trackAnalyticsEvent("skill_selected", { item: ANALYTICS_SKILL_IDS[normalizedIndex] });
    tabRefs.current[normalizedIndex]?.focus();
  }

  function handleCategoryKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      selectCategory(activeCategory + 1);
    }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      selectCategory(activeCategory - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectCategory(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectCategory(skillsData.length - 1);
    }
  }

  return (
    <div className="skills-overview">
      <div className="skills-overview__desktop">
        {skillsData.map(({ category, skills }) => (
          <SkillCategory key={category} title={category} skills={skills} />
        ))}
      </div>

      <div className="skills-overview__mobile">
        <div className="skills-category-selector" role="tablist" aria-label={t("portfolio.skills.selectorLabel")}>
          {skillsData.map(({ category }, index) => (
            <button
              key={category}
              id={`skills-category-tab-${index}`}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-controls="skills-category-panel"
              aria-selected={index === activeCategory}
              tabIndex={index === activeCategory ? 0 : -1}
              onClick={() => selectCategory(index)}
              onKeyDown={handleCategoryKeyDown}
            >
              {t(category)}
            </button>
          ))}
        </div>
        <SkillCategory
          id="skills-category-panel"
          labelledBy={`skills-category-tab-${activeCategory}`}
          title={selectedCategory.category}
          skills={selectedCategory.skills}
        />
      </div>
    </div>
  );
}

function SkillCategory({
  id,
  labelledBy,
  title,
  skills,
}: {
  id?: string;
  labelledBy?: string;
  title: string;
  skills: { name: string; icon: JSX.Element }[];
}) {
  const { t } = useTranslation();
  return (
    <section
      id={id}
      className="skill-category"
      role={labelledBy ? "tabpanel" : undefined}
      aria-labelledby={labelledBy}
    >
      <h2>{t(title)}</h2>
      <ul>
        {skills.map(({ name, icon }) => (
          <li key={name}>
            <span className="skill-category__icon" aria-hidden="true">
              {icon}
            </span>
            <span>{t(name)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SkillsCard;
