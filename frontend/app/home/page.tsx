// Em: app/home/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Importa sua API falsa (caminho @/libs/... sem 'src/')
import { getProfissionais } from "@/libs/mockApi";
import type { Profissional } from "@/libs/mockApi";

// 1. IMPORTE O NOVO LAYOUT
// (caminho @/components/... sem 'src/')
import PageLayout from "@/components/PageLayout";

export default function HomePage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os profissionais da API falsa quando a página carrega
  useEffect(() => {
    getProfissionais()
      .then((data) => {
        setProfissionais(data);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []); // O array vazio [] faz isso rodar apenas uma vez

  // 2. USE O LAYOUT
  return (
    <PageLayout
      title="Agende sua Consulta"
      subtitle="Encontre os melhores profissionais de forma rápida, fácil e online."
    >
      {/* Tudo aqui dentro é o "children" do PageLayout.
        O layout já cuida do <main> e do banner <section>.
      */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Nossos Profissionais
        </h2>

        {carregando ? (
          // Spinner de carregamento
          <div className="text-center text-gray-600">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Carregando...</p>
          </div>
        ) : (
          // Grid com os cards dos profissionais
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profissionais.map((prof) => (
              <Link
                key={prof.id}
                href={`/profissionais/${prof.id}`} 
                className="group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {/* Imagem do Profissional */}
                  <Image
                    src={prof.fotoUrl}
                    alt={`Foto de ${prof.nome}`}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover"
                    priority // Opcional: Prioriza o carregamento de imagens
                  />
                  {/* Informações do Card */}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {prof.nome}
                    </h3>
                    <p className="text-blue-600 font-medium">
                      {prof.especialidade}
                    </p>
                    <div className="text-right mt-4 text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Agendar →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}