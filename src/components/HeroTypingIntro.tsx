"use client";

import { useEntranceReady } from "@/lib/entrance";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";

const HEADING_PREFIX = "Architecting ";
const HEADING_HIGHLIGHT = "resilient web systems";
const HEADING_SUFFIX = " with modern craft.";
const FULL_HEADING = HEADING_PREFIX + HEADING_HIGHLIGHT + HEADING_SUFFIX;

const FULL_DESC =
  "I'm Ramesh Maharjan — Full-Stack Developer & UI/UX Designer at NIRC Nepal. I specialize in building high-performance web applications, combining transactional relational data integrity (PostgreSQL & MariaDB ACID row locks) with fluid, human-centered interfaces (Next.js 16, React 19, TypeScript, Tailwind CSS).";

export function HeroTypingIntro() {
  const entranceReady = useEntranceReady();
  const reducedMotion = usePrefersReducedMotion();
  const [headingCharCount, setHeadingCharCount] = useState(FULL_HEADING.length);
  const [descCharCount, setDescCharCount] = useState(FULL_DESC.length);
  const [cursorLocation, setCursorLocation] = useState<
    "heading" | "pause" | "desc"
  >("heading");

  // Keep track of active timers for clean unmount
  const timersRef = useRef<{
    interval?: NodeJS.Timeout;
    timeout?: NodeJS.Timeout;
  }>({});

  const clearAllTimers = () => {
    if (timersRef.current.interval) {
      clearInterval(timersRef.current.interval);
      timersRef.current.interval = undefined;
    }
    if (timersRef.current.timeout) {
      clearTimeout(timersRef.current.timeout);
      timersRef.current.timeout = undefined;
    }
  };

  useEffect(() => {
    if (reducedMotion) {
      setHeadingCharCount(FULL_HEADING.length);
      setDescCharCount(FULL_DESC.length);
      setCursorLocation("pause");
      return;
    }
    setHeadingCharCount(0);
    setDescCharCount(0);
    setCursorLocation("heading");
    if (!entranceReady) return;
    let currentHeading = 0;
    let currentDesc = 0;

    const startTypingHeading = () => {
      timersRef.current.interval = setInterval(() => {
        currentHeading += 1;
        setHeadingCharCount(currentHeading);

        if (currentHeading >= FULL_HEADING.length) {
          if (timersRef.current.interval) {
            clearInterval(timersRef.current.interval);
          }
          setCursorLocation("pause");

          // Natural conversational pause between headline and bio
          timersRef.current.timeout = setTimeout(() => {
            setCursorLocation("desc");
            startTypingDesc();
          }, 320);
        }
      }, 30);
    };

    const startTypingDesc = () => {
      timersRef.current.interval = setInterval(() => {
        currentDesc += 1;
        setDescCharCount(currentDesc);

        if (currentDesc >= FULL_DESC.length) {
          if (timersRef.current.interval) {
            clearInterval(timersRef.current.interval);
          }
        }
      }, 10);
    };

    // 120ms initial buffer so first paint renders stably before stream starts
    timersRef.current.timeout = setTimeout(() => {
      startTypingHeading();
    }, 120);

    return () => {
      clearAllTimers();
    };
  }, [reducedMotion, entranceReady]);

  // Compute text fragments
  const prefixLength = HEADING_PREFIX.length;
  const highlightLength = HEADING_HIGHLIGHT.length;

  const prefixPart = HEADING_PREFIX.slice(
    0,
    Math.min(headingCharCount, prefixLength),
  );

  const highlightPart =
    headingCharCount > prefixLength
      ? HEADING_HIGHLIGHT.slice(
          0,
          Math.min(headingCharCount - prefixLength, highlightLength),
        )
      : "";

  const suffixPart =
    headingCharCount > prefixLength + highlightLength
      ? HEADING_SUFFIX.slice(
          0,
          headingCharCount - prefixLength - highlightLength,
        )
      : "";

  const descPart = FULL_DESC.slice(0, descCharCount);

  // Determine cursor positions
  const showPrefixCursor =
    cursorLocation === "heading" && headingCharCount <= prefixLength;

  const showHighlightCursor =
    cursorLocation === "heading" &&
    headingCharCount > prefixLength &&
    headingCharCount <= prefixLength + highlightLength;

  const showSuffixCursor =
    (cursorLocation === "heading" &&
      headingCharCount > prefixLength + highlightLength) ||
    cursorLocation === "pause";

  const showDescCursor =
    !reducedMotion &&
    cursorLocation === "desc" &&
    descCharCount < FULL_DESC.length;

  return (
    <div className="grid grid-cols-1 grid-rows-1 relative">
      {/* Invisible Sizer (Guarantees zero Cumulative Layout Shift) */}
      <div
        className="col-start-1 row-start-1 invisible select-none pointer-events-none"
        aria-hidden="true"
      >
        <h1 className="hero-main-heading">
          {HEADING_PREFIX}
          <span className="gradient-text">{HEADING_HIGHLIGHT}</span>
          {HEADING_SUFFIX}
        </h1>
        <p className="hero-sub-statement">{FULL_DESC}</p>
      </div>

      {/* Active Typed Stream */}
      <div className="col-start-1 row-start-1 z-10">
        <h1 className="hero-main-heading" aria-label={FULL_HEADING}>
          {prefixPart}
          {showPrefixCursor && (
            <span className="typing-cursor" aria-hidden="true" />
          )}
          {highlightPart && (
            <span className="gradient-text">
              {highlightPart}
              {showHighlightCursor && (
                <span className="typing-cursor" aria-hidden="true" />
              )}
            </span>
          )}
          {suffixPart}
          {showSuffixCursor && (
            <span className="typing-cursor" aria-hidden="true" />
          )}
        </h1>

        <p className="hero-sub-statement">
          <span className="sr-only">{FULL_DESC}</span>
          <span aria-hidden="true">{descPart}</span>
          {showDescCursor && (
            <span className="typing-cursor" aria-hidden="true" />
          )}
        </p>
      </div>
    </div>
  );
}
