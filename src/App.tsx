import { Fragment, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Services from './components/Services';
import Cms from './components/Cms';
import Included from './components/Included';
import Process from './components/Process';
import Projects from './components/Projects';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectsPage from './components/ProjectsPage';
import BriefPage from './components/BriefPage';
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

function getRoute() {
  const hashRoute = window.location.hash.replace(/^#/, '');
  if (hashRoute.startsWith('/')) {
    return hashRoute;
  }

  if (window.location.pathname.startsWith('/proyectos')) {
    return '/proyectos';
  }
  if (window.location.pathname.startsWith('/brief')) {
    return '/brief';
  }

  return '/';
}

function Home({ sectionOrder }: { sectionOrder: LandingSectionId[] }) {
  useReveal();
  useLenis();

  const sectionMap: Record<LandingSectionId, JSX.Element> = {
    hero: <Hero />,
    about: <About />,
    services: <Services />,
    cms: <Cms />,
    included: <Included />,
    projects: <Projects />,
    faq: <Faq />,
    process: <Process />,
    team: <></>,
    contact: <Contact />,
    stats: <Stats />,
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

      if (!alive || !result) return;
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
    applyLandingSeo(route, config);
  }, [route, config]);

  return (
    <LandingDataProvider value={{ config, projects, isConfigReady: true }}>
      {route.startsWith('/proyectos')
        ? <ProjectsPage />
        : route.startsWith('/brief')
          ? <BriefPage />
          : <Home sectionOrder={sectionOrder} />}
    </LandingDataProvider>
  );
}
