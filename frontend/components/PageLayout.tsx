"use client";

import React from "react";
import Header from "./Header";
import { usePathname } from "next/navigation";

type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();

  const shouldRenderHeader = pathname !== "/login";

  return (
    <main className="min-h-screen bg-gray-50">
      {shouldRenderHeader && <Header />}

      <section className="pt-30 px-4">
        {children}
      </section>
    </main>
  );
}
