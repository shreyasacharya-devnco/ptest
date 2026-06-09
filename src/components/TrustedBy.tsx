import { useEffect, useState } from "react";
import { LogoLoop, LogoItem } from "@/components/LogoLoop";

function Logo({ src, alt, heightClass = "h-10" }: { src: string; alt: string; heightClass?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${heightClass} w-auto object-contain block select-none [-webkit-user-drag:none]
                 [filter:brightness(0.24)] dark:[filter:none]
                 opacity-50 hover:opacity-100
                 transition-all duration-300`}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

const LOGOS: LogoItem[] = [
  { node: <Logo src="/logos/devnco.svg"     alt="Devnco"                               /> },
  { node: <Logo src="/logos/mitsd.svg"      alt="MITSD"                                /> },
  { node: <Logo src="/logos/antef.svg"      alt="Antef"                                /> },
  { node: <Logo src="/logos/gdg.svg"        alt="GDG"         heightClass="h-14"       /> },
  { node: <Logo src="/logos/ystoxx.svg"     alt="Y Stoxx"                              /> },
  { node: <Logo src="/logos/space-apps.svg" alt="NASA Space Apps" heightClass="h-14"   /> },
  { node: <Logo src="/logos/zestrix.svg"    alt="Zestrix Solutions"                    /> },
  { node: <Logo src="/logos/eg.svg"         alt="EG"          heightClass="h-14"       /> },
];

// Pure CSS marquee for mobile — no JS RAF, no velocity smoothing, no initialization burst.
// translateX(-50%) moves exactly one logo-set width, creating a perfect seamless loop.
function MobileMarquee() {
  return (
    <div className="relative" style={{ overflowX: "clip" }}>
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12"
        style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12"
        style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
      />

      {/* Two identical copies — CSS moves the track by -50% which equals exactly one set */}
      <div
        className="flex items-center"
        style={{ gap: "64px", width: "max-content", animation: "trustedby-scroll 30s linear infinite" }}
      >
        {[...LOGOS, ...LOGOS].map((item, i) => (
          <div key={i} className="flex-none flex items-center">
            {"node" in item ? (item as any).node : (
              <img src={(item as any).src} alt={(item as any).alt || ""} className="h-10 w-auto" draggable={false} />
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes trustedby-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

interface TrustedByProps {
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}

export const TrustedBy = ({ sectionRef }: TrustedByProps) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div ref={sectionRef} className="mt-16 sm:mt-24 lg:mt-28 pb-6 px-4 sm:px-6">
      <div className="container mx-auto">
        <h3 className="text-center text-lg sm:text-2xl font-medium mb-6 sm:mb-8">
          Earning the Trust of People at
        </h3>

        {isMobile ? (
          <MobileMarquee />
        ) : (
          <LogoLoop
            logos={LOGOS}
            scaleOnHover
            speed={60}
            logoHeight={56}
            gap={96}
            fadeOut
            hoverSpeed={12}
            ariaLabel="Companies and organisations Om has worked with"
          />
        )}
      </div>
    </div>
  );
};
