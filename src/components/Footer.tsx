import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLenis } from "@/lib/lenis";
import TextPressure from "@/components/TextPressure";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Home",    href: "/"        },
  { label: "Work",    href: "/work"    },
  { label: "About",   href: "/about"   },
  { label: "Contact", href: "/contact" },
  { label: "Resume",  href: "/Om_Tiwari_Resume.pdf", download: true },
];

const PROJECTS = [
  { label: "RecoVr",              href: "/project/recovr"                },
  { label: "IoT Kids Product",    href: "/project/moolo-iot"             },
  { label: "Strava Experience",   href: "/project/strava-gamification"   },
  { label: "Shelter to Home",     href: "/project/shelter-to-home"       },
  { label: "Eclipsera",           href: "/project/eclipsera"             },
  { label: "Visual Representation", href: "/project/visual-representation" },
  { label: "Kaze Airlines Branding", href: "/project/kaze-airlines"         },
  { label: "Kala Kosha",             href: "/project/kala-kosha"             },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/om-tiwari-6b100627b" },
  { label: "Behance",  href: "https://www.behance.net/omtiwari2"                },
  { label: "Email",    href: "mailto:omtiwari.pune@gmail.com"                   },
];

export const Footer = () => {
  const lenis      = useLenis();
  const footerRef  = useRef<HTMLElement>(null);
  const scrollUpRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);

  const scrollToTop = () => {
    // Brief scale-pulse so the click feels tactile
    if (scrollUpRef.current) {
      gsap.timeline()
        .to(scrollUpRef.current, { scale: 1.03, duration: 0.14, ease: "power2.out" })
        .to(scrollUpRef.current, { scale: 1,    duration: 0.35, ease: "elastic.out(1, 0.5)" });
    }
    // Smooth scroll to top — quartic ease-out feels like a satisfying whoosh
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 2.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    window.location.href =
      `mailto:omtiwari.pune@gmail.com` +
      `?subject=${encodeURIComponent("Message from Portfolio")}` +
      `&body=${encodeURIComponent(trimmed)}`;
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };


  return (
    <footer
      ref={footerRef}
      className="relative z-20 bg-primary text-primary-foreground rounded-t-[2rem] overflow-hidden
                 min-h-[calc(100vh-66px)] flex flex-col"
    >
      <div className="flex flex-col flex-1">

        {/* ── Main content grid ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-10 sm:gap-10
                        px-6 sm:px-8 lg:px-16 pt-6 sm:pt-10 lg:pt-20 pb-4 sm:pb-10">

          {/* LEFT — Say Hello + blurb + message CTA */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:w-[48%]">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-tight tracking-tight text-white">
              Say Hello.
            </h2>

            <p className="text-white/65 text-base sm:text-lg leading-relaxed">
              I'd love to hear your thoughts or suggestions on my work!<br className="hidden sm:block" />
              You can also reach out for collaborations or just say hello!
            </p>

            <div className="flex gap-3 items-center w-full max-w-[480px] mt-auto">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Write a message"
                className="flex-1 min-w-0 bg-transparent border border-white/25 rounded-full
                           px-5 py-3 text-sm text-white placeholder:text-white/35
                           focus:outline-none focus:border-white/65 transition-colors"
              />
              <button
                onClick={handleSend}
                style={{ background: "#ffffff", color: "hsl(var(--primary))" }}
                className="font-bold rounded-full px-6 py-3 text-sm active:scale-95
                           transition-all duration-200 whitespace-nowrap hover:brightness-95"
              >
                {sent ? "Sent ✓" : "Send"}
              </button>
            </div>
          </div>

          {/* RIGHT — Pages, Projects, Socials — each section separated by a divider */}
          <div className="flex flex-col lg:w-[45%]">

            {/* Pages */}
            <div className="flex flex-col gap-2 py-4 sm:py-7 border-b border-white/10">
              <span className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-1">
                Pages
              </span>
              <nav className="flex flex-row flex-wrap gap-x-10 gap-y-3">
                {NAV_LINKS.map(({ label, href, download }) =>
                  download ? (
                    <a key={label} href={href} download
                      className="text-white text-[15px] font-medium hover:text-white/60 transition-colors whitespace-nowrap">
                      {label}
                    </a>
                  ) : (
                    <Link key={label} to={href}
                      className="text-white text-[15px] font-medium hover:text-white/60 transition-colors whitespace-nowrap">
                      {label}
                    </Link>
                  )
                )}
              </nav>
            </div>

            {/* Projects */}
            <div className="flex flex-col gap-2 py-4 sm:py-7 border-b border-white/10">
              <span className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-1">
                Projects
              </span>
              <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-x-8 sm:gap-x-10 gap-y-2 sm:gap-y-3">
                {PROJECTS.map(({ label, href }) => (
                  <Link key={label} to={href}
                    className="text-white text-[15px] font-medium hover:text-white/60 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-2 pt-4 sm:pt-7">
              <span className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mb-1">
                Socials
              </span>
              <div className="flex flex-row flex-wrap gap-x-10 gap-y-3">
                {SOCIALS.map(({ label, href }) => (
                  <a key={label} href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white text-[15px] font-medium hover:text-white/60 transition-colors whitespace-nowrap">
                    {label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Gap between links and SCROLL UP — pushes bottom section down on all sizes */}
        <div className="flex-1" />

        {/*
          ── SCROLL UP ──────────────────────────────────────────────
          scale=false → fontSize = containerWidth / 4.5 (fills width).
          Container height ≈ 88 % of that fontSize (containerW / 5.1
          ≈ 19.6 vw). overflow-hidden clips the bottom ~12 % of the
          letter strokes flush against the border-t line.
        */}
        <div
          ref={scrollUpRef}
          className="w-full overflow-hidden cursor-pointer select-none"
          style={{ height: "clamp(60px, calc(21.4vw - 3.5px), 308px)" }}
          onClick={scrollToTop}
          title="Scroll to top"
        >
          <div className="w-full h-full px-2">
            <TextPressure
              text="SCROLL UP"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              scale={false}
              textColor="#ffffff"
              minFontSize={36}
            />
          </div>
        </div>

        {/* ── Copyright top line — flush against clipped text ── */}
        <div className="w-full border-t border-white/15" />

        {/* ── Credits ───────────────────────────────────────── */}
        <div className="px-6 sm:px-8 lg:px-16 py-3 flex items-center justify-between
                        text-[10px] sm:text-xs font-light tracking-wide text-white/70">
          <span>Design &amp; Developed by Om.</span>
          <span>© 2026. All rights reserved</span>
        </div>

      </div>
    </footer>
  );
};
