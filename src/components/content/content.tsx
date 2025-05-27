import { useEffect, useState } from "react";
import "../card/card.scss";
import Card from "../card/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProIntroCard from "./ProIntroCard";
import SkillsCard from "./SkillsCard";

const contentData = [
  {
    title: "Arnaud",
    subtitle: "Développeur Full Stack",
    children: <ProIntroCard />,
  },
  {
    title: "Compétences",
    subtitle: "Front-end / Back-end / Cloud",
    children: <SkillsCard />,
  },
  {
    title: "Expériences",
    subtitle: "Lead Developer chez WebexpR",
    content:
      "Gestion de projets SharePoint / Office 365 avec une équipe Agile, développement full stack, conseil clients.",
  },
  {
    title: "Contact",
    subtitle: "Restons en contact",
    content: "Email: arnaud.a.dev@gmail.com\nLinkedIn: linkedin.com/in/arnaud-andre",
  },
];

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
            <Card title={currentContent.title} subtitle={currentContent.subtitle} content={currentContent.content}>
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
