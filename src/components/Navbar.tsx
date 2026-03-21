import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Section = 'portfolio' | 'projects' | 'positions' | 'photography';

export default function Navbar() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('portfolio');

  const handleSectionClick = (section: Section) => {
    setActiveSection(section);

    if (section === 'photography') {
      void router.push('/photography');
      return;
    }

    if (typeof window === 'undefined') return;

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const targetId = `${section}-${isDesktop ? 'desktop' : 'mobile'}`;
    const targetElement = document.getElementById(targetId);

    targetElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  useEffect(() => {
    if (router.pathname === '/photography') {
      setActiveSection('photography');
      return;
    }

    if (router.pathname !== '/') return;

    const sections: Section[] = ['portfolio', 'positions', 'projects'];

    const updateActiveSection = () => {
      if (typeof window === 'undefined') return;

      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      const desktopContainer = document.getElementById('home-scroll-desktop');

      let nextActiveSection: Section = 'portfolio';
      let minDistance = Number.POSITIVE_INFINITY;

      if (isDesktop && desktopContainer) {
        const containerCenterX =
          desktopContainer.scrollLeft + desktopContainer.clientWidth / 2;

        sections.forEach((section) => {
          const element = document.getElementById(`${section}-desktop`);

          if (!element) return;

          const centerX = element.offsetLeft + element.clientWidth / 2;
          const distance = Math.abs(centerX - containerCenterX);

          if (distance < minDistance) {
            minDistance = distance;
            nextActiveSection = section;
          }
        });
      } else {
        const viewportCenterY = window.scrollY + window.innerHeight * 0.35;

        sections.forEach((section) => {
          const element = document.getElementById(`${section}-mobile`);

          if (!element) return;

          const rect = element.getBoundingClientRect();
          const centerY = window.scrollY + rect.top + element.clientHeight / 2;
          const distance = Math.abs(centerY - viewportCenterY);

          if (distance < minDistance) {
            minDistance = distance;
            nextActiveSection = section;
          }
        });
      }

      setActiveSection(nextActiveSection);
    };

    updateActiveSection();

    const desktopContainer = document.getElementById('home-scroll-desktop');

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    desktopContainer?.addEventListener('scroll', updateActiveSection, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      desktopContainer?.removeEventListener('scroll', updateActiveSection);
    };
  }, [router.pathname]);

  return (
    <nav className="pr-0 border-b border-gray-200 lg:pr-36 md:pr-12 w-fit">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center h-12 md:h-12">
          <div className="flex space-x-4 text-base text-white transition md:space-x-8 md:text-lg lg:text-xl">
            <button
              type="button"
              onClick={() => handleSectionClick('portfolio')}
              className={`md:w-20 text-left hover:font-bold ${activeSection === 'portfolio' ? 'font-bold' : ''}`}
            >
              /Portfolio
            </button>
            <button
              type="button"
              onClick={() => handleSectionClick('projects')}
              className={`md:w-20 text-left hover:font-bold ${activeSection === 'projects' ? 'font-bold' : ''}`}
            >
              /Projects
            </button>
            <button
              type="button"
              onClick={() => handleSectionClick('positions')}
              className={`md:w-20 text-left hover:font-bold ${activeSection === 'positions' ? 'font-bold' : ''}`}
            >
              /Positions
            </button>
            <button
              type="button"
              onClick={() => handleSectionClick('photography')}
              className={`md:w-20 text-left hover:font-bold ${activeSection === 'photography' ? 'font-bold' : ''}`}
            >
              /Photography
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
