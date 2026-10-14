export type CaseStudyLanguage = 'fr' | 'en';

// Confirmed directly by Arnaud. The employer, exact dates, euro budget and
// quantified impact of this project were not confirmed and are not inferred.
export const hrCaseStudy = {
  fr: {
    eyebrow: 'Étude de cas · Secteur bancaire',
    title: 'Gestion des commissions RH',
    summary: 'Une application pour préparer les dossiers, guider leur examen en commission et suivre les prochaines étapes jusqu’à l’archivage.',
    facts: [{ value: '9 mois', label: 'Durée du projet' }, { value: '3 personnes', label: 'Équipe, dont moi' }, { value: '2 développeurs', label: 'Encadrement technique' }],
    sections: [
      { title: 'Le besoin métier', text: 'Faciliter la préparation et le déroulement des commissions RH, avec une vision claire des dossiers, des pièces justificatives juridiques et des prochaines étapes.' },
      { title: 'Mon rôle dans la réalisation', text: 'J’assurais la conception, le développement et les revues de code, ainsi que l’encadrement technique de deux développeurs et la coordination du projet. Je définissais les priorités avec le client et coordonnais les délais avec l’équipe.' },
      { title: 'Suivi de la charge et des échéances', text: 'Je suivais la consommation des jours-homme par rapport à l’enveloppe prévue. Trello et Linear servaient au suivi du travail et des priorités.' },
      { title: 'La solution livrée', text: 'L’interface React couvre la préparation des dossiers, la planification des étapes suivantes, la consultation des pièces justificatives pendant la commission et l’archivage. SharePoint sert au stockage actif et Azure au stockage à froid. Les déploiements passent par des pipelines Azure DevOps.' },
      { title: 'Une décision sur le parcours utilisateur', text: 'À l’approche de la livraison, j’ai proposé de revoir une fonctionnalité clé pour mieux guider l’utilisateur. Après validation avec l’UX designer et la partie prenante métier, j’ai transformé l’affichage et ajouté une étape de validation au workflow.' },
      { title: 'Mise en service et retours utilisateurs', text: 'L’application est utilisée en conditions réelles. Le jour de la commission, j’ai assuré un accompagnement sur site, entièrement disponible pour intervenir en cas d’incident critique. Les retours recueillis pendant l’hypercare ont conduit à des ajustements ciblés pour clarifier certains éléments et améliorer la lisibilité.' },
    ],
    engineering: 'Conception et développement React, encadrement technique de deux développeurs, revues de code et déploiement via Azure DevOps. Stockage actif SharePoint et stockage à froid Azure.',
    management: 'Coordination d’une équipe de trois personnes sur neuf mois : priorités avec le client, échéances avec l’équipe et suivi des jours-homme. Évolution du workflow validée avec l’UX et le métier, puis accompagnement sur site pendant la commission.',
    read: 'Découvrir le projet',
    back: 'Retour au portfolio',
    contact: 'Échanger sur une opportunité',
    technologiesLabel: 'Technologies et outils',
    engineeringLabel: 'Ingénierie logicielle',
    managementLabel: 'Gestion de projet technique',
  },
  en: {
    eyebrow: 'Case study · Banking sector',
    title: 'HR committee case management',
    summary: 'An application to prepare case files, guide their review in committee meetings and track next steps through to archiving.',
    facts: [{ value: '9 months', label: 'Project duration' }, { value: '3 people', label: 'Team, including me' }, { value: '2 developers', label: 'Technical supervision' }],
    sections: [
      { title: 'The business need', text: 'Support the preparation and running of HR committee meetings, providing a clear view of case files, legal supporting documents and next steps.' },
      { title: 'My delivery responsibilities', text: 'I contributed to design, development and code reviews, provided technical supervision for two developers and coordinated delivery. I agreed priorities with the client and coordinated deadlines with the team.' },
      { title: 'Effort and schedule tracking', text: 'I tracked person-days consumed against the planned allocation. Trello and Linear supported work and priority tracking.' },
      { title: 'The delivered solution', text: 'The React interface supports case preparation, scheduling next steps, consulting supporting documents during committee meetings and archiving. SharePoint provides active storage and Azure provides cold storage. Deployments use Azure DevOps pipelines.' },
      { title: 'A user journey decision', text: 'Shortly before delivery, I proposed revisiting a key feature to guide users more clearly. Following validation with the UX designer and business stakeholder, I changed the display and added a validation step to the workflow.' },
      { title: 'Launch and user feedback', text: 'The application is in use. On the day of the committee meeting, I provided on-site support with my full availability dedicated to responding to any critical incident. Feedback collected during hypercare led to targeted changes to clarify the interface and improve readability.' },
    ],
    engineering: 'React design and development, technical supervision of two developers, code reviews and deployment through Azure DevOps. SharePoint active storage and Azure cold storage.',
    management: 'Coordination of a three-person team over nine months: client priorities, team deadlines and person-day tracking. Workflow changes validated with UX and business stakeholders, followed by on-site support during the committee meeting.',
    read: 'Explore the project',
    back: 'Back to portfolio',
    contact: 'Discuss an opportunity',
    technologiesLabel: 'Technologies and tools',
    engineeringLabel: 'Software engineering',
    managementLabel: 'Technical project management',
  },
};

export const hrTechnologies = ['React', 'SharePoint', 'Azure', 'Azure DevOps', 'Trello', 'Linear'];
export const hrCaseStudyPath = (language: CaseStudyLanguage) => `/projects/hr-commissions?lang=${language}`;
