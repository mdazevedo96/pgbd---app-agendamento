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
      <section className="pt-30 px-4"> {/* <— aqui: pt-28 = 7rem */}
        {children}
      </section>
    </main>
  );
}