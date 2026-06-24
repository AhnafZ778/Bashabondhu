"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

const TOTAL_FRAMES = 236;

/**
 * Generates the frame URL for a given index (1-based).
 */
function getFrameUrl(index: number): string {
  const padded = String(index).padStart(3, "0");
  return `/frames/ezgif-frame-${padded}.png`;
}

/**
 * ScrollVideo — Navana-style ultra-smooth scroll-driven frame playback.
 *
 * KEY SMOOTHNESS TECHNIQUE:
 * Instead of directly mapping scroll → frame (jerky), we use a continuous
 * rAF animation loop with LERP (linear interpolation).
 *
 * - Scroll events set a "target" fractional frame
 * - A 60fps rAF loop smoothly interpolates the "current" frame towards
 *   the target using: current += (target - current) * LERP_FACTOR
 * - This creates the signature "keeps drifting for a few frames after
 *   you stop scrolling" feel that premium sites like Navana use.
 *
 * The scroll runway is kept short (12px/frame ≈ 2832px total) so the
 * user doesn't need excessive scrolling to get through the animation.
 */
export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Lerp animation state (refs to avoid re-renders) ---
  const targetFrameRef = useRef<number>(0);      // where scroll wants us to be (fractional)
  const currentFrameRef = useRef<number>(0);      // smoothly interpolated position (fractional)
  const lastDrawnFrameRef = useRef<number>(-1);   // last integer frame we painted
  const rafRef = useRef<number | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  // Pixels of scroll per frame — much shorter runway for quicker playthrough
  const PIXELS_PER_FRAME = 12;

  // Lerp factor: lower = smoother/slower trailing, higher = snappier
  // 0.08 gives that luxurious Navana-style drift
  const LERP_FACTOR = 0.08;

  /**
   * Draw a specific frame index onto the canvas, maintaining aspect ratio
   * and covering the full viewport (like object-fit: cover).
   */
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[frameIndex];
    if (!canvas || !ctx || !img || !img.complete || !img.naturalWidth) return;

    // Match canvas internal resolution to its display size
    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;

    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.scale(dpr, dpr);
    }

    // Cover-fit: calculate source crop
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = displayW / displayH;

    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgAspect > canvasAspect) {
      // Image wider → crop sides
      sw = img.naturalHeight * canvasAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Image taller → crop top/bottom
      sh = img.naturalWidth / canvasAspect;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.clearRect(0, 0, displayW, displayH);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, displayW, displayH);
  }, []);

  /**
   * Continuous animation loop — the heart of the smooth scrolling.
   * Runs at 60fps and lerps currentFrame towards targetFrame.
   * Stops itself when close enough to save CPU.
   */
  const animate = useCallback(() => {
    const target = targetFrameRef.current;
    const current = currentFrameRef.current;
    const diff = target - current;

    // Lerp: smoothly approach the target
    let next = current + diff * LERP_FACTOR;

    // Snap when very close (< 0.1 of a frame)
    if (Math.abs(diff) < 0.1) {
      next = target;
    }

    currentFrameRef.current = next;

    // Determine which integer frame to draw
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(next))
    );

    // Only repaint canvas when the integer frame actually changes
    if (frameIndex !== lastDrawnFrameRef.current) {
      lastDrawnFrameRef.current = frameIndex;
      drawFrame(frameIndex);
    }

    // Update overlay opacity (direct DOM manipulation for perf)
    if (overlayRef.current) {
      const progress = next / (TOTAL_FRAMES - 1);
      const fadeEnd = 0.15;
      const opacity = Math.max(0, 1 - progress / fadeEnd);
      overlayRef.current.style.opacity = String(opacity);
      overlayRef.current.style.pointerEvents = opacity === 0 ? "none" : "auto";
    }

    // Keep animating if we haven't converged
    if (Math.abs(diff) > 0.05) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      isAnimatingRef.current = false;
      rafRef.current = null;
    }
  }, [drawFrame]);

  /**
   * Kick off the animation loop if it's not already running.
   */
  const startAnimation = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  /**
   * Pre-load all frame images on mount.
   */
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i + 1);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
          drawFrame(0);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.src = "";
      });
    };
  }, [drawFrame]);

  /**
   * Scroll handler: computes the target frame from scroll position.
   * The actual frame drawing happens in the lerp animation loop.
   */
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || !isLoaded) return;

      const rect = container.getBoundingClientRect();
      const scrollTop = -rect.top;
      const maxScroll = container.scrollHeight - window.innerHeight;

      // Snap boundaries instantly to avoid lerping/rendering when outside video bounds
      if (scrollTop < 0) {
        targetFrameRef.current = 0;
        currentFrameRef.current = 0;
        drawFrame(0);
        return;
      }
      if (scrollTop > maxScroll) {
        targetFrameRef.current = TOTAL_FRAMES - 1;
        currentFrameRef.current = TOTAL_FRAMES - 1;
        drawFrame(TOTAL_FRAMES - 1);
        return;
      }

      const progress = scrollTop / maxScroll;
      const targetFrame = progress * (TOTAL_FRAMES - 1);

      targetFrameRef.current = targetFrame;

      // Start the smooth animation loop (it's a no-op if already running)
      startAnimation();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const handleResize = () => drawFrame(lastDrawnFrameRef.current >= 0 ? lastDrawnFrameRef.current : 0);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, isLoaded, startAnimation]);

  const totalHeight = TOTAL_FRAMES * PIXELS_PER_FRAME;

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${totalHeight}px` }}
    >
      {/* Sticky canvas — viewport-locked while scrolling through the container */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />

        {/* Cinematic Text Overlay */}
        {isLoaded && (
          <div
            ref={overlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center pointer-events-none"
          >
            <p className="text-gold font-serif text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4">
              BasaBondhu
            </p>
            <h1 className="text-white font-serif text-3xl sm:text-5xl lg:text-7xl uppercase tracking-[0.25em] leading-tight select-none">
              Broaden Home<br />Boundaries
            </h1>
          </div>
        )}

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
              Loading Experience · {loadProgress}%
            </p>
          </div>
        )}

        {/* Scroll hint at the very start */}
        {isLoaded && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce opacity-60 pointer-events-none">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">
              Scroll to explore
            </p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
