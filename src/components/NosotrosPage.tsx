import { useEffect } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import About from './About';
import Team from './Team';
import { useReveal } from '../hooks/useReveal';
import { useLenis } from '../hooks/useLenis';

export default function NosotrosPage() {
  useReveal();
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Nav />
      <main className="pt-20 md:pt-24">
        <About />
        <Team />
      </main>
      <Footer />
    </div>
  );
}
