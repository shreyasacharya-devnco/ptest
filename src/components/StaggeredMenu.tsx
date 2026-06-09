import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import Shuffle from '@/components/Shuffle';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  isExternal?: boolean;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
  isExternal?: boolean;
}

export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoText?: string;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  resumeUrl?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['rgba(93,124,226,0.25)', 'rgba(93,124,226,0.65)'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoText = 'Om.',
  isFixed = true,
  closeOnClickAway = true,
  resumeUrl,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const scrollLineRef = useRef<HTMLSpanElement | null>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  const location = useLocation();

  // ── Theme (with localStorage persistence) ──────────────
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    // Default to light regardless of OS preference — only an explicit
    // toggle (persisted below) should switch a visitor into dark mode.
    const initial = saved ?? 'light';
    setTheme(initial);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(next);
    localStorage.setItem('theme', next);
  };
  // ───────────────────────────────────────────────────────

  // ── Scroll-progress line — sits under the toggle button and grows
  // from 0 to the button's full width ("Menu" label + "+" icon) as the
  // user scrolls from the top to the bottom of the page ─────────────
  useEffect(() => {
    const line = scrollLineRef.current;
    if (!line) return;
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
      line.style.width = `${progress * 100}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);
  // ───────────────────────────────────────────────────────

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;

      if (!panel || !plusH || !plusV || !icon) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    });
    return () => ctx.revert();
  }, [position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) { closeTweenRef.current.kill(); closeTweenRef.current = null; }
    itemEntranceTweenRef.current?.kill();

    const itemEls     = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls   = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const offscreen    = position === 'left' ? -100 : 100;
    const layerStates  = layers.map(el => ({ el, start: offscreen }));
    const panelStart   = offscreen;

    if (itemEls.length)   gsap.set(itemEls,   { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
    if (socialTitle)      gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime      = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsert   = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsert);

    if (itemEls.length) {
      const itemsStart = panelInsert + panelDuration * 0.15;
      tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1 } }, itemsStart);
      if (numberEls.length) {
        tl.to(numberEls, { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08 } }, itemsStart + 0.1);
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsert + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08 },
          onComplete: () => { gsap.set(socialLinks, { clearProps: 'opacity' }); },
        }, socialsStart + 0.04);
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) { tl.eventCallback('onComplete', () => { busyRef.current = false; }); tl.play(0); }
    else busyRef.current = false;
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill(); openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const iEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (iEls.length) gsap.set(iEls, { yPercent: 140, rotate: 10 });
        const nEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')) as HTMLElement[];
        if (nEls.length) gsap.set(nEls, { ['--sm-num-opacity' as any]: 0 });
        const sTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const sLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        if (sTitle) gsap.set(sTitle, { opacity: 0 });
        if (sLinks.length) gsap.set(sLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current, h = plusHRef.current, v = plusVRef.current;
    if (!icon || !h || !v) return;
    spinTweenRef.current?.kill();
    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45,  duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0,  duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
  }, [playClose, animateIcon, onMenuClose]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) { onMenuOpen?.(); playOpen(); }
    else         { onMenuClose?.(); playClose(); }
    animateIcon(target);
  }, [playOpen, playClose, animateIcon, onMenuOpen, onMenuClose]);

  // Close on route change
  React.useEffect(() => { closeMenu(); }, [location.pathname]); // eslint-disable-line

  // Close on click outside
  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(e.target as Node)
      ) closeMenu();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div className={`sm-scope z-50 pointer-events-none ${isFixed ? 'fixed inset-0 overflow-hidden' : 'w-full h-full'}`}>
      <div
        className={(className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full z-50'}
        style={{ ['--sm-accent' as any]: 'hsl(var(--primary))' } as React.CSSProperties}
        data-position={position}
        data-open={open || undefined}
      >
        {/* ── Pre-layers ─────────────────────────────── */}
        <div ref={preLayersRef} className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]" aria-hidden="true">
          {(() => {
            const raw = colors?.length ? colors.slice(0, 4) : ['rgba(93,124,226,0.25)', 'rgba(93,124,226,0.65)'];
            let arr = [...raw];
            if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
            return arr.map((c, i) => (
              <div key={i} className="sm-prelayer absolute top-0 right-0 h-full w-full" style={{ background: c }} />
            ));
          })()}
        </div>

        {/* ── Header: Logo + Menu toggle ─────────────── */}
        <header
          className="staggered-menu-header absolute top-0 left-0 w-full h-[66px] flex items-center justify-between px-6 sm:px-12 lg:px-20 py-4 pointer-events-none z-[40] bg-background/80 backdrop-blur-sm border-b border-border/20 lg:bg-transparent lg:backdrop-blur-none lg:border-b-0"
          aria-label="Main navigation header"
        >
          <Link
            to="/"
            className="sm-logo-text text-2xl font-bold text-foreground pointer-events-auto no-custom-cursor"
            aria-label="Om Tiwari — home"
          >
            <Shuffle
              text={logoText}
              tag="span"
              triggerOnHover
              triggerOnce
              shuffleDirection="right"
              duration={0.3}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.04}
              threshold={0}
              rootMargin="0px"
              style={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 1 }}
            />
          </Link>

          {/* fix 5: button wraps text + icon as one large touch target */}
          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-2 bg-transparent border-0 font-medium leading-none overflow-visible pointer-events-auto text-foreground text-base no-custom-cursor py-2 px-1"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <Shuffle
              key={open ? 'close' : 'menu'}
              text={open ? 'Close' : 'Menu'}
              tag="span"
              triggerOnHover
              triggerOnce
              shuffleDirection="right"
              duration={0.28}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.04}
              threshold={0}
              rootMargin="0px"
              aria-hidden="true"
              style={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 1, marginRight: '4px' }}
            />
            <span ref={iconRef} className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center" aria-hidden="true">
              <span ref={plusHRef}  className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
              <span ref={plusVRef}  className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
            </span>
            {/* Scroll-progress line — grows from 0 to the button's full width
                ("Menu" + "+") as the page is scrolled top to bottom */}
            <span
              ref={scrollLineRef}
              className="sm-scroll-line absolute left-0 -bottom-0.5 h-[3px] bg-[hsl(var(--primary))] rounded-full pointer-events-none"
              style={{ width: 0 }}
              aria-hidden="true"
            />
          </button>
        </header>

        {/* ── Slide-in Panel ─────────────────────────── */}
        {/* fix 8: no border-l */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full flex flex-col overflow-y-auto z-[30] pointer-events-auto"
          aria-hidden={!open}
        >
          <div className="sm-panel-inner flex-1 flex flex-col gap-4 pt-24 sm:pt-24 px-6 sm:px-10 pb-8 sm:pb-10">

            {/* nav items — title-case, active=underline, external=arrow icon */}
            <ul className="sm-panel-list list-none m-0 p-0 flex flex-col gap-1" role="list" data-numbering={displayItemNumbering || undefined}>
              {items.length > 0 ? items.map((it, idx) => {
                const isActive = location.pathname === it.link;
                const itemClass = `sm-panel-item relative font-semibold text-[2.75rem] sm:text-[3rem] lg:text-[4rem] leading-none tracking-[-1px] sm:tracking-[-2px] inline-block no-underline pr-[1.4em] no-custom-cursor${isActive ? ' sm-panel-item--active' : ''}${it.isExternal ? ' sm-panel-item--external' : ''}`;
                return (
                  <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                    {it.isExternal ? (
                      <a
                        href={it.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={itemClass}
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}
                      >
                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                          {it.label}<span className="sm-panel-item-extIcon" aria-hidden="true"><ArrowUpRight /></span>
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={it.link}
                        className={itemClass}
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}
                        onClick={closeMenu}
                      >
                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                          {it.label}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              }) : (
                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                  <span className="sm-panel-item relative font-semibold text-[2rem] sm:text-[3rem] lg:text-[4rem] leading-none tracking-[-1px] sm:tracking-[-2px] inline-block pr-[1.4em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">No items</span>
                  </span>
                </li>
              )}
            </ul>

            {/* Theme pill toggle — no label, bigger */}
            <div className="flex items-center mt-2">
              <button
                role="switch"
                aria-checked={theme === 'dark'}
                onClick={toggleTheme}
                className="sm-theme-pill no-custom-cursor"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                type="button"
              >
                <Sun  className="sm-pill-icon sm-pill-icon--sun  h-[18px] w-[18px]" aria-hidden="true" />
                <span className={`sm-pill-thumb${theme === 'dark' ? ' sm-pill-thumb--dark' : ''}`} />
                <Moon className="sm-pill-icon sm-pill-icon--moon h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </div>

            {/* Socials + Resume */}
            {displaySocials && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-6 flex flex-col gap-3" aria-label="Social links">
                <h3 className="sm-socials-title m-0 text-[0.65rem] font-semibold uppercase tracking-widest">Connect</h3>
                <ul className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-5 flex-wrap" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i}>
                      <a
                        href={s.link}
                        target={s.isExternal ? '_blank' : undefined}
                        rel={s.isExternal ? 'noopener noreferrer' : undefined}
                        className="sm-socials-link text-base font-medium no-underline relative inline-block py-[2px] no-custom-cursor"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        /* ── Wrapper ─────────────────────────────────── */
        .sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 50; pointer-events: none; }
        .sm-scope .staggered-menu-header > * { pointer-events: auto; }

        /* ── Menu toggle button ──────────────────────── */
        .sm-scope .sm-toggle { color: hsl(var(--foreground)); cursor: pointer; }
        .sm-scope .sm-toggle:focus-visible { outline: 2px solid hsl(var(--primary) / 0.5); outline-offset: 4px; border-radius: 4px; }
        .sm-scope .sm-toggle-textWrap { position: relative; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; }
        .sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
        .sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
        .sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
        .sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }

        /* ── Pre-layers ──────────────────────────────── */
        .sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(300px, 42vw, 480px); pointer-events: none; z-index: 5; }
        .sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
        .sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; }

        /* ── Panel ───────────────────────────────────── */
        .sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(300px, 42vw, 480px); height: 100%; background: hsl(var(--background)); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; z-index: 30; border-left: 1px solid rgba(0,0,0,0.12); }
        .dark .sm-scope .staggered-menu-panel { border-left-color: rgba(255,255,255,0.15); }
        .sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; border-left: none; border-right: 1px solid rgba(0,0,0,0.12); }
        .dark .sm-scope [data-position='left'] .staggered-menu-panel { border-right-color: rgba(255,255,255,0.15); }
        .sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; }

        /* ── Nav items — no uppercase, underline active ── */
        .sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1.5rem; }
        .sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
        .sm-scope .sm-panel-item {
          position: relative; color: hsl(var(--foreground));
          font-weight: 700; cursor: pointer; line-height: 1;
          letter-spacing: -2px;
          transition: color 0.2s ease;
          display: inline-block; text-decoration: none; padding-right: 1.4em;
        }
        /* hover → primary blue (current page keeps its own look, see below) */
        .sm-scope .sm-panel-item:hover { color: hsl(var(--primary)); }
        /* active → marked with a leading dot + permanent underline, and keeps
           that look on hover too so it never gets confused with a plain hover */
        .sm-scope .sm-panel-item--active,
        .sm-scope .sm-panel-item--active:hover { color: hsl(var(--foreground)); }
        .sm-scope .sm-panel-item--active .sm-panel-itemLabel { position: relative; }
        .sm-scope .sm-panel-item--active .sm-panel-itemLabel::after {
          content: ''; position: absolute; bottom: -5px; left: 0;
          width: 100%; height: 3px;
          background: hsl(var(--primary)); border-radius: 2px;
        }
        .sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }

        /* ── Numbering ───────────────────────────────── */
        .sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem; content: counter(smItem, decimal-leading-zero);
          position: absolute; top: 0.1em; right: 3.2em;
          font-size: 16px; font-weight: 400; color: hsl(var(--primary));
          letter-spacing: 0; pointer-events: none; user-select: none;
          opacity: var(--sm-num-opacity, 0);
        }
        /* active page → number badge becomes a filled circle (primary bg, white text)
           centred on the line (not offset above it) so .sm-panel-itemWrap's
           overflow:hidden doesn't clip the top of the circle */
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item--active::after {
          display: flex; align-items: center; justify-content: center;
          width: 1.8em; height: 1.8em; top: 50%; right: 2.7em;
          transform: translateY(-50%);
          border-radius: 50%; background: hsl(var(--primary));
          color: hsl(var(--primary-foreground)); font-size: 14px;
        }
        /* External items (e.g. Resume) — suppress number counter */
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item--external::after { content: none; }
        /* Arrow icon — inline superscript right after label text, same size/color as numbers */
        .sm-scope .sm-panel-item-extIcon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px;
          vertical-align: super;
          margin-left: 0.08em;
          color: hsl(var(--primary));
          pointer-events: none; user-select: none;
          position: relative;
        }
        .sm-scope .sm-panel-item-extIcon svg { width: 16px; height: 16px; }

        /* ── Pill toggle ─────────────────────────────── */
        .sm-scope .sm-theme-pill {
          position: relative; display: grid; grid-template-columns: 1fr 1fr;
          width: 76px; height: 38px; padding: 0;
          border-radius: 999px; border: none; cursor: pointer;
          background: hsl(var(--secondary));
          transition: background 0.25s ease;
        }
        .sm-scope .sm-theme-pill:focus-visible { outline: 2px solid hsl(var(--primary) / 0.5); outline-offset: 3px; }
        /* Icons are SVGs — use grid alignment so they sit centred in their cell.
           Do NOT set width/height here; Tailwind h-[18px] w-[18px] on the element controls size. */
        .sm-scope .sm-pill-icon {
          justify-self: center; align-self: center;
          color: hsl(var(--muted-foreground)); position: relative; z-index: 1;
          transition: color 0.25s ease;
        }
        .sm-scope .sm-pill-thumb {
          position: absolute; top: 4px; left: 4px;
          width: 30px; height: 30px; border-radius: 50%;
          background: hsl(var(--primary));
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }
        .sm-scope .sm-pill-thumb--dark { transform: translateX(38px); }
        /* active icon (the one under the thumb) goes white */
        .sm-scope .sm-theme-pill[aria-checked='false'] .sm-pill-icon--sun,
        .sm-scope .sm-theme-pill[aria-checked='true']  .sm-pill-icon--moon { color: hsl(0 0% 100%); }

        /* ── Socials ─────────────────────────────────── */
        .sm-scope .sm-socials { margin-top: auto; padding-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .sm-scope .sm-socials-title { margin: 0; color: hsl(var(--primary)); }
        .sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1.25rem; flex-wrap: wrap; }
        .sm-scope .sm-socials-link { font-size: 1rem; font-weight: 500; color: hsl(var(--muted-foreground)); text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.2s ease, opacity 0.2s ease; }
        .sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.4; }
        .sm-scope .sm-socials-link:hover { color: hsl(var(--primary)); opacity: 1; }
        .sm-scope .sm-socials-link:focus-visible { outline: 2px solid hsl(var(--primary)); outline-offset: 3px; }

        /* ── Mobile ──────────────────────────────────── */
        @media (max-width: 768px) {
          .sm-scope .staggered-menu-panel,
          .sm-scope .sm-prelayers { width: 100%; left: 0; right: 0; }
          /* Keep counter inside the right padding zone so it doesn't overlap text.
             Excludes the active item — its number badge becomes a centred circle
             (top: 50% + translateY(-50%), see above) and this rule's top:0.08em
             would combine with that translate to push it mostly above the line,
             where .sm-panel-itemWrap's overflow:hidden clips it. */
          .sm-scope .sm-panel-list[data-numbering] .sm-panel-item:not(.sm-panel-item--active)::after {
            top: 0.08em;
            right: 0.25em;
            font-size: 11px;
          }
          /* The active circle's desktop "right: 2.7em" was tuned for the
             lg padding-right (1.4em of a 64px font ≈ 90px). On mobile the
             item font is smaller (44px → padding-right ≈ 61.6px), so that
             same offset pushes the circle's left edge ~1.4px past the
             label's right edge — bleeding into the text. Re-centre it
             within the padding zone instead: (61.6px padding − 25.2px
             circle) / 2 ≈ 18px ≈ 1.3em of the circle's own 14px font. */
          .sm-scope .sm-panel-list[data-numbering] .sm-panel-item--active::after {
            right: 1.3em;
          }
          /* Increase list gap on mobile for breathing room */
          .sm-scope .sm-panel-list { gap: 0.6rem; }
        }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
