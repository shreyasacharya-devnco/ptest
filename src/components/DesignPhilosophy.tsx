import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface DesignPhilosophyProps {
  /** Ref to the sticky wrapper — used as GSAP trigger so the reveal maps to the sticky scroll range */
  wrapperRef?: React.RefObject<HTMLDivElement | null>;
}

export const DesignPhilosophy = ({ wrapperRef }: DesignPhilosophyProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: buttonsRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center px-6"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-12">

          {/* Word-by-word scroll reveal */}
          <ScrollReveal
            triggerRef={wrapperRef}
            baseOpacity={0.22}
            enableBlur={false}
            baseRotation={0}
            wordAnimationEnd="top -70%"
            containerClassName="w-full"
            textClassName="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-foreground"
          >
            Design isn't learned once; it's rediscovered with every new lesson.
          </ScrollReveal>

          <div
            ref={buttonsRef}
            className="flex flex-row gap-3 sm:gap-4 justify-center"
            style={{ opacity: 0 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-5 sm:px-8 text-sm sm:text-base border-2 border-foreground transition-all duration-300 flex items-center gap-2 hover:scale-105"
              asChild
            >
              <Link to="/work" className="flex items-center gap-2">
                View all work
                <ArrowUpRight className="h-4 w-4" />
              </Link>
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
    </section>
  );
};
