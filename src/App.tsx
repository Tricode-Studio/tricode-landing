import { Fragment, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Services from './components/Services';
import Cms from './components/Cms';
import Team from './components/Team';
import Process from './components/Process';
import Projects from './components/Projects';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import ProjectsPage from './components/ProjectsPage';
import BriefPage from './components/BriefPage';
import { useReveal } from './hooks/useReveal';
import type { Project } from './types/project';
import {
  LandingDataProvider,
  type LandingConfig,
  type LandingSectionId,
} from './content/LandingDataContext';
import { withLandingDefaults } from './content/defaultLandingConfig';
import { fetchCmsProjects, fetchLandingConfig } from './lib/cms';
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

  const sectionMap: Record<LandingSectionId, JSX.Element> = {
    hero: <Hero />,
    about: <About />,
    services: <Services />,
    cms: <Cms />,
    projects: <Projects />,
    faq: <Faq />,
    process: <Process />,
    team: <Team />,
    contact: <Contact />,
    stats: <Stats />,
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Cursor />
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
  const [config, setConfig] = useState<LandingConfig>(() => withLandingDefaults({}));
  const [projects, setProjects] = useState<Project[]>([]);
  const [isConfigReady, setIsConfigReady] = useState(true);
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

    const loadLandingData = async () => {
      const [configResult, projectsResult] = await Promise.allSettled([
        fetchLandingConfig(),
        fetchCmsProjects(),
      ]);

      if (!alive) {
        return;
      }

      if (configResult.status === 'fulfilled') {
        setConfig(withLandingDefaults(configResult.value));
      } else {
        setConfig((current) => withLandingDefaults(current));
      }

      if (projectsResult.status === 'fulfilled') {
        setProjects(projectsResult.value);
      }

      setIsConfigReady(true);
    };

    void loadLandingData();
    const timer = window.setInterval(() => {
      void loadLandingData();
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
    <LandingDataProvider value={{ config, projects, isConfigReady }}>
      {route.startsWith('/proyectos')
        ? <ProjectsPage />
        : route.startsWith('/brief')
          ? <BriefPage />
          : <Home sectionOrder={sectionOrder} />}
    </LandingDataProvider>
  );
}
