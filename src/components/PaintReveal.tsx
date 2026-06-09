import { useRef, useEffect, useState } from "react";
import "./PaintReveal.css";

interface PaintRevealProps {
  alt:          string;
  size:         number;
  brushRadius?: number;
}

const TOP_SRC    = "/profile-top.png?v=2";   // grayscale — drawn on canvas, erased away
const BOTTOM_SRC = "/profile-bottom.png?v=2"; // blue-tinted — revealed underneath

export const PaintReveal = ({
  alt,
  size,
  brushRadius = 35,
}: PaintRevealProps) => {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const circleRef      = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [resetKey,      setResetKey]      = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return;

    const ctx = canvas.getContext("2d")!;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);
      // Draw TOP IMG (grayscale) on canvas — erased on hover to reveal blue below
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.src = TOP_SRC;

    const CURSOR = `url("/brush-cursor.svg") 6 26, crosshair`;

    // Erase with soft brush — only while mouse button is held
    const erase = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.shadowBlur  = 18;
      ctx.shadowColor = "black";
      ctx.beginPath();
      ctx.arc(clientX - rect.left, clientY - rect.top, brushRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur  = 0;
    };

    // Document capture — bypasses Lovable editor overlay
    const circle = circleRef.current;

    const onMouseMove = (e: MouseEvent) => {
      if (!circle) return;
      const r = circle.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom;

      if (!inside) return;
      erase(e.clientX, e.clientY);
      setHasInteracted(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!circle) return;
      const t = e.touches[0];
      const r = circle.getBoundingClientRect();
      if (t.clientX >= r.left && t.clientX <= r.right &&
          t.clientY >= r.top  && t.clientY <= r.bottom) {
        e.preventDefault(); // only block scroll when finger is inside the paint circle
        erase(t.clientX, t.clientY);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { capture: true });
    document.addEventListener("touchmove",  onTouchMove,  { capture: true, passive: false });

    return () => {
      document.removeEventListener("mousemove", onMouseMove, { capture: true });
      document.removeEventListener("touchmove",  onTouchMove,  { capture: true });
    };
  }, [size, brushRadius, resetKey]);

  return (
    /* Outer wrapper — no overflow:hidden so the hint floats above the circle */
    <div style={{ position: "relative", display: "inline-block" }}>

      {/* Curved floating hint */}
      {/* Arc radius computed to match the image circle exactly */}
      {(() => {
        const u    = 300 / 260;          // SVG units per px (viewBox/cssWidth)
        const T    = 60;                 // container offset above circle (px)
        const gap  = 15;                 // text floats this many px above circle edge
        const R    = Math.round((size / 2 + gap) * u);
        const yCtr = Math.round((T + size / 2) * u);
        const dx   = Math.min(R - 1, 148);
        const yEnd = Math.round(yCtr - Math.sqrt(R * R - dx * dx));
        const path = `M ${150 - dx} ${yEnd} A ${R} ${R} 0 0 1 ${150 + dx} ${yEnd}`;
        const vbH  = yEnd + 8;
        return (
          <div className={`curve-container${hasInteracted ? " hide" : ""}`}>
            <svg viewBox={`0 0 300 ${vbH}`} className="curve-text" overflow="visible">
              <path id="pr-curve" d={path} fill="transparent" />
              <text className="text">
                <textPath href="#pr-curve" startOffset="50%" textAnchor="middle">
                  Try hovering  ↓
                </textPath>
              </text>
            </svg>
          </div>
        );
      })()}

      {/* Circle — clips image + canvas */}
      <div
        ref={circleRef}
        role="img"
        aria-label={alt}
        onDoubleClick={() => { setHasInteracted(false); setResetKey(k => k + 1); }}
        title="Double-click to reset"
        style={{
          position:     "relative",
          width:        size,
          height:       size,
          borderRadius: "50%",
          overflow:     "hidden",
          flexShrink:   0,
          boxShadow:    "0 0 0 2px rgba(180, 180, 180, 0.5)",
        }}
      >
        <img
          src={BOTTOM_SRC}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position:   "absolute",
            top:        0,
            left:       0,
            width:      size,
            height:     size,
            objectFit:  "cover",
            display:    "block",
            userSelect: "none",
          }}
        />

        <canvas
          key={`${resetKey}-${size}`}
          ref={canvasRef}
          width={size}
          height={size}
          style={{
            position:    "absolute",
            top:         0,
            left:        0,
            display:     "block",
            touchAction: "none",
            zIndex:      1,
          }}
        />
      </div>
    </div>
  );
};
