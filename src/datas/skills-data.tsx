import {
  Type,
  Code,
  Server,
  Database,
  Cloud,
  CloudCog,
  GitBranch,
  TerminalSquare,
  LayoutDashboard,
  MessageSquare,
  Users,
  Computer,
} from "lucide-react";
import ReactLogo from "../icons/ReactLogo";
import VueLogo from "../icons/VueLogo";
import AngularLogo from "../icons/AngularLogo";

export const skillsData = [
  {
    category: "Front-end",
    skills: [
      { name: "React", icon: <ReactLogo width={20} height={20} /> },
      { name: "Vue.js", icon: <VueLogo width={18} height={18} /> },
      { name: "Angular", icon: <AngularLogo width={18} height={18} /> },
      { name: "TypeScript", icon: <Type /> },
    ],
  },
  {
    category: "Back-end",
    skills: [
      { name: "Node.js", icon: <Server /> },
      { name: "PHP / Laravel", icon: <Code /> },
      { name: "PostgreSQL", icon: <Database /> },
      { name: "MongoDB", icon: <Database /> },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { name: "Azure (AZ-204 / AZ-900)", icon: <Cloud className="text-blue-600 scale-110" /> },
      { name: "Azure Functions", icon: <CloudCog /> },
      { name: "GitHub Actions", icon: <Computer /> },
      { name: "CI/CD", icon: <GitBranch /> },
    ],
  },
  {
    category: "Outils & Méthodologie",
    skills: [
      { name: "Git", icon: <GitBranch /> },
      { name: "Docker", icon: <TerminalSquare /> },
      { name: "Agile / Scrum", icon: <Users /> },
      { name: "TDD", icon: <Code /> },
    ],
  },
  {
    category: "Compétences transverses",
    skills: [
      { name: "UX Design", icon: <LayoutDashboard /> },
      { name: "Communication", icon: <MessageSquare /> },
      { name: "Mentorat", icon: <Users /> },
    ],
  },
];
