import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../card/card";
import "../card/card.scss";
import ExpCard from "./ExpCard";
import ProIntroCard from "./ProIntroCard";
import SkillsCard from "./SkillsCard";
import ExpCard2 from "./ExpCard2";
import ContactCard from "./ContactCard";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: "absolute" as const,
  }),
};

const Content = () => {
  const { t } = useTranslation();
  const contentData = [
    {
      title: t("content.title"),
      subtitle: t("content.subtitle"),
      children: <ProIntroCard />,
    },
    {
      title: t("skills.title"),
      subtitle: t("skills.subtitle"),
      children: <SkillsCard />,
    },
    {
      title: t("content.experience.title"),
      subtitle: `${t("experiences.webexpr.period")} · ${t("experiences.webexpr.contract")} · ${t(
        "experiences.webexpr.location"
      )}`,
      children: <ExpCard />,
    },
    {
      title: t("content.experience.title"),
      subtitle: `${t("experiences.pwc.period")} · ${t("experiences.pwc.contract")} · ${t("experiences.pwc.location")}`,
      children: <ExpCard2 />,
    },
    {
      title: t("content.contact.title"),
      subtitle: t("content.contact.subtitle"),
      children: <ContactCard />,
    },
  ];

  const [[currentIndex, direction], setState] = useState<[number, number]>([0, 0]);

  const paginate = (dir: number) => {
    const newIndex = currentIndex + dir;
    if (newIndex >= 0 && newIndex < contentData.length) {
      setState([newIndex, dir]);
    }
  };

  const currentContent = contentData[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") paginate(-1);
      if (event.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="relative">
      <div className="relative overflow-hidden card-container" role="main">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="w-full h-full overflow-hidden"

          >
            <Card title={currentContent.title} subtitle={currentContent.subtitle}>
              {currentContent.children}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flèches positionnées en-dehors du container overflow-hidden */}
      {currentIndex > 0 && (
        <button aria-label="Précédent" className="nav-button nav-prev" onClick={() => paginate(-1)}>
          <ChevronLeft size={24} />
        </button>
      )}
      {currentIndex < contentData.length - 1 && (
        <button aria-label="Suivant" className="nav-button nav-next" onClick={() => paginate(1)}>
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default Content;
