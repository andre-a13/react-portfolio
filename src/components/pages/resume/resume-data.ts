export type ResumeVariant = 'microsoft' | 'full-stack';
export type ResumeLanguage = 'fr' | 'en';
export type ResumeIcon = 'platform' | 'code' | 'cloud' | 'workflow' | 'server' | 'database';

interface Expertise {
  icon: ResumeIcon;
  title: string;
  description: string;
  technologies: string[];
}

interface Experience {
  company: string;
  context: string;
  role: string;
  period: string;
  points: string[];
}

interface Project {
  icon: ResumeIcon;
  title: string;
  description: string;
  technologies: string[];
}

interface Resume {
  label: string;
  title: string;
  intro: string;
  positioning: string;
  expertise: Expertise[];
  complementary: string[];
  experiences: Experience[];
  projects: Project[];
}

export const contact = {
  name: 'Arnaud ANDRE',
  email: 'arnaud.a.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/arnaud-andre-356314177/',
  github: 'https://github.com/andre-a13',
};

export const certifications = [
  { code: 'AZ-204', name: 'Azure Developer Associate', kind: 'azure' },
  { code: 'AZ-900', name: 'Azure Fundamentals', kind: 'azure' },
  { code: 'AI-102', name: 'Azure AI Engineer Associate', kind: 'azure' },
  { code: 'PSPO I', name: 'Professional Scrum Product Owner I', kind: 'scrum' },
];

export const resumeLabels = {
  fr: {
    portfolio: 'Portfolio',
    resume: 'CV virtuel',
    chooseVersion: 'Orientation du CV',
    chooseLanguage: 'Langue du CV',
    copy: 'Copier le lien',
    copied: 'Lien copié',
    copyHelp: 'Copie ce lien pour partager cette version du CV.',
    copyError: 'La copie automatique est indisponible. Sélectionne et copie ce lien.',
    print: 'Imprimer',
    contact: 'Me contacter',
    location: 'Basé en France',
    remote: 'Télétravail en Europe',
    since: 'Développement web depuis 2019',
    b2b: 'Missions B2B',
    expertise: 'Domaines d’intervention',
    additional: 'Autres technologies et pratiques',
    experience: 'Parcours professionnel',
    certifications: 'Certifications',
    languages: 'Langues',
    french: 'Français',
    english: 'Anglais',
    german: 'Allemand',
    native: 'Langue maternelle',
    professional: 'Professionnel',
    projects: 'Projets sélectionnés',
    projectIntro: 'Des interfaces au service des usages.',
    contactTitle: 'Parlons de votre prochain projet.',
    contactText: 'Développement, conseil technique et collaboration avec vos équipes produit et métier.',
    iconLicense: 'Icônes Lucide · licence ISC',
    skip: 'Aller au contenu du CV',
    microsoft: 'Microsoft',
    fullStack: 'Front-end & cloud',
  },
  en: {
    portfolio: 'Portfolio',
    resume: 'Online résumé',
    chooseVersion: 'Résumé focus',
    chooseLanguage: 'Résumé language',
    copy: 'Copy link',
    copied: 'Link copied',
    copyHelp: 'Copy this link to share this version of the résumé.',
    copyError: 'Automatic copying is unavailable. Select and copy this link.',
    print: 'Print',
    contact: 'Get in touch',
    location: 'Based in France',
    remote: 'Remote across Europe',
    since: 'Building for the web since 2019',
    b2b: 'B2B engagements',
    expertise: 'Areas of expertise',
    additional: 'Other technologies and practices',
    experience: 'Professional experience',
    certifications: 'Certifications',
    languages: 'Languages',
    french: 'French',
    english: 'English',
    german: 'German',
    native: 'Native',
    professional: 'Professional',
    projects: 'Selected projects',
    projectIntro: 'Interfaces built around real needs.',
    contactTitle: 'Let’s talk about your next project.',
    contactText: 'Development, technical consulting and collaboration with your product and business teams.',
    iconLicense: 'Lucide icons · ISC licence',
    skip: 'Skip to résumé content',
    microsoft: 'Microsoft',
    fullStack: 'Front-end & cloud',
  },
} as const;

