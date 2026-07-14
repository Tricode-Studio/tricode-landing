import { Fragment, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import ClientLogos from './components/ClientLogos';
import AboutTeaser from './components/AboutTeaser';
import Services from './components/Services';
import Cms from './components/Cms';
import Statement from './components/Statement';
import Included from './components/Included';
import Process from './components/Process';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import NosotrosPage from './components/NosotrosPage';
import BriefPage from './components/BriefPage';
import ThemeTransition from './components/ThemeTransition';
import { useReveal } from './hooks/useReveal';
import { useLenis } from './hooks/useLenis';
import type { Project } from './types/project';
import {
  LandingDataProvider,
  type LandingConfig,
  type LandingSectionId,
} from './content/LandingDataContext';
import { withLandingDefaults } from './content/defaultLandingConfig';
import { fetchCmsProjects } from './lib/cms';
import { resolveEnabledSectionOrder } from './lib/sections';
import { applyLandingSeo } from './lib/seo';
import { initAnalytics, trackPageview } from './lib/analytics';

function getRoute() {
  const hashRoute = window.location.hash.replace(/^#/, '');
  if (hashRoute.startsWith('/')) {
    return hashRoute.replace(/\/+$/, '') || '/';
  }

  const path = window.location.pathname.replace(/\/+$/, '');
  // /proyectos y /proyectos/<slug> (se preserva el slug para el detalle).
  if (path.startsWith('/proyectos')) {
    return path || '/proyectos';
  }
  if (path.startsWith('/nosotros')) {
    return '/nosotros';
  }
  if (path.startsWith('/brief')) {
    return '/brief';
  }

  return '/';
}

function Home({ sectionOrder }: { sectionOrder: LandingSectionId[] }) {
  useReveal();
  useLenis();

  const sectionMap: Record<LandingSectionId, JSX.Element> = {
    hero: <Hero />,
    stats: <Stats />,
    clients: <ClientLogos />,
    about: <AboutTeaser />,
    services: <Services />,
    cms: <Cms />,
    statement: <Statement />,
    included: <Included />,
    projects: <Projects />,
    process: <Process />,
    contact: <Contact />,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <main>
        {sectionOrder.map((sectionId) => (
          <Fragment key={sectionId}>{sectionMap[sectionId]}</Fragment>
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute());
  const [config] = useState<LandingConfig>(() => withLandingDefaults({}));
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsReady, setProjectsReady] = useState(false);
  const sectionOrder = resolveEnabledSectionOrder(config);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    const onPopState = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    let alive = true;

    // El copy/layout del sitio (nav, hero, secciones) vive 100% en
    // defaultLandingConfig.ts -- ya no se pisa con un landing-config remoto
    // del CMS. Solo los proyectos destacados siguen viniendo de ahí (son la
    // única pieza de contenido que se gestiona desde el workspace).
    const loadProjects = async () => {
      const result = await fetchCmsProjects().catch((error) => {
        console.error('No se pudieron cargar los proyectos destacados', error);
        return null;
      });

      if (!alive) return;
      setProjectsReady(true);
      if (!result) return;
      setProjects(result);
    };

    void loadProjects();
    const timer = window.setInterval(() => {
      void loadProjects();
    }, 45_000);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    applyLandingSeo(route, config, projects);
  }, [route, config, projects]);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageview(route);
  }, [route]);

  const projectDetailSlug = route.startsWith('/proyectos/')
    ? decodeURIComponent(route.slice('/proyectos/'.length))
    : '';

  let content: JSX.Element;
  if (projectDetailSlug) {
    content = <ProjectDetailPage slug={projectDetailSlug} />;
  } else if (route.startsWith('/proyectos')) {
    content = <ProjectsPage />;
  } else if (route.startsWith('/nosotros')) {
    content = <NosotrosPage />;
  } else if (route.startsWith('/brief')) {
    content = <BriefPage />;
  } else {
    content = <Home sectionOrder={sectionOrder} />;
  }

  return (
    <MotionConfig reducedMotion="never">
      <LandingDataProvider value={{ config, projects, isConfigReady: true, projectsReady }}>
        {content}
      </LandingDataProvider>
      <ThemeTransition />
    </MotionConfig>
  );
}
