import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface ShuffleProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  maxDelay?: number;
  ease?: string | ((t: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'random' | 'evenodd';
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

const Shuffle: React.FC<ShuffleProps> = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  maxDelay = 0,
  ease = 'power3.out',
  threshold = 0,
  rootMargin = '0px',
  tag = 'span',
  textAlign = 'left',
  onShuffleComplete,
  shuffleTimes = 1,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = '',
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
  // spread remaining HTML attrs (e.g. aria-hidden, id, data-*)
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('fonts' in document) {
      if (document.fonts.status === 'loaded') setFontsLoaded(true);
      else document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || '');
    const mv = mm ? parseFloat(mm[1]) : 0;
    const mu = mm ? mm[2] || 'px' : 'px';
    const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
    return `top ${startPct}%${sign}`;
  }, [threshold, rootMargin]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text || !fontsLoaded) return;

    if (
      respectReducedMotion &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onShuffleComplete?.();
      setReady(true);
      return;
    }

    // ── mutable state (lives inside this effect closure) ──
    let splitInstance: GSAPSplitText | null = null;
    let wrappers: HTMLElement[] = [];
    let tl: gsap.core.Timeline | null = null;
    let playing = false;
    let hoverHandler: ((e: Event) => void) | null = null;

    const removeHover = () => {
      if (hoverHandler) {
        el.removeEventListener('mouseenter', hoverHandler);
        hoverHandler = null;
      }
    };

    const revertWrappers = () => {
      wrappers.forEach(wrap => {
        const inner = wrap.firstElementChild as HTMLElement | null;
        const orig = inner?.querySelector('[data-orig="1"]') as HTMLElement | null;
        if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
      });
      wrappers = [];
    };

    const teardown = () => {
      tl?.kill();
      tl = null;
      revertWrappers();
      try { splitInstance?.revert(); } catch { /* ignore */ }
      splitInstance = null;
      playing = false;
    };

    // ── build: split text & wrap each char ──────────────────────────
    const build = () => {
      teardown();

      const computedFont = getComputedStyle(el).fontFamily;

      splitInstance = new GSAPSplitText(el, {
        type: 'chars',
        charsClass: 'shuffle-char',
        smartWrap: true,
        reduceWhiteSpace: false,
      });

      const chars = (splitInstance.chars || []) as HTMLElement[];
      const rolls = Math.max(1, Math.floor(shuffleTimes));
      const rand = (set: string) => set.charAt(Math.floor(Math.random() * set.length)) || '';

      chars.forEach(ch => {
        const parent = ch.parentElement;
        if (!parent) return;

        const w = ch.getBoundingClientRect().width;
        const h = ch.getBoundingClientRect().height;
        if (!w) return;

        const isVertDir = shuffleDirection === 'up' || shuffleDirection === 'down';

        // outer clip container
        const wrap = document.createElement('span');
        wrap.className = 'inline-block overflow-hidden';
        Object.assign(wrap.style, {
          width: w + 'px',
          height: isVertDir ? h + 'px' : 'auto',
          verticalAlign: 'bottom',
        });

        // sliding strip
        const inner = document.createElement('span');
        inner.className =
          'inline-block will-change-transform origin-left transform-gpu ' +
          (isVertDir ? 'whitespace-normal' : 'whitespace-nowrap');

        parent.insertBefore(wrap, ch);
        wrap.appendChild(inner);

        // first copy (shown at rest)
        const firstOrig = ch.cloneNode(true) as HTMLElement;
        firstOrig.className = 'text-left ' + (isVertDir ? 'block' : 'inline-block');
        Object.assign(firstOrig.style, { width: w + 'px', fontFamily: computedFont });

        ch.setAttribute('data-orig', '1');
        ch.className = 'text-left ' + (isVertDir ? 'block' : 'inline-block');
        Object.assign(ch.style, { width: w + 'px', fontFamily: computedFont });

        inner.appendChild(firstOrig);

        // scramble copies
        for (let k = 0; k < rolls; k++) {
          const c = ch.cloneNode(true) as HTMLElement;
          if (scrambleCharset) c.textContent = rand(scrambleCharset);
          c.className = 'text-left ' + (isVertDir ? 'block' : 'inline-block');
          Object.assign(c.style, { width: w + 'px', fontFamily: computedFont });
          inner.appendChild(c);
        }

        inner.appendChild(ch);

        const steps = rolls + 1;

        // for right/down: move real char to front so strip slides in from "behind"
        if (shuffleDirection === 'right' || shuffleDirection === 'down') {
          const firstCopy = inner.firstElementChild as HTMLElement | null;
          const real = inner.lastElementChild as HTMLElement | null;
          if (real) inner.insertBefore(real, inner.firstChild);
          if (firstCopy) inner.appendChild(firstCopy);
        }

        let startX = 0, finalX = 0, startY = 0, finalY = 0;
        if (shuffleDirection === 'right')      { startX = -steps * w; finalX = 0; }
        else if (shuffleDirection === 'left')  { startX = 0; finalX = -steps * w; }
        else if (shuffleDirection === 'down')  { startY = -steps * h; finalY = 0; }
        else if (shuffleDirection === 'up')    { startY = 0; finalY = -steps * h; }

        if (!isVertDir) {
          gsap.set(inner, { x: startX, y: 0, force3D: true });
          inner.setAttribute('data-start-x', String(startX));
          inner.setAttribute('data-final-x', String(finalX));
        } else {
          gsap.set(inner, { x: 0, y: startY, force3D: true });
          inner.setAttribute('data-start-y', String(startY));
          inner.setAttribute('data-final-y', String(finalY));
        }

        if (colorFrom) inner.style.color = colorFrom;
        wrappers.push(wrap);
      });
    };

    const getInners = () => wrappers.map(w => w.firstElementChild as HTMLElement);

    // ── play ─────────────────────────────────────────────────────────
    const armHover = () => {
      if (!triggerOnHover) return;
      removeHover();
      hoverHandler = () => {
        if (playing) return;
        build();
        play();
      };
      el.addEventListener('mouseenter', hoverHandler);
    };

    const cleanupToStill = () => {
      wrappers.forEach(w => {
        const strip = w.firstElementChild as HTMLElement;
        if (!strip) return;
        const real = strip.querySelector('[data-orig="1"]') as HTMLElement | null;
        if (!real) return;
        strip.replaceChildren(real);
        strip.style.transform = 'none';
        strip.style.willChange = 'auto';
      });
    };

    const play = () => {
      const strips = getInners();
      if (!strips.length) return;

      playing = true;
      const isVertDir = shuffleDirection === 'up' || shuffleDirection === 'down';

      tl = gsap.timeline({
        smoothChildTiming: true,
        repeat: loop ? -1 : 0,
        repeatDelay: loop ? loopDelay : 0,
        onRepeat: () => {
          if (isVertDir) {
            gsap.set(strips, { y: (_, t: HTMLElement) => parseFloat(t.getAttribute('data-start-y') || '0') });
          } else {
            gsap.set(strips, { x: (_, t: HTMLElement) => parseFloat(t.getAttribute('data-start-x') || '0') });
          }
          onShuffleComplete?.();
        },
        onComplete: () => {
          playing = false;
          if (!loop) {
            cleanupToStill();
            if (colorTo) gsap.set(strips, { color: colorTo });
            onShuffleComplete?.();
            armHover();
          }
        },
      });

      const addTween = (targets: HTMLElement[], at: number) => {
        const vars: gsap.TweenVars = {
          duration,
          ease: ease as string,
          force3D: true,
          stagger: animationMode === 'evenodd' ? stagger : 0,
        };
        if (isVertDir) {
          vars.y = (_: number, t: HTMLElement) => parseFloat(t.getAttribute('data-final-y') || '0');
        } else {
          vars.x = (_: number, t: HTMLElement) => parseFloat(t.getAttribute('data-final-x') || '0');
        }
        tl!.to(targets, vars, at);
        if (colorFrom && colorTo) tl!.to(targets, { color: colorTo, duration, ease: ease as string }, at);
      };

      if (animationMode === 'evenodd') {
        const odd  = strips.filter((_, i) => i % 2 === 1);
        const even = strips.filter((_, i) => i % 2 === 0);
        const oddTotal  = duration + Math.max(0, odd.length - 1) * stagger;
        const evenStart = odd.length ? oddTotal * 0.7 : 0;
        if (odd.length)  addTween(odd,  0);
        if (even.length) addTween(even, evenStart);
      } else {
        strips.forEach(strip => {
          const d = Math.random() * maxDelay;
          const vars: gsap.TweenVars = { duration, ease: ease as string, force3D: true };
          if (isVertDir) {
            vars.y = parseFloat(strip.getAttribute('data-final-y') || '0');
          } else {
            vars.x = parseFloat(strip.getAttribute('data-final-x') || '0');
          }
          tl!.to(strip, vars, d);
          if (colorFrom && colorTo) {
            tl!.fromTo(strip, { color: colorFrom }, { color: colorTo, duration, ease: ease as string }, d);
          }
        });
      }
    };

    // ── create: build + play, then arm hover ─────────────────────────
    const create = () => {
      build();
      play();
      setReady(true);
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: scrollTriggerStart,
      once: triggerOnce,
      onEnter: create,
    });

    return () => {
      st.kill();
      removeHover();
      teardown();
      setReady(false);
    };
  }, [
    text, duration, maxDelay, ease, scrollTriggerStart, fontsLoaded,
    shuffleDirection, shuffleTimes, animationMode, loop, loopDelay,
    stagger, scrambleCharset, colorFrom, colorTo, triggerOnce,
    respectReducedMotion, triggerOnHover, onShuffleComplete,
  ]);

  const Tag = (tag || 'span') as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`inline-block whitespace-normal break-words will-change-transform ${ready ? 'visible' : 'invisible'} ${className}`.trim()}
      style={{ textAlign, ...style }}
      {...rest}
    >
      {text}
    </Tag>
  );
};

export default Shuffle;
