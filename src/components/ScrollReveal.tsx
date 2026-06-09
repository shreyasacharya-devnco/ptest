import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  /** When provided, this element is used as the GSAP trigger instead of the text container.
   *  Pass the sticky wrapper so the reveal maps correctly to the sticky scroll range. */
  triggerRef?: RefObject<HTMLElement | null>;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = false,
  baseOpacity = 0.2,
  baseRotation = 0,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom 60%',
  triggerRef,
  tag: Tag = 'h2',
}) => {
  const containerRef = useRef<HTMLElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef?.current ? scrollContainerRef.current : window;

    const wordEls = Array.from(el.querySelectorAll<HTMLElement>('.word'));
    if (!wordEls.length) return;

    const triggers: ScrollTrigger[] = [];

    // ── Group words by line using offsetTop (tolerance ±4 px) ───────
    const lineMap: Map<number, HTMLElement[]> = new Map();
    wordEls.forEach(w => {
      const top = w.offsetTop;
      // find an existing bucket within 4 px, otherwise create one
      let bucket: number | undefined;
      lineMap.forEach((_, key) => {
        if (Math.abs(key - top) <= 4) bucket = key;
      });
      const key = bucket ?? top;
      if (!lineMap.has(key)) lineMap.set(key, []);
      lineMap.get(key)!.push(w);
    });

    // Sort buckets top → bottom, flatten into ordered word list
    const orderedWords = [...lineMap.entries()]
      .sort(([a], [b]) => a - b)
      .flatMap(([, words]) => words);

    // ── Initial state — no transforms, no blur unless enabled ────────
    gsap.set(orderedWords, {
      opacity: baseOpacity,
      filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
      clearProps: 'transform',
    });

    // ── Build a flat sequential timeline ─────────────────────────────
    // Each word gets equal time-share → strict left-to-right, top-to-bottom
    const tl = gsap.timeline();
    orderedWords.forEach(word => {
      const vars: gsap.TweenVars = { opacity: 1, ease: 'none', duration: 1 };
      if (enableBlur) vars.filter = 'blur(0px)';
      tl.to(word, vars);
    });

    // When a triggerRef (sticky wrapper) is provided, use it as the trigger so the
    // reveal maps to the actual sticky scroll range — 'top top' fires when the
    // wrapper sticks, 'bottom bottom' fires when sticky releases.
    const triggerEl = triggerRef?.current ?? el;
    const startPos  = triggerRef?.current ? 'top top'   : 'top 60%';

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      scroller,
      start: startPos,
      end: wordAnimationEnd,
      scrub: 1,
      animation: tl,
    });
    triggers.push(st);

    // Defer a full refresh so this trigger's position is recalculated
    // after all sibling components (SelectedWorks sticky cards etc.) have
    // also finished their own layout-affecting ScrollTrigger setup.
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
    triggers.push({ kill: () => cancelAnimationFrame(rafId) } as unknown as ScrollTrigger);

    // Optional rotation (skip when 0 to avoid subpixel blur)
    if (baseRotation !== 0) {
      const rotSt = ScrollTrigger.create({
        trigger: el,
        scroller,
        start: 'top bottom',
        end: rotationEnd,
        scrub: true,
        animation: gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          { ease: 'none', rotate: 0 }
        ),
      });
      triggers.push(rotSt);
    }

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
    triggerRef,
  ]);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLDivElement>}
      className={`my-5 ${containerClassName}`}
    >
      <p className={`leading-[1.5] font-bold ${textClassName}`}>{splitText}</p>
    </Tag>
  );
};

export default ScrollReveal;
