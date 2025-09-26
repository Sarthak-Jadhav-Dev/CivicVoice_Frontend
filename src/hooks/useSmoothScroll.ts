'use client';

import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    // Handle smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    // Handle smooth scrolling for programmatic navigation
    const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    // Add click event listener for anchor links
    document.addEventListener('click', handleAnchorClick, { capture: true });

    // Expose the scrollToSection function globally for programmatic use
    (window as any).scrollToSection = scrollToSection;

    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      delete (window as any).scrollToSection;
    };
  }, []);

  return null;
};

export default useSmoothScroll;
