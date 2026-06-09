import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PaintReveal } from "@/components/PaintReveal";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Greeting sequence ── नमस्ते first ───────────────────────────
const GREETINGS: { text: string; rtl?: boolean }[] = [
  { text: "नमस्ते!" },
  { text: "Hello!" },
  { text: "Bonjour!" },
  { text: "こんにちは！" },
  { text: "नमस्कार!" },
  { text: "Olá!" },
  { text: "खम्मा घणी!" },
  { text: "你好！" },
  { text: "নমস্কার!" },
  { text: "ನಮಸ್ಕಾರ!" },
  { text: "¡Hola!" },
  { text: "Hallo!" },
  { text: "!السلام علیكم", rtl: true },
];

interface HeroProps {
  revealed?: boolean; // true when loading screen begins splitting
}

export const Hero = ({ revealed = false }: HeroProps) => {
  const [idx, setIdx] = useState(0);
  const [cycling, setCycling] = useState(false);

  const greetingRef  = useRef<HTMLSpanElement>(null);
  const rightColRef  = useRef<HTMLDivElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);
  const photoColRef  = useRef<HTMLDivElement>(null);
  const textColRef   = useRef<HTMLDivElement>(null);
  const h1Ref        = useRef<HTMLHeadingElement>(null);
  const bodyRef      = useRef<HTMLParagraphElement>(null);
  const prevAtRef    = useRef<HTMLDivElement>(null);
  const btnsRef      = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);

  const [imgSize, setImgSize] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024 && rightColRef.current) {
        // Desktop: match text-column height
        setImgSize(Math.round(rightColRef.current.offsetHeight * 1.05));
      } else if (w >= 640) {
        // Tablet: generous fixed size so it feels intentional above the text
        setImgSize(260);
      } else {
        // Mobile
        setImgSize(240);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Initially hide everything so CSS animations don't fire early ──
  useEffect(() => {
    const el = greetingRef.current;
    if (el) gsap.set(el, { yPercent: 110, rotate: 8 });

    const content = [h1Ref.current, bodyRef.current, prevAtRef.current, btnsRef.current, photoWrapRef.current];
    content.forEach(el => { if (el) gsap.set(el, { opacity: 0, y: 50 }); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reveal: fires the moment panels start splitting ───────────────
  useEffect(() => {
    if (!revealed) return;

    const greeting = greetingRef.current;

    // नमस्ते rotates in immediately
    if (greeting) {
      gsap.fromTo(
        greeting,
        { yPercent: 110, rotate: 8 },
        { yPercent: 0, rotate: 0, duration: 0.65, ease: "power4.out",
          onComplete: () => setCycling(true) }
      );
    }

    // Content dissolves up — staggered after greeting starts
    const items = [
      h1Ref.current,
      bodyRef.current,
      prevAtRef.current,
      btnsRef.current,
    ].filter(Boolean) as HTMLElement[];

    gsap.fromTo(
      items,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.1, delay: 0.1 }
    );

    // Photo dissolves up slightly later
    if (photoWrapRef.current) {
      gsap.fromTo(
        photoWrapRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.05 }
      );
    }
  }, [revealed]);

  // ── Greeting cycle — starts after initial rotate-in completes ─────
  useEffect(() => {
    if (!cycling) return;
    const timer = setInterval(() => {
      const el = greetingRef.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: -110,
        rotate: -6,
        duration: 0.28,
        ease: "power3.in",
        onComplete: () => setIdx(p => (p + 1) % GREETINGS.length),
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [cycling]);

  // ── Slide IN when idx increments (while cycling) ──────────────────
  useLayoutEffect(() => {
    const el = greetingRef.current;
    if (!el || !cycling) return;
    gsap.fromTo(
      el,
      { yPercent: 110, rotate: 8 },
      { yPercent: 0, rotate: 0, duration: 0.65, ease: "power4.out" }
    );
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Parallax ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (photoColRef.current) {
        gsap.to(photoColRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
      if (textColRef.current) {
        gsap.to(textColRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToWorks = () => {
    document
      .getElementById("selected-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center pt-16 pb-6 sm:pb-8 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-14">

          {/* ── Left: photo ────────────────────────────────── */}
          <div ref={photoColRef} className="flex-shrink-0 flex items-center justify-center lg:justify-start mb-5 sm:mb-8 lg:mb-0">
            <div ref={photoWrapRef}>
              <PaintReveal
                alt="Om Tiwari — UX Designer"
                size={imgSize ?? 200}
                brushRadius={40}
              />
            </div>
          </div>

          {/* ── Right: text ──────────────────────────────────── */}
          <div
            ref={(el) => { rightColRef.current = el; textColRef.current = el; }}
            className="text-center lg:text-left max-w-lg"
          >
            {/* 1. Greeting */}
            <div
              className="overflow-hidden pt-4 pb-4 -mb-1"
              style={{ lineHeight: 1.3 }}
              aria-live="polite"
              aria-atomic="true"
            >
              <span
                ref={greetingRef}
                className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary"
                style={{ fontFamily: "'Manrope', 'Noto Sans', sans-serif", transformOrigin: "50% 100%" }}
                dir={GREETINGS[idx].rtl ? "rtl" : undefined}
              >
                {GREETINGS[idx].text}
              </span>
            </div>

            {/* 2. Name */}
            <h1
              ref={h1Ref}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5 sm:mb-8 lg:mb-12 leading-tight"
            >
              I&apos;m Om Tiwari
            </h1>

            {/* 3. Body */}
            <p
              ref={bodyRef}
              className="text-lg sm:text-xl text-foreground/65 mb-5 leading-relaxed"
            >
              Based in Pune, I&apos;m a{" "}
              <strong className="font-semibold text-primary">UX designer</strong>{" "}
              who has spent time exploring, staying curious, and learning to work
              across design, tech, and everything in between. A generalist by
              practice, a specialist in the making. I&apos;m drawn to projects
              that involve complexity and technicality.
            </p>

            {/* 4. Previously at */}
            <div
              ref={prevAtRef}
              className="flex items-center gap-2 mb-8 sm:mb-10 lg:mb-12 justify-center lg:justify-start"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              <p className="text-base text-foreground/55">
                Previously at{" "}
                <span className="font-semibold text-foreground/80">Antef &amp; Devnco</span>
              </p>
            </div>

            {/* 5. CTA buttons */}
            <div
              ref={btnsRef}
              className="flex flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-5 sm:px-8 text-sm sm:text-base border-2 border-foreground transition-all duration-300 flex items-center gap-2 hover:scale-105"
                onClick={scrollToWorks}
              >
                Selected Works
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-5 sm:px-8 text-sm sm:text-base border-2 border-foreground transition-all duration-300 flex items-center gap-2 hover:scale-105"
                asChild
              >
                <Link to="/about" className="flex items-center gap-2">
                  More about me
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
