import { useEffect, useRef } from "react";

export const CursorGlow = () => {
  const blobRef = useRef<HTMLDivElement>(null);

  // Don't render at all on touch / coarse-pointer devices (mobile & tablet)
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (isTouch) return;

    const blob = blobRef.current;
    if (!blob) return;

    let tx = -200, ty = -200; // start off-screen
    let cx = tx,  cy = ty;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      // Smooth lerp — adjust 0.1 for more/less lag
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      blob.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  // Don't mount the DOM node on touch devices at all
  if (isTouch) return null;

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      style={{
        position:        "fixed",
        top:             0,
        left:            0,
        width:           24,
        height:          24,
        marginLeft:      -12,   // centre on cursor
        marginTop:       -12,
        borderRadius:    "50%",
        pointerEvents:   "none",
        zIndex:          9997,
        background:      "rgba(93, 124, 226, 0.08)",
        border:          "1px solid rgba(93, 124, 226, 0.32)",
        backdropFilter:  "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        willChange:      "transform",
        transition:      "width 0.2s, height 0.2s, margin 0.2s, opacity 0.3s",
      }}
    />
  );
};
