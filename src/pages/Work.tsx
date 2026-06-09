import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import recovrCover from "@/assets/recovr-cover.png";
import kazeCover from "@/assets/kaze-cover.png";
import eclipseraCover from "@/assets/eclipsera-cover.png";
import stravaCover from "@/assets/strava-cover.png";
import mooloCover from "@/assets/moolo-cover.png";
import shelterCover from "@/assets/shelter-cover.png";
import kalakoshaCover from "@/assets/kalakosha-cover.png";
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
    category: "Immersive & Interaction Design",
  },
  {
    id: "strava-gamification",
    title: "Gamifying the Strava Experience",
    description:
      "Gamified the Strava app using the Octalysis Framework. Designed and tested UI concepts to boost weak core drives, improving user motivation and engagement.",
    tags: ["UX Research", "UI Design", "Prototyping"],
    image: stravaCover,
    link: "/project/strava-gamification",
    category: "UX Design",
  },
  {
    id: "moolo-iot",
    title: "IoT-Based Kids Tangible Product",
    description:
      "Iot based interactive device that simplifies complex financial concepts through engaging, hands-on learning.",
    tags: ["Tangible Interaction", "IOT", "Machine learning"],
    image: mooloCover,
    link: "/project/moolo-iot",
    category: "Immersive & Interaction Design",
  },
  {
    id: "shelter-to-home",
    title: "Shelter to Home",
    description:
      "Creating a digital platform designed to help animal NGOs boost adoptions, attract volunteers, and secure donations. Through a data-driven approach, it identifies challenges in these areas and provides solutions to bridge the gaps effectively.",
    tags: ["Data Driven UX", "Data Visualization", "Social Design"],
    image: shelterCover,
    link: "/project/shelter-to-home",
    category: "UX Design",
  },
  {
    id: "visual-representation",
    title: "Visual Representation",
    description:
      "Created a set of illustrations using a consistent set of visual elements to demonstrate how the same components can be rearranged and transformed to produce varied yet thematically linked visuals.",
    tags: ["Illustrations", "Mock Ups", "Semiotics"],
    image: visualRepCover,
    link: "/project/visual-representation",
    category: "Visual Design",
  },
  {
    id: "eclipsera",
    title: "Eclipsera - Physical Board Game Design",
    description:
      "A sci-fi adventure board game where two universes collide. Players must close portals, face demons, and defeat a final villain to restore balance through strategic decision-making and suspense.",
    tags: ["Game Design", "Physical Product", "Prototyping"],
    image: eclipseraCover,
    link: "/project/eclipsera",
    category: "Immersive & Interaction Design",
  },
  {
    id: "kaze-airlines",
    title: "Kaze Airlines Branding",
    description:
      "A comprehensive branding project for Kaze Airlines, creating a cohesive visual identity that captures the essence of modern air travel with Japanese-inspired elegance and simplicity.",
    tags: ["Branding", "Visual Identity", "UI Design"],
    image: kazeCover,
    link: "/project/kaze-airlines",
    category: "Visual Design",
  },
  {
    id: "kala-kosha",
    title: "Kala Kosha",
    description:
      "Empowering traditional Indian artisans by providing digital tools to showcase their craft globally, enhancing their reach, recognition, and financial stability.",
    tags: ["Dashboard", "User Interface", "Prototyping"],
    image: kalakoshaCover,
    link: "/project/kala-kosha",
    category: "UX Design",
  },
];

const CATEGORIES = [
  "All Projects",
  "UX Design",
  "Immersive & Interaction Design",
  "Visual Design",
  "Photography",
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

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const [category, setCategory] = useState("All Projects");

  const filteredProjects =
    category === "All Projects" ? projects : projects.filter((p) => p.category === category);

  const renderCard = (project: (typeof projects)[number], idx: number) => {
    const isLast = idx === filteredProjects.length - 1;
    return (
      <div
        key={project.id}
        ref={(el) => { cardRefs.current[idx] = el; }}
        className={`mb-0 sticky ${idx === 0 ? "translate-y-4" : ""}`}
        style={{
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
              ${isLast
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
                {project.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
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
    );
  };

  useEffect(() => {

    const ctx = gsap.context(() => {
      // ── Stacking scale: push previous card back as next arrives ─
      // Mirrors the home page's Selected Works stacking effect.
      cardRefs.current.forEach((card, i) => {
        if (!card || i === filteredProjects.length - 1) return;
        const nextCard = cardRefs.current[i + 1];
        if (!nextCard) return;

        gsap.to(card, {
          scale: 0.94,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 95%",
            end: "top 40%",
            scrub: true,
          },
        });
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects.length, category]);

  // Fade the filter bar out as the last project card approaches, so it
  // scrolls up together with the last project instead of lingering near
  // (or overlapping) the footer.
  useEffect(() => {
    const bar = filterBarRef.current;
    if (!bar) return;

    const updateVisibility = () => {
      const lastCard = cardRefs.current[filteredProjects.length - 1];
      if (!lastCard) return;
      const threshold = bar.getBoundingClientRect().height + 80;
      const lastCardTop = lastCard.getBoundingClientRect().top;
      const hidden = lastCardTop <= threshold;
      bar.style.opacity = hidden ? "0" : "1";
      bar.style.pointerEvents = hidden ? "none" : "auto";
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [filteredProjects.length, category]);

  return (
    <div className="min-h-screen">
      <CustomCursor />
      <Navigation />

      {/* --card-sticky-top CSS var: mobile=194px (below nav + combined filter/title bar),
          sm=198px, lg=162px (below nav+filter bar, vertical sidebar mode) */}
      <section
        ref={sectionRef}
        className="relative pt-10 lg:pt-16 pb-0
                   [--card-sticky-top:194px] sm:[--card-sticky-top:198px] lg:[--card-sticky-top:162px]"
      >
        <div className="container mx-auto px-6">
          {/* Filter bar — sticky below the nav, centered on the full
              container width (not the narrower projects column) so it
              doesn't look skewed right past the sidebar title. A scroll
              listener (see effect below) fades it out as the last project
              approaches, so it scrolls up together with the last card
              instead of lingering into the footer. */}
          <div
            ref={filterBarRef}
            className="sticky top-[66px] z-30 bg-background/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none pt-5 pb-4 lg:pt-8 lg:pb-6 -mx-6 px-6 flex flex-col items-center gap-4 lg:flex-row lg:justify-center transition-opacity duration-300"
          >
            <h2 className="lg:hidden text-3xl sm:text-4xl font-bold text-muted-foreground/30 whitespace-nowrap text-center">
              All Projects
            </h2>
            <Select value={category} onValueChange={setCategory} modal={false}>
              <SelectTrigger className="w-[240px] sm:w-[300px] rounded-full border-2 border-foreground bg-background no-custom-cursor">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-6">
            {/* Sticky Title - Desktop */}
            <div className="hidden lg:block lg:w-32">
              <div className="sticky top-1/2 -translate-y-1/2">
                <h2
                  className="text-5xl xl:text-6xl font-bold text-muted-foreground/30 whitespace-nowrap origin-center"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  All Projects
                </h2>
              </div>
            </div>

            {/* Projects */}
            <div className="flex-1">
              {filteredProjects.length === 0 ? (
                <div className="min-h-[50vh] flex items-center justify-center">
                  <p className="text-lg sm:text-xl text-muted-foreground text-center">
                    Projects in this category are coming soon.
                  </p>
                </div>
              ) : (
              <div className="relative">
                {filteredProjects.map((project, idx) => renderCard(project, idx))}
              </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Work;
