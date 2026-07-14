import { createContext, useContext } from 'react';
import type { Project } from '../types/project';

export type LandingLink = {
  href: string;
  label: string;
};

export type LandingSectionId =
  | 'hero'
  | 'stats'
  | 'clients'
  | 'about'
  | 'services'
  | 'cms'
  | 'statement'
  | 'included'
  | 'process'
  | 'projects'
  | 'contact';

export type LandingCmsFeature = {
  icon?: string;
  title: string;
  desc: string;
};

export type LandingSectionLayout = {
  id: LandingSectionId;
  enabled?: boolean;
  navLabel?: string;
  navHref?: string;
};

export type LandingStat = {
  value: string;
  label: string;
};

export type LandingClientLogo = {
  name: string;
  src?: string;
  url?: string;
};

export type LandingService = {
  title: string;
  desc: string;
  tag: string;
  audience: string;
};

export type LandingPillar = {
  icon?: string;
  title: string;
  desc: string;
};

export type LandingTeamMember = {
  name: string;
  role: string;
  bio: string;
};

export type LandingStep = {
  n: string;
  title: string;
  desc: string;
};

export type LandingConfig = {
  brandName?: string;
  layout?: {
    sections?: LandingSectionLayout[];
  };
  nav?: {
    links?: LandingLink[];
    ctaLabel?: string;
    ctaHref?: string;
  };
  hero?: {
    rotatingWords?: string[];
    titlePrefix?: string;
    titleSuffix?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    statusLabel?: string;
    techStack?: string[];
    backgroundImage?: string;
  };
  stats?: LandingStat[];
  about?: {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    microStats?: Array<{ k: string; v: string }>;
    pillars?: LandingPillar[];
    quote?: {
      text?: string;
      highlight?: string;
    };
  };
  services?:
    | LandingService[]
    | {
        sectionLabel?: string;
        titleTop?: string;
        titleHighlight?: string;
        description?: string;
        items?: LandingService[];
      };
  clients?: {
    sectionLabel?: string;
    title?: string;
    logos?: LandingClientLogo[];
  };
  team?: {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    members?: LandingTeamMember[];
  };
  process?: {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    steps?: LandingStep[];
  };
  cms?: {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    features?: LandingCmsFeature[];
    panelTitle?: string;
    panelSubtitle?: string;
    panelMetricLabel?: string;
    panelMetricValue?: string;
    panelEntities?: string[];
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  included?: {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    items?: LandingCmsFeature[];
  };
  projects?: {
    sectionLabel?: string;
    title?: string;
    titleHighlight?: string;
    description?: string;
    viewAllLabel?: string;
    viewAllHref?: string;
    featuredLimit?: number;
    cardCtaLabel?: string;
    emptyStateLabel?: string;
    pageLabel?: string;
    backToHomeLabel?: string;
    backToHomeHref?: string;
    pageTitle?: string;
    pageDescription?: string;
    pageFilters?: string[];
    pageEmptyStateLabel?: string;
    nextStepLabel?: string;
    nextStepTitleTop?: string;
    nextStepTitleHighlight?: string;
    pageCtaLabel?: string;
    pageCtaHref?: string;
  };
  contact?: {
    sectionLabel?: string;
    titleTop?: string;
    titleHighlight?: string;
    description?: string;
    whatsappNumber?: string;
    whatsappText?: string;
    email?: string;
    location?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaHref?: string;
    emailSubject?: string;
    emailBody?: string;
  };
  footer?: {
    socials?: Array<{ label: string; url: string }>;
    copyright?: string;
  };
};

type LandingDataValue = {
  config: LandingConfig;
  projects: Project[];
  isConfigReady: boolean;
  // false hasta que termina el primer fetch de proyectos (éxito o error).
  // Permite distinguir "cargando" de "genuinamente vacío" en las páginas.
  projectsReady: boolean;
};

const LandingDataContext = createContext<LandingDataValue | undefined>(undefined);

export function LandingDataProvider({
  value,
  children,
}: {
  value: LandingDataValue;
  children: React.ReactNode;
}) {
  return <LandingDataContext.Provider value={value}>{children}</LandingDataContext.Provider>;
}

export function useLandingData() {
  const context = useContext(LandingDataContext);
  if (!context) {
    throw new Error('useLandingData debe usarse dentro de LandingDataProvider');
  }

  return context;
}