// Sources: Arnaud_ANDRE_CV_FR.pdf and Arnaud_ANDRE_CV_EN.pdf supplied by Arnaud.
// Dates come from the previously approved portfolio timeline.
// No fabricated metrics, proficiency ratings, client outcomes or project URLs.
export const resumes: Record<ResumeLanguage, Record<ResumeVariant, Resume>> = {
  fr: {
    microsoft: {
      label: 'Microsoft 365 · SharePoint · Azure',
      title: 'Développeur senior SharePoint, SPFx & Microsoft 365',
      intro: 'Je conçois des intranets, des portails métier et des interfaces sur mesure dans l’écosystème Microsoft. Responsable technique sur des projets complexes, je relie les besoins métier à des solutions utiles, maintenables et simples à utiliser.',
      positioning: 'Missions B2B à distance · SPFx & React',
      expertise: [
        { icon: 'platform', title: 'Microsoft 365 & SharePoint', description: 'Intranets et WebParts personnalisés, au-delà des interfaces SharePoint standard.', technologies: ['SharePoint', 'SPFx', 'React', 'TypeScript'] },
        { icon: 'workflow', title: 'Données & processus métier', description: 'Connexion des données et automatisation des usages RH et collaboratifs.', technologies: ['Microsoft Graph', 'API REST', 'PnPjs', 'Power Automate'] },
        { icon: 'cloud', title: 'Azure & mise en œuvre', description: 'Développement cloud, accompagnement des déploiements et transfert aux équipes internes.', technologies: ['Azure', 'Azure DevOps', 'Scaleway'] },
      ],
      complementary: ['Power Apps', 'Scaleway', 'Agile / Scrum', 'Documentation', 'Support utilisateur'],
      experiences: [
        { company: 'PwC', context: 'Conseil · Équipes internes et clients externes', role: 'Consultant en développement d’applications', period: 'Depuis août 2024', points: ['Développement de solutions SharePoint et intranet avec SPFx, React, Power Automate et Azure DevOps.', 'Création de composants sur mesure et amélioration d’un processus métier reposant sur Alteryx.', 'Conseil sur les choix techniques, la stratégie de réalisation, la documentation et les bonnes pratiques.'] },
        { company: 'WebexpR', context: 'Projets pour BNP Paribas', role: 'Responsable technique · Développeur full-stack', period: '2019 – juillet 2024', points: ['Pilotage du développement front-end et full-stack d’applications SharePoint avec SPFx, React et TypeScript.', 'Réalisation d’intranets, de portails métier et d’outils RH personnalisés, avec une attention portée aux usages.', 'Intégration de listes et bibliothèques via les API REST ; maintenance, assistance et transfert aux équipes internes.'] },
      ],
      projects: [
        { icon: 'platform', title: 'Intranets Microsoft 365', description: 'Des interfaces SharePoint personnalisées pour la communication interne et la collaboration, avec des composants réutilisables et une ergonomie adaptée.', technologies: ['SharePoint', 'SPFx', 'React'] },
        { icon: 'database', title: 'Outils RH & applications métier', description: 'Des modèles de données fondés sur des listes et des interfaces métier pour les équipes RH, accompagnés de documentation et de support utilisateur.', technologies: ['Microsoft 365', 'API REST', 'TypeScript'] },
      ],
    },
    'full-stack': {
      label: 'React · TypeScript · Cloud · Produit',
      title: 'Développeur senior front-end et cloud',
      intro: 'Développeur senior front-end et cloud, je transforme les besoins métier en applications web claires et fiables. Je relie interfaces, API et services cloud avec une attention constante à l’expérience utilisateur et à la qualité du code.',
      positioning: 'Missions B2B à distance · Front-end & cloud',
      expertise: [
        { icon: 'code', title: 'Interfaces modernes', description: 'Composants réutilisables et interfaces accessibles, pensés pour les utilisateurs.', technologies: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS / SCSS'] },
        { icon: 'server', title: 'API & projets full-stack', description: 'Intégration de services externes et back-end Python / FastAPI sur des projets personnels.', technologies: ['Python / FastAPI', 'API REST'] },
        { icon: 'cloud', title: 'Cloud & livraison', description: 'Déploiement d’applications web, résolution des problèmes et collaboration technique.', technologies: ['Azure', 'Azure DevOps', 'Scaleway'] },
      ],
      complementary: ['SharePoint', 'SPFx', 'PnPjs', 'Microsoft Graph', 'Power Automate', 'Power Apps', 'PSPO I'],
      experiences: [
        { company: 'PwC', context: 'Conseil · Applications d’entreprise', role: 'Consultant en développement d’applications', period: 'Depuis août 2024', points: ['Traduction des besoins métier en solutions techniques maintenables et en interfaces centrées sur les utilisateurs.', 'Développement React / SPFx, Power Automate et amélioration d’un processus métier fondé sur Alteryx.', 'Conseil aux équipes et aux clients sur les choix techniques, la mise en œuvre et la documentation.'] },
        { company: 'WebexpR', context: 'Projets pour BNP Paribas', role: 'Responsable technique · Développeur full-stack', period: '2019 – juillet 2024', points: ['Pilotage du développement d’applications web avec React, TypeScript et JavaScript dans des environnements Microsoft 365.', 'Conception d’interfaces pour les intranets, les portails métier et les outils RH ; intégration d’API REST et structuration des données.', 'Collaboration avec les équipes métier, maintenance des applications et accompagnement des déploiements.'] },
      ],
      projects: [
        { icon: 'server', title: 'Application TRPG', description: 'Une application personnelle associant une interface React / TypeScript et un back-end Python / FastAPI, avec intégration d’API et travail sur le déploiement.', technologies: ['React', 'TypeScript', 'Python', 'FastAPI'] },
        { icon: 'code', title: 'Portfolio web', description: 'Une présentation bilingue de mon parcours et de mes compétences, développée en React / TypeScript et déployée avec Azure Static Web Apps.', technologies: ['React', 'TypeScript', 'Azure Static Web Apps'] },
        { icon: 'platform', title: 'Interfaces & outils métier', description: 'Des intranets et des outils RH sur mesure, conçus autour des usages quotidiens, des données métier et de composants réutilisables.', technologies: ['React', 'SPFx', 'API REST'] },
      ],
    },
  },
  en: {
    microsoft: {
      label: 'Microsoft 365 · SharePoint · Azure',
      title: 'Senior SharePoint, SPFx & Microsoft 365 Developer',
      intro: 'I build intranets, business portals and custom interfaces in the Microsoft ecosystem. As a technical lead on complex projects, I connect business needs with useful, maintainable solutions that are easy to use.',
      positioning: 'Remote B2B engagements · SPFx & React',
      expertise: [
        { icon: 'platform', title: 'Microsoft 365 & SharePoint', description: 'Intranets and custom WebParts that extend the standard SharePoint experience.', technologies: ['SharePoint', 'SPFx', 'React', 'TypeScript'] },
        { icon: 'workflow', title: 'Business data & processes', description: 'Connecting data and automating HR and collaboration workflows.', technologies: ['Microsoft Graph', 'REST APIs', 'PnPjs', 'Power Automate'] },
        { icon: 'cloud', title: 'Azure & implementation', description: 'Cloud development, deployment support and handover to internal teams.', technologies: ['Azure', 'Azure DevOps', 'Scaleway'] },
      ],
      complementary: ['Power Apps', 'Scaleway', 'Agile / Scrum', 'Documentation', 'User support'],
      experiences: [
        { company: 'PwC', context: 'Consulting · Internal teams and external clients', role: 'Application Development Consultant', period: 'Since August 2024', points: ['Developing SharePoint and intranet solutions with SPFx, React, Power Automate and Azure DevOps.', 'Building custom components and improving an existing Alteryx-based business process.', 'Advising on technical choices, delivery strategy, documentation and best practices.'] },
        { company: 'WebexpR', context: 'Projects for BNP Paribas', role: 'Lead Developer · Full-Stack Developer', period: '2019 – July 2024', points: ['Leading front-end and full-stack development for SharePoint applications using SPFx, React and TypeScript.', 'Building custom intranets, business portals and HR tools with a focus on user needs.', 'Integrating lists and libraries through REST APIs; maintenance, support and handover to internal teams.'] },
      ],
      projects: [
        { icon: 'platform', title: 'Microsoft 365 intranets', description: 'Custom SharePoint interfaces for internal communication and collaboration, with reusable components and a tailored user experience.', technologies: ['SharePoint', 'SPFx', 'React'] },
        { icon: 'database', title: 'HR & business applications', description: 'List-based data models and business interfaces for HR teams, supported by documentation and user assistance.', technologies: ['Microsoft 365', 'REST APIs', 'TypeScript'] },
      ],
    },
    'full-stack': {
      label: 'React · TypeScript · Cloud · Product',
      title: 'Senior Front-end and Cloud Developer',
      intro: 'As a senior front-end and cloud developer, I turn business needs into clear, reliable web applications. I connect interfaces, APIs and cloud services with a consistent focus on user experience and code quality.',
      positioning: 'Remote B2B engagements · Front-end & cloud',
      expertise: [
        { icon: 'code', title: 'Modern interfaces', description: 'Reusable components and accessible interfaces designed around users.', technologies: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS / SCSS'] },
        { icon: 'server', title: 'APIs & full-stack projects', description: 'External service integration and Python / FastAPI back ends in personal projects.', technologies: ['Python / FastAPI', 'REST APIs'] },
        { icon: 'cloud', title: 'Cloud & delivery', description: 'Web application deployment, troubleshooting and technical collaboration.', technologies: ['Azure', 'Azure DevOps', 'Scaleway'] },
      ],
      complementary: ['SharePoint', 'SPFx', 'PnPjs', 'Microsoft Graph', 'Power Automate', 'Power Apps', 'PSPO I'],
      experiences: [
        { company: 'PwC', context: 'Consulting · Enterprise applications', role: 'Application Development Consultant', period: 'Since August 2024', points: ['Translating business needs into maintainable technical solutions and user-oriented interfaces.', 'Developing React / SPFx and Power Automate solutions, including improvements to an Alteryx-based business process.', 'Advising teams and clients on technical choices, implementation and documentation.'] },
        { company: 'WebexpR', context: 'Projects for BNP Paribas', role: 'Lead Developer · Full-Stack Developer', period: '2019 – July 2024', points: ['Leading web application development with React, TypeScript and JavaScript in Microsoft 365 environments.', 'Designing interfaces for intranets, business portals and HR tools; REST API integration and data modelling.', 'Collaborating with business teams, maintaining applications and supporting deployments.'] },
      ],
      projects: [
        { icon: 'server', title: 'TRPG application', description: 'A personal application combining a React / TypeScript interface with a Python / FastAPI back-end, including API integration and deployment work.', technologies: ['React', 'TypeScript', 'Python', 'FastAPI'] },
        { icon: 'code', title: 'Web portfolio', description: 'A bilingual presentation of my experience and skills, built with React / TypeScript and deployed with Azure Static Web Apps.', technologies: ['React', 'TypeScript', 'Azure Static Web Apps'] },
        { icon: 'platform', title: 'Business interfaces & tools', description: 'Custom intranets and HR tools built around everyday workflows, business data and reusable components.', technologies: ['React', 'SPFx', 'REST APIs'] },
      ],
    },
  },
};

export function resumePath(variant: ResumeVariant, language: ResumeLanguage) {
  return `/cv/${variant}?lang=${language}`;
}
