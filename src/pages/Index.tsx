import { useState, useCallback, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SelectedWorks } from "@/components/SelectedWorks";
import { DesignPhilosophy } from "@/components/DesignPhilosophy";
import { TrustedBy } from "@/components/TrustedBy";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { LoadingScreen } from "@/components/LoadingScreen";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const trustedByRef    = useRef<HTMLDivElement>(null);
  const stickyWrapperRef = useRef<HTMLDivElement>(null);

  // Stable refs — won't change between renders so LoadingScreen's useEffect never re-fires
  const handleRevealStart    = useCallback(() => setRevealed(true),    []);
  const handleLoadingComplete = useCallback(() => setShowLoading(false), []);

  // Freeze the page while the loading screen plays — keeps the browser's
  // address bar from collapsing mid-animation (which is what made the
  // viewport-relative layout look "cut") and stops scrolls/taps from
  // reaching the home page underneath, so the user always lands on the
  // first fold once the reveal finishes (instead of wherever they scrolled to).
  useEffect(() => {
    if (!showLoading) return;

    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const preventScroll = (e: TouchEvent | WheelEvent) => e.preventDefault();
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      window.scrollTo(0, 0);
    };
  }, [showLoading]);

  return (
    <>
      {showLoading && (
        <LoadingScreen
          onRevealStart={handleRevealStart}
          onLoadingComplete={handleLoadingComplete}
        />
      )}
      <CustomCursor />

      {/* Main content — z-30, covers everything while in view */}
      <div className="relative z-30 bg-background">
        <Navigation />
        <Hero revealed={revealed} />
        <SelectedWorks />
      </div>

      {/* Outer wrapper — non-sticky, 300vh tall. Gives the inner sticky div
          a 200vh scroll range. stickyWrapperRef is on this outer div so GSAP
          can calculate the full reveal range correctly. */}
      <div
        ref={stickyWrapperRef}
        className="relative z-[1] bg-background min-h-[300vh]"
      >
        {/* Inner div — CSS sticky. Pins to top for the full 200vh scroll range.
            justify-center keeps the content vertically centred in the visible fold. */}
        <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center">
          <DesignPhilosophy wrapperRef={stickyWrapperRef} />
          <TrustedBy sectionRef={trustedByRef} />
        </div>
      </div>

      {/* -mt-[100vh] pulls the footer up so it enters the viewport during the
          final 100vh of the sticky period — it slides over the pinned content
          (z-20 > z-1) while the inner div is still stuck, giving a true
          full-section stack before anything scrolls away. */}
      <div className="-mt-[calc(100vh-66px)]">
        <Footer />
      </div>
    </>
  );
};

export default Index;
