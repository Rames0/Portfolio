"use client";

import type React from "react";
import { useEntranceReady } from "@/lib/entrance";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";

export interface ScrollTypewriterProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "li" | "div";
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  threshold?: number;
  rootMargin?: string;
  onComplete?: () => void;
}

/**
 * @param {ScrollTypewriterProps} props
 * @param {string} props.text
 * @param {string} [props.as]
 * @param {string} [props.className]
 * @param {number} [props.speed]
 * @param {number} [props.delay]
 * @param {boolean} [props.cursor]
 * @param {number} [props.threshold]
 * @param {string} [props.rootMargin]
 * @param {() => void} [props.onComplete]
 * @returns {React.JSX.Element}
 */
export const ScrollTypewriter: React.FC<ScrollTypewriterProps> = (props) => {
  const {
    text,
    as = "p",
    className = "",
    speed,
    delay = 140,
    cursor = true,
    threshold = 0.12,
    rootMargin = "0px 0px -40px 0px",
    onComplete,
  } = props;

  const entranceReady = useEntranceReady();
  const reducedMotion = usePrefersReducedMotion();
  const [charCount, setCharCount] = useState(text.length);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Smooth, deliberate pacing: allows words to stream cleanly as you scroll
  const resolvedSpeed =
    speed ??
    (text.length > 200
      ? 18
      : text.length > 80
        ? 22
        : text.length > 30
          ? 28
          : 34);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setCharCount(text.length);
      setIsDone(true);
      return;
    }

    setCharCount(0);
    setHasStarted(false);
    setIsDone(false);
    if (!entranceReady) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          timeoutRef.current = setTimeout(() => {
            setHasStarted(true);
            let current = 0;

            intervalRef.current = setInterval(() => {
              current = Math.min(current + 1, text.length);
              setCharCount(current);

              if (current >= text.length) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
                setIsDone(true);
                onComplete?.();
              }
            }, resolvedSpeed);
          }, delay);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    text,
    delay,
    resolvedSpeed,
    threshold,
    rootMargin,
    onComplete,
    reducedMotion,
    entranceReady,
  ]);

  const displayedText = text.slice(0, charCount);
  const showCursor = cursor && hasStarted && !isDone;

  const content = (
    <>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className="grid grid-cols-1 grid-rows-1 relative"
      >
        {/* Invisible Sizer (Guarantees 0.00 CLS) */}
        <span
          className="col-start-1 row-start-1 invisible select-none pointer-events-none"
          aria-hidden="true"
        >
          {text}
        </span>

        {/* Active Typed Stream */}
        <span className="col-start-1 row-start-1">
          {displayedText}
          {showCursor && <span className="typing-cursor" aria-hidden="true" />}
        </span>
      </span>
    </>
  );

  if (as === "li") {
    return (
      <li
        ref={containerRef as unknown as React.RefObject<HTMLLIElement>}
        className={className}
      >
        {content}
      </li>
    );
  }

  const Tag = as as "div";
  return (
    <Tag ref={containerRef} className={className}>
      {content}
    </Tag>
  );
};
