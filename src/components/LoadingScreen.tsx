import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  onRevealStart?: () => void;
}

const TYPING_INTERVAL = 130;

const TYPING_MAP = [
  { idx: 0, text: "त"  },
  { idx: 0, text: "ति" },
  { idx: 1, text: "व"  },
  { idx: 1, text: "वा" },
  { idx: 2, text: "र"  },
  { idx: 2, text: "री" },
];

interface NameBlockProps {
  topOffset: string;
  aksharas: string[];
  devFont: React.CSSProperties;
}

const NameBlock = ({ topOffset, aksharas, devFont }: NameBlockProps) => (
  // font-size set here so gap's "em" unit scales with the letter size,
  // giving equal visual spacing on both sides of every word.
  <div
    className="name-cont flex items-center"
    style={{
      fontSize: devFont.fontSize,
      gap: "0.3em",
      position: "absolute",
      left: "50%",
      top: topOffset,
      transform: "translate(-50%, -55%)",
      whiteSpace: "nowrap",
    }}
  >
    {/* ओम */}
    <span className="om-group inline-block" style={devFont}>ओम</span>

    {/* तिवारी — aksharas typed one by one */}
    <span className="tiwari-wrapper inline-flex items-center" style={{ whiteSpace: "nowrap" }}>
      {aksharas.map((ak, i) => (
        <span key={i} className="ak inline-block" style={{ ...devFont, minWidth: "0.05em" }}>
          {ak}
        </span>
      ))}
    </span>

    {/* cursor — negative margin pulls it closer to the preceding word */}
    <span className="cursor-el" style={{ ...devFont, opacity: 1, marginLeft: "-0.18em" }}>|</span>
  </div>
);

