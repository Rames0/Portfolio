"use client";

import { ThemeProvider } from "@/lib/theme";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="antialiased min-h-screen">{children}</div>
    </ThemeProvider>
  );
}
