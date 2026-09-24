import { useState } from "react";
import type { JSX } from "react";
import { skillsData } from "../../datas/skills-data";
import { useTranslation } from "react-i18next";

function SkillsCard(): JSX.Element {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  const selectedCategory = skillsData[activeCategory];

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
              type="button"
              role="tab"
              aria-selected={index === activeCategory}
              onClick={() => setActiveCategory(index)}
            >
              {t(category)}
            </button>
          ))}
        </div>
        <SkillCategory title={selectedCategory.category} skills={selectedCategory.skills} />
      </div>
    </div>
  );
}

function SkillCategory({ title, skills }: { title: string; skills: { name: string; icon: JSX.Element }[] }) {
  const { t } = useTranslation();
  return (
    <section className="skill-category">
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
