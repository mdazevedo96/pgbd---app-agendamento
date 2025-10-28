// Em: frontend/components/PageLayout.tsx
"use client";

import React from "react";

type PageLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function PageLayout({
  title,
  subtitle,
  children,
}: PageLayoutProps) {
  return (
    // --- CORREÇÃO APLICADA ---
    // Voltamos o fundo geral para cinza-claro (bg-gray-50).
    // Isso cria o contraste para os seus cards brancos.
    <main className="min-h-screen bg-gray-50">
      
      {/* Banner (Hero) com cores de saúde (sem alteração) */}
      <section className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-center p-16 md:p-24 shadow-md">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl opacity-90">
          {subtitle}
        </p>
      </section>

      {/* Seção de Conteúdo */}
      <section className="py-16 px-4">
        {children}
      </section>
      
    </main>
  );
}