export const LoadingScreen = ({ onLoadingComplete, onRevealStart }: LoadingScreenProps) => {
  const topPanelRef    = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const topTextRef     = useRef<HTMLDivElement>(null);
  const bottomTextRef  = useRef<HTMLDivElement>(null);
  const cutLineRef     = useRef<HTMLDivElement>(null);
  const counterRef     = useRef<HTMLSpanElement>(null);
  const blinkRef       = useRef<gsap.core.Tween | null>(null);

  const [aksharas, setAksharas] = useState(["", "", ""]);

  // Mobile uses a bigger vw multiplier so the text is large enough for the
  // split effect to read clearly. Desktop keeps the original formula.
  // mobile  : clamp(2.5rem=40px, 11vw, 6rem=96px)
  // desktop : clamp(1.6rem=25.6px, 9vw, 9rem=144px)
  // window.innerWidth is unreliable here — the page's `initial-scale=0.9`
  // viewport meta inflates it relative to the actual CSS viewport. CSS `vw`
  // units (used in the clamp() formulas below) are based on the layout
  // viewport width, which document.documentElement.clientWidth tracks correctly.
  const getDevFontSize = () => {
    if (typeof document === "undefined") return "clamp(1.6rem, 9vw, 9rem)";
    return document.documentElement.clientWidth < 640
      ? "clamp(2.5rem, 11vw, 6rem)"
      : "clamp(1.6rem, 9vw, 9rem)";
  };

  const [devFontSize, setDevFontSize] = useState(getDevFontSize);

  const calcSplitOffset = () => {
    if (typeof document === "undefined") return 32;
    const vw = document.documentElement.clientWidth;
    const fs = vw < 640
      ? Math.max(40, Math.min(vw * 0.11, 96))    // matches mobile clamp above
      : Math.max(25.6, Math.min(vw * 0.09, 144)); // matches desktop clamp above
    return Math.round(fs * 0.247);
  };

  const [splitOffset, setSplitOffset] = useState(calcSplitOffset);

  useEffect(() => {
    const update = () => {
      setDevFontSize(getDevFontSize());
      setSplitOffset(calcSplitOffset());
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Typing ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TYPING_MAP.forEach(({ idx, text }, step) => {
      timers.push(setTimeout(() => {
        setAksharas(prev => {
          const next = [...prev];
          next[idx] = text;
          return next;
        });
      }, 100 + step * TYPING_INTERVAL));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── Main GSAP timeline ───────────────────────────────────────────────
  useEffect(() => {
    const topPanel    = topPanelRef.current;
    const bottomPanel = bottomPanelRef.current;
    const topText     = topTextRef.current;
    const bottomText  = bottomTextRef.current;
    const cutLine     = cutLineRef.current;
    const ctr         = counterRef.current;

    if (!topPanel || !bottomPanel || !topText || !bottomText || !cutLine || !ctr) return;

    gsap.set(cutLine, { scaleX: 0, transformOrigin: "left center" });

    // ── Counter ──────────────────────────────────────────────────────
    const obj = { val: 0 };
    const counterTween = gsap.to(obj, {
      val: 100,
      duration: 3.8,
      ease: "power1.inOut",
      onUpdate() { if (ctr) ctr.textContent = `${Math.round(obj.val)}%`; },
    });

    // ── Cursor blink ─────────────────────────────────────────────────
    blinkRef.current = gsap.to(".cursor-el", {
      opacity: 0, duration: 0.42, ease: "steps(1)", repeat: -1, yoyo: true,
    });
    const blinkStop = setTimeout(() => {
      blinkRef.current?.kill();
      gsap.set(".cursor-el", { opacity: 1 });
    }, 100 + (TYPING_MAP.length - 1) * TYPING_INTERVAL + 130);

    // ── Snapshot DOM nodes ────────────────────────────────────────────
    const allWrappers  = Array.from(document.querySelectorAll<HTMLElement>(".tiwari-wrapper"));
    const allNameConts = Array.from(document.querySelectorAll<HTMLElement>(".name-cont"));
    const allOmGroups  = Array.from(document.querySelectorAll<HTMLElement>(".om-group"));
    const allCursors   = Array.from(document.querySelectorAll<HTMLElement>(".cursor-el"));

    // Promote to GPU layers before any animation begins
    gsap.set([...allOmGroups, ...allCursors, ...allWrappers], { willChange: "transform, opacity" });

    // ── Main timeline ─────────────────────────────────────────────────
    const tl = gsap.timeline({ onComplete: onLoadingComplete });

    // ── Phase 1 (t=1.8): तिवारी aksharas fall out ─────────────────────
    tl.call(() => {
      allWrappers.forEach(wrapper => {
        gsap.to(wrapper.querySelectorAll<HTMLElement>(".ak"), {
          y: 80, opacity: 0, duration: 0.3, ease: "power3.in",
          stagger: { each: 0.06, from: "start" },
        });
      });
    }, [], 1.8);

    // ── Phase 2 (t=2.25): GPU-only — zero layout reflow ───────────────
    // The NameBlock is centred via translate(-50%). When the wrapper width W
    // and gap shrink, NameBlock narrows by (W + 2×Δgap) and re-centres.
    // Each side moves inward by exactly (W/2 + Δgap). We replicate that with
    // x transforms so the browser never needs to recalculate layout mid-frame.
    //
    // Function values are lazily evaluated at t=2.25 when wrapper is at full width.
    const slide = (i: number, targets: HTMLElement[], sign: 1 | -1) => {
      const W  = allWrappers[Math.min(i, allWrappers.length - 1)].getBoundingClientRect().width;
      const fs = parseFloat(getComputedStyle(targets[i]).fontSize);
      return sign * (W / 2 + 0.15 * fs); // 0.15em = Δgap per side
    };

    // Wrapper fades/scales out — purely visual, no layout change
    tl.to(allWrappers, {
      opacity: 0, scaleX: 0, transformOrigin: "center center",
      duration: 0.3, ease: "power3.inOut",
    }, 2.25);

    // ओम slides right, | slides left — same magnitude, meet in the centre
    tl.to(allOmGroups, {
      x: (i: number) => slide(i, allOmGroups,  1),
      duration: 0.4, ease: "power4.inOut",
    }, 2.25);
    tl.to(allCursors, {
      x: (i: number) => slide(i, allCursors, -1),
      duration: 0.4, ease: "power4.inOut",
    }, 2.25);

    // Commit real layout after panels are offscreen (invisible, no perceived jump)
    // splitAt + 0.73 ≈ when both panels have fully exited the screen
    const commitLayout = () => {
      allWrappers.forEach(el => Object.assign(el.style, { width: "0px", minWidth: "0px", maxWidth: "0px", overflow: "hidden" }));
      allNameConts.forEach(el => { el.style.columnGap = "0.15em"; });
      gsap.set(allOmGroups, { x: 0, clearProps: "x,willChange" });
      gsap.set(allCursors,  { x: 0, clearProps: "x,willChange" });
      gsap.set(allWrappers, { clearProps: "willChange" });
    };

    // ── Phase 3: line sweeps — 600 ms after ओम | have closed (2.65 + 0.6) ─
    const lineStart    = 3.25;
    const lineDuration = 0.55;
    tl.to(cutLine, { scaleX: 1, duration: lineDuration, ease: "none" }, lineStart);

    // ── Phase 4: split immediately as line completes ──────────────────
    const splitAt = lineStart + lineDuration; // 3.8 — counter hits 100% here too

    tl.call(() => onRevealStart?.(), [], splitAt);
    tl.to(cutLine,                   { opacity: 0, duration: 0.3,  ease: "none"        }, splitAt);
    tl.to([topPanel, topText],       { yPercent: -100, duration: 0.72, ease: "power3.in" }, splitAt);
    tl.to([bottomPanel, bottomText], { yPercent:  100, duration: 0.72, ease: "power3.in" }, splitAt);
    tl.call(commitLayout, [], splitAt + 0.73);

    return () => {
      clearTimeout(blinkStop);
      blinkRef.current?.kill();
      counterTween.kill();
      tl.kill();
    };
  }, [onLoadingComplete]);

  /* ── Styles ─────────────────────────────────────────────────────────── */
  const devFont: React.CSSProperties = {
    fontFamily: "'Anek Devanagari', sans-serif",
    fontWeight: 700,
    fontSize: devFontSize,
    lineHeight: 1.2,
    color: "hsl(var(--primary-foreground))",
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    fontFamily: "'Manrope', sans-serif",
    fontSize: "clamp(0.75rem, 3vw, 1.1rem)",
    fontWeight: 500,
    letterSpacing: "0.04em",
    color: "hsl(var(--primary-foreground) / 0.85)",
    whiteSpace: "nowrap",
  };

  const hPad = "clamp(0.75rem, 4vw, 5.5rem)";
  const vPad = "clamp(1.5rem, 5vh, 4rem)";

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto select-none touch-none">

      {/* ── Panels ──────────────────────────────────────────────────── */}
      {/* dvh = "dynamic viewport height" — it always equals whatever is
          ACTUALLY visible right now, toolbar included or not. Plain `vh`
          (and `lvh`) on mobile Safari/Chrome lock to the *largest* possible
          viewport (toolbars collapsed) regardless of their current state —
          the classic "100vh mobile bug" — which is exactly why the two name
          halves rendered far apart instead of meeting at the split line when
          the bottom bar was showing. dvh keeps both layers' math (and the
          cut line / name-block offsets, which all key off the same unit)
          consistent with what the user is actually seeing. The scroll-lock
          in Index.tsx keeps the toolbar from changing state mid-animation,
          so dvh stays stable for the whole reveal. */}
      <div ref={topPanelRef} className="absolute inset-x-0 top-0"
           style={{ height: `calc(50dvh - ${splitOffset}px)`, background: "hsl(var(--primary))" }} />
      <div ref={bottomPanelRef} className="absolute inset-x-0 bottom-0"
           style={{ height: `calc(50dvh + ${splitOffset}px)`, background: "hsl(var(--primary))" }} />

      {/* ── Top text layer ───────────────────────────────────────────── */}
      <div ref={topTextRef} className="absolute inset-x-0 top-0"
           style={{ height: `calc(50dvh - ${splitOffset}px)`, overflow: "hidden", zIndex: 2 }}>
        <span style={{ ...labelStyle, top: vPad, left: hPad }}>UX Designer</span>
        <span style={{ ...labelStyle, top: vPad, right: hPad }}>Generalist</span>
        <span ref={counterRef} style={{ ...labelStyle, top: vPad, left: "50%", transform: "translateX(-50%)" }}>0%</span>
        <NameBlock topOffset="50dvh" aksharas={aksharas} devFont={devFont} />
      </div>

      {/* ── Bottom text layer ────────────────────────────────────────── */}
      <div ref={bottomTextRef} className="absolute inset-x-0 bottom-0"
           style={{ height: `calc(50dvh + ${splitOffset}px)`, overflow: "hidden", zIndex: 2 }}>
        <NameBlock topOffset={`${splitOffset}px`} aksharas={aksharas} devFont={devFont} />
        <span style={{ ...labelStyle, bottom: vPad, left: hPad }}>Pune</span>
        <span style={{ ...labelStyle, bottom: vPad, right: hPad }}>India</span>
      </div>

      {/* ── Cut line ─────────────────────────────────────────────────── */}
      <div ref={cutLineRef} className="absolute inset-x-0 bg-white dark:bg-black"
           style={{ top: `calc(50dvh - ${splitOffset + 1}px)`, height: "2px", zIndex: 3 }} />
    </div>
  );
};
