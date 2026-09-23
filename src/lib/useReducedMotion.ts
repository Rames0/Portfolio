"use client";

import { useEffect, useState } from "react";

/**
 * Returns false by default so 3D animations, WebGL starfield, GSAP intro,
 * and tilt are always enabled (identical to 3D/js/smooth.js).
 * Only disabled if ?motion=off is explicitly provided.
 */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(isReducedMotionEnabled());
  }, []);

  return reducedMotion;
}

/** Respect explicit motion=off flag. Motion is enabled by default. */
export function isReducedMotionEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const preference = new URLSearchParams(window.location.search).get("motion");
  return preference === "off";
}

export function useMotionOff(): boolean {
  const [motionOff, setMotionOff] = useState(false);
  useEffect(() => {
    setMotionOff(isReducedMotionEnabled());
  }, []);
  return motionOff;
}
