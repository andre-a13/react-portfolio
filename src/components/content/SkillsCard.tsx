import type { JSX } from "react";
import { skillsData } from "../../datas/skills-data";
import { useTranslation } from "react-i18next";

function SkillsCard(): JSX.Element {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {skillsData.map(({ category, skills }) => (
        <SkillCategory key={category} title={category} skills={skills} />
      ))}
    </div>
  );
}

function SkillCategory({ title, skills }: { title: string; skills: { name: string; icon: JSX.Element }[] }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">{t(title)}</h3>
      <ul className="flex flex-col gap-2 mb-[20px] md:mb-0">
        {skills.map(({ name, icon }) => (
          <li key={name} className="flex items-center gap-2 text-sm">
            <span className="w-5 h-5">{icon}</span>
            <span>{t(name)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SkillsCard;
