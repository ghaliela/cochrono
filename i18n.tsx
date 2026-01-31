import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface Translations {
  appName: string;
  addEvent: string;
  viewing: string;
  level: string;
  epoch: string;
  allHistory: string;
  millennium: string;
  century: string;
  decade: string;
  year: string;
  bc: string;
  ad: string;
  events: string;
  moreEvents: string;
  noEvents: string;
  footer: string;
  months: string[];
  modal: {
    close: string;
    readArticle: string;
    historicalContext: string;
    ancientEra: string;
    medievalPeriod: string;
    modernEra: string;
    history: string;
    contextText: (era: string, category: string) => string;
  };
  addModal: {
    title: string;
    eventTitle: string;
    year: string;
    month: string;
    none: string;
    category: string;
    description: string;
    referenceLink: string;
    submit: string;
    bcBtn: string;
    adBtn: string;
    placeholders: {
      title: string;
      year: string;
      desc: string;
      link: string;
    };
    categories: {
      general: string;
      war: string;
      politics: string;
      science: string;
      art: string;
      religion: string;
    };
  };
}

const en: Translations = {
  appName: "ChronoStream",
  addEvent: "Add Event",
  viewing: "Viewing",
  level: "Level",
  epoch: "Epoch",
  allHistory: "All History",
  millennium: "Millennium",
  century: "Century",
  decade: "Decade",
  year: "Year",
  bc: "BC",
  ad: "AD",
  events: "Events",
  moreEvents: "more events",
  noEvents: "No significant events recorded",
  footer: "ChronoStream. A historical visualization tool.",
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  modal: {
    close: "Close",
    readArticle: "Read Article",
    historicalContext: "Historical Context",
    ancientEra: "Ancient Era",
    medievalPeriod: "Medieval Period",
    modernEra: "Modern Era",
    history: "History",
    contextText: (era, cat) => `This event occurred during the ${era}. It fits broadly into the category of ${cat}.`
  },
  addModal: {
    title: "Add Historical Event",
    eventTitle: "Event Title",
    year: "Year",
    month: "Month (Opt)",
    none: "None",
    category: "Category",
    description: "Description",
    referenceLink: "Reference Link (Opt)",
    submit: "Add Event",
    bcBtn: "BC",
    adBtn: "AD",
    placeholders: {
      title: "e.g. Discovery of Fire",
      year: "2024",
      desc: "Brief summary of the event...",
      link: "https://wikipedia.org/..."
    },
    categories: {
      general: "General",
      war: "War & Conflict",
      politics: "Politics & Leaders",
      science: "Science & Tech",
      art: "Art & Culture",
      religion: "Religion"
    }
  }
};

const fr: Translations = {
  appName: "ChronoStream",
  addEvent: "Ajouter",
  viewing: "Vue",
  level: "Niveau",
  epoch: "Époque",
  allHistory: "Toute l'Histoire",
  millennium: "Millénaire",
  century: "Siècle",
  decade: "Décennie",
  year: "Année",
  bc: "av. J.-C.",
  ad: "ap. J.-C.",
  events: "Événements",
  moreEvents: "autres",
  noEvents: "Aucun événement majeur",
  footer: "ChronoStream. Un outil de visualisation historique.",
  months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  modal: {
    close: "Fermer",
    readArticle: "Lire l'article",
    historicalContext: "Contexte Historique",
    ancientEra: "l'Ère Antique",
    medievalPeriod: "la Période Médiévale",
    modernEra: "l'Ère Moderne",
    history: "Histoire",
    contextText: (era, cat) => `Cet événement a eu lieu pendant ${era}. Il appartient à la catégorie : ${cat}.`
  },
  addModal: {
    title: "Ajouter un événement",
    eventTitle: "Titre",
    year: "Année",
    month: "Mois (Opt)",
    none: "Aucun",
    category: "Catégorie",
    description: "Description",
    referenceLink: "Lien (Opt)",
    submit: "Ajouter",
    bcBtn: "av. JC",
    adBtn: "ap. JC",
    placeholders: {
      title: "ex. Découverte du feu",
      year: "2024",
      desc: "Bref résumé...",
      link: "https://wikipedia.org/..."
    },
    categories: {
      general: "Général",
      war: "Guerre et Conflits",
      politics: "Politique",
      science: "Science et Tech",
      art: "Art et Culture",
      religion: "Religion"
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    t: language === 'en' ? en : fr
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
