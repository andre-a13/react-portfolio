import {
  BadgeCheck,
  Blocks,
  BookOpenCheck,
  Braces,
  Cloud,
  Code2,
  GitBranch,
  LifeBuoy,
  Network,
  PanelsTopLeft,
  ServerCog,
  Share2,
  Workflow,
  Zap,
} from "lucide-react";

export const skillsData = [
  {
    category: "skills.categories.frontend",
    skills: [
      { name: "skills.items.react", icon: <PanelsTopLeft /> },
      { name: "skills.items.typescript", icon: <Braces /> },
      { name: "skills.items.javascript", icon: <Code2 /> },
      { name: "skills.items.web", icon: <Blocks /> },
    ],
  },
  {
    category: "skills.categories.microsoft",
    skills: [
      { name: "skills.items.sharepoint", icon: <Share2 /> },
      { name: "skills.items.spfx", icon: <PanelsTopLeft /> },
      { name: "skills.items.pnpjs", icon: <Code2 /> },
      { name: "skills.items.graph", icon: <Network /> },
    ],
  },
  {
    category: "skills.categories.cloud",
    skills: [
      { name: "skills.items.azure", icon: <Cloud /> },
      { name: "skills.items.azureDevOps", icon: <GitBranch /> },
      { name: "skills.items.powerAutomate", icon: <Workflow /> },
      { name: "skills.items.powerApps", icon: <Zap /> },
      { name: "skills.items.scaleway", icon: <ServerCog /> },
    ],
  },
  {
    category: "skills.categories.delivery",
    skills: [
      { name: "skills.items.rest", icon: <Network /> },
      { name: "skills.items.productOwner", icon: <BadgeCheck /> },
      { name: "skills.items.documentation", icon: <BookOpenCheck /> },
      { name: "skills.items.support", icon: <LifeBuoy /> },
    ],
  },
];
