import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/** Access the global Lenis instance from any component */
export const useLenis = () => useContext(LenisContext);

export const LenisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Touch/mobile devices scroll natively and smoothly — Lenis intercepts touch
    // events which breaks finger scrolling entirely, so skip it on coarse pointers.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const l = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    l.on('scroll', ScrollTrigger.update);

    // Feed Lenis into GSAP's ticker so everything runs on the same RAF
    const ticker = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    setLenis(l);

    return () => {
      gsap.ticker.remove(ticker);
      l.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};
