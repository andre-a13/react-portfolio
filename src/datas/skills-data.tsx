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
    category: "skills.categories.frontend",
    skills: [
      { name: "skills.items.react", icon: <ReactLogo width={20} height={20} /> },
      { name: "skills.items.vue", icon: <VueLogo width={18} height={18} /> },
      { name: "skills.items.angular", icon: <AngularLogo width={18} height={18} /> },
      { name: "skills.items.typescript", icon: <Type /> },
    ],
  },
  {
    category: "skills.categories.backend",
    skills: [
      { name: "skills.items.node", icon: <Server /> },
      { name: "skills.items.php", icon: <Code /> },
      { name: "skills.items.postgresql", icon: <Database /> },
      { name: "skills.items.mongodb", icon: <Database /> },
    ],
  },
  {
    category: "skills.categories.cloud",
    skills: [
      { name: "skills.items.azure", icon: <Cloud className="text-blue-600 scale-110" /> },
      { name: "skills.items.azureFunctions", icon: <CloudCog /> },
      { name: "skills.items.githubActions", icon: <Computer /> },
      { name: "skills.items.cicd", icon: <GitBranch /> },
    ],
  },
  {
    category: "skills.categories.tools",
    skills: [
      { name: "skills.items.git", icon: <GitBranch /> },
      { name: "skills.items.docker", icon: <TerminalSquare /> },
      { name: "skills.items.agile", icon: <Users /> },
      { name: "skills.items.tdd", icon: <Code /> },
    ],
  },
  {
    category: "skills.categories.soft",
    skills: [
      { name: "skills.items.ux", icon: <LayoutDashboard /> },
      { name: "skills.items.communication", icon: <MessageSquare /> },
      { name: "skills.items.mentoring", icon: <Users /> },
    ],
  },
];