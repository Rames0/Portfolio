"use client";

import { Orbit } from "lucide-react";
import { useEffect, useState } from "react";
import { isReducedMotionEnabled } from "@/lib/useReducedMotion";

/** An explicit opt-in for visitors whose system asks for reduced motion. */
export function MotionPreferenceToggle() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(isReducedMotionEnabled());
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const toggle = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("motion", reduced ? "on" : "off");
    window.location.assign(url.href);
  };

  return (
    <button
      type="button"
      className="motion-preference-toggle"
      onClick={toggle}
      aria-label={reduced ? "Enable 3D animation" : "Disable 3D animation"}
      aria-pressed={!reduced}
      title={reduced ? "Enable 3D animation" : "Disable 3D animation"}
    >
      <Orbit size={16} aria-hidden="true" />
      <span>3D {reduced ? "Off" : "On"}</span>
    </button>
  );
}
