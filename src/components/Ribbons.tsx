import React, { useRef, useEffect } from "react";

export interface RibbonsProps {
  baseThickness?: number;
  colors?: string[];
  speedMultiplier?: number;
  maxAge?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
}

interface Point {
  x: number;
  y: number;
  t: number;
}

const Ribbons: React.FC<RibbonsProps> = ({
  baseThickness = 4,
  colors = ["#fff"],
  speedMultiplier = 1,
  maxAge = 500,
  enableFade = true,
  // enableShaderEffect intentionally unused (canvas fallback)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale maxAge by speedMultiplier so lower speed = longer trail
    const effectiveMaxAge = maxAge / Math.max(speedMultiplier, 0.01);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      pointsRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      // Cap array to avoid unbounded growth
      if (pointsRef.current.length > 300) {
        pointsRef.current = pointsRef.current.slice(-300);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      const now = Date.now();

      // Purge expired points
      pointsRef.current = pointsRef.current.filter(
        (p) => now - p.t < effectiveMaxAge
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = pointsRef.current;

      if (pts.length >= 3) {
        const colorCount = colors.length;

        for (let i = 1; i < pts.length; i++) {
          const curr = pts[i];
          const prev = pts[i - 1];

          const age = now - curr.t;
          const lifeRatio = Math.max(0, 1 - age / effectiveMaxAge);
          if (lifeRatio <= 0) continue;

          const prevAge = now - prev.t;
          const prevLifeRatio = Math.max(0, 1 - prevAge / effectiveMaxAge);

          const alpha = enableFade ? Math.pow(lifeRatio, 0.6) : 1;
          const halfW = (baseThickness / 2) * lifeRatio;
          const prevHalfW = (baseThickness / 2) * prevLifeRatio;

          if (halfW < 0.15) continue;

          // Direction vector for this segment
          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          const segLen = Math.sqrt(dx * dx + dy * dy);
          if (segLen < 0.1) continue;

          // Perpendicular unit vector (ribbon width axis)
          const nx = -dy / segLen;
          const ny = dx / segLen;

          // Four corners of the ribbon trapezoid
          const x0 = prev.x + nx * prevHalfW;
          const y0 = prev.y + ny * prevHalfW;
          const x1 = prev.x - nx * prevHalfW;
          const y1 = prev.y - ny * prevHalfW;
          const x2 = curr.x - nx * halfW;
          const y2 = curr.y - ny * halfW;
          const x3 = curr.x + nx * halfW;
          const y3 = curr.y + ny * halfW;

          const color = colors[i % colorCount] ?? colors[0];

          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [baseThickness, colors, speedMultiplier, maxAge, enableFade]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9996 }}
    />
  );
};

export default Ribbons;
