"use client";

import { ScrollTypewriter } from "./ScrollTypewriter";

export interface ScrollTypingSectionHeaderProps {
  tag: string;
  title: string;
  lead: string;
  className?: string;
}

export function ScrollTypingSectionHeader({
  tag,
  title,
  lead,
  className = "",
}: ScrollTypingSectionHeaderProps) {
  return (
    <div className={`section-header-block ${className}`}>
      <div className="section-tag">
        <span className="line" aria-hidden="true" />
        <ScrollTypewriter text={tag} as="span" speed={18} delay={0} />
      </div>
      <ScrollTypewriter
        text={title}
        as="h2"
        className="section-title"
        speed={22}
        delay={tag.length * 18 + 120}
      />
      <ScrollTypewriter
        text={lead}
        as="p"
        className="section-lead"
        speed={14}
        delay={tag.length * 18 + 120 + title.length * 22 + 140}
      />
    </div>
  );
}
