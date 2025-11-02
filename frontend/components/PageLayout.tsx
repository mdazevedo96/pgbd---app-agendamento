"use client";

import React from "react";
import Header from "./Header";

type PageLayoutProps = {
  children: React.ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Conteúdo principal */}
      <section className="py-16 px-4">
        {children}
      </section>
    </main>
  );
}
