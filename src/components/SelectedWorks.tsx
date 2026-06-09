import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import recovrCover from "@/assets/recovr-cover.png";
import stravaCover from "@/assets/strava-cover.png";
import mooloCover from "@/assets/moolo-cover.png";
import shelterCover from "@/assets/shelter-cover.png";
import eclipseraCover from "@/assets/eclipsera-cover.png";
import visualRepCover from "@/assets/visual-rep-cover.png";

const projects = [
  {
    id: "recovr",
    title: "RecoVr - Healing Phobias through VR",
    description:
      "A Virtual Reality app enabling users to confront and manage their phobias safely at home through immersive exposure therapy experiences.",
    tags: ["Virtual Reality", "Exposure Therapy", "Lean UX"],
    image: recovrCover,
    link: "/project/recovr",
  },
  {
    id: "moolo-iot",
    title: "IoT-Based Kids Tangible Product",
    description:
      "Iot based interactive device that simplifies complex financial concepts through engaging, hands-on learning.",
    tags: ["Tangible Interaction", "IOT", "Machine learning"],
    image: mooloCover,
    link: "/project/moolo-iot",
  },
  {
    id: "strava-gamification",
    title: "Gamifying the Strava Experience",
    description:
      "Gamified the Strava app using the Octalysis Framework. Designed and tested UI concepts to boost weak core drives, improving user motivation and engagement.",
    tags: ["UX Research", "UI Design", "Prototyping"],
    image: stravaCover,
    link: "/project/strava-gamification",
  },
  {
    id: "shelter-to-home",
    title: "Shelter to Home",
    description:
      "Creating a digital platform designed to help animal NGOs boost adoptions, attract volunteers, and secure donations. Through a data-driven approach, it identifies challenges in these areas and provides solutions to bridge the gaps effectively.",
    tags: ["Data Driven UX", "Data Visualization", "Social Design"],
    image: shelterCover,
    link: "/project/shelter-to-home",
  },
  {
    id: "eclipsera",
    title: "Eclipsera - Physical Board Game Design",
    description:
      "A sci-fi adventure board game where two universes collide. Players must close portals, face demons, and defeat a final villain to restore balance through strategic decision-making and suspense.",
    tags: ["Game Design", "Physical Product", "Prototyping"],
    image: eclipseraCover,
    link: "/project/eclipsera",
  },
  {
    id: "visual-representation",
    title: "Visual Representation",
    description:
      "Created a set of illustrations using a consistent set of visual elements to demonstrate how the same components can be rearranged and transformed to produce varied yet thematically linked visuals.",
    tags: ["Illustrations", "Mock Ups", "Semiotics"],
    image: visualRepCover,
    link: "/project/visual-representation",
  },
];

const ProjectImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export const SelectedWorks = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {

    const ctx = gsap.context(() => {
      // ── Stacking scale: push previous card back as next arrives ─
      cardRefs.current.forEach((card, i) => {
        if (!card || i === projects.length - 1) return;
        const nextCard = cardRefs.current[i + 1];
        if (!nextCard) return;

        gsap.to(card, {
          scale: 0.94,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 95%",  // delays the hand-off further — card lingers until the next one is nearly fully in view
            end: "top 40%",    // stretches the takeover across more scroll, slowing the stack transition
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    /* --card-sticky-top CSS var: mobile=142px (below nav+title bar),
       sm=162px, lg=80px (vertical sidebar mode) */
    <section
      ref={sectionRef}
      id="selected-works"
      className="relative pt-16 sm:pt-24 lg:pt-48 pb-0
                 [--card-sticky-top:142px] sm:[--card-sticky-top:162px] lg:[--card-sticky-top:80px]"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:gap-6">

          {/* ── Sticky Title — Desktop ─────────────────────────── */}
          <div className="hidden lg:block lg:w-32">
            <div className="sticky top-1/2 -translate-y-1/2">
              <h2
                className="text-5xl xl:text-6xl font-bold text-muted-foreground/30 whitespace-nowrap origin-center"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Selected Works
              </h2>
            </div>
          </div>

          {/* ── Sticky Title — Mobile / Tablet ─────────────────── */}
          <div className="lg:hidden sticky top-[66px] z-10 bg-background/80 backdrop-blur-sm -mx-6 px-7 sm:px-9 py-5 sm:py-7 mb-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-muted-foreground/30 whitespace-nowrap text-center">
              Selected Works
            </h2>
          </div>

          {/* ── Project cards ──────────────────────────────────── */}
          <div className="flex-1">
            {projects.map((project, idx) => (
              /*
               * Desktop: each card is position:sticky so it "parks" at
               * top:80px while the next card slides up over it.
               * Higher z-index = later cards paint on top.
               *
               * Mobile: normal flow with bottom margin between cards.
               */
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className="mb-0 sticky"
                style={{
                  /*
                   * Mobile/tablet: stick below the "Selected Works" sticky title bar.
                   * Title bar = nav (66px) + its own height (~76px mobile, ~92px sm).
                   * Desktop: title is a vertical side-label — cards park at 80px.
                   * Last card parks at the same top so its flex-center brings content
                   * to the viewport middle.
                   */
                  top: "var(--card-sticky-top, 80px)",
                  zIndex: idx + 1,
                }}
              >
                <Link to={project.link} className="block">
                  <article
                    className={`
                      flex flex-col justify-start lg:flex-row-reverse lg:justify-center lg:items-center
                      gap-5 sm:gap-8 lg:gap-12
                      cursor-pointer group
                      bg-background rounded-2xl
                      px-6 sm:px-8 lg:px-10 py-6 sm:py-10
                      ${idx === projects.length - 1
                        ? "min-h-[60vh] sm:min-h-[65vh] lg:min-h-[72vh]"
                        : "min-h-[80vh] sm:min-h-[85vh] lg:min-h-[72vh]"}
                    `}
                  >
                    {/* Project Image */}
                    <div className="lg:w-1/2">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                        <ProjectImage src={project.image} alt={project.title} />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="lg:w-1/2 space-y-4 sm:space-y-6">
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap lg:flex-nowrap gap-2">
                        {project.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full px-2.5 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm border-2 border-foreground whitespace-nowrap"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="w-12 h-0.5 bg-foreground" />

                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>

                      <span className="inline-flex items-center gap-2 text-lg font-medium text-primary group-hover:underline">
                        View Project
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
