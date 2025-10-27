"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ Importa a API real e o tipo Profissional
import { getProfissionais, type Profissional } from "@/libs/api";

export default function HomePage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // 🔹 Busca os dados da API NestJS ao montar o componente
  useEffect(() => {
    getProfissionais()
      .then((data) => {
        setProfissionais(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar médicos:", err);
        setErro("Não foi possível carregar os profissionais. Tente novamente.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Seção Hero --- */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-center p-16 md:p-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Agende sua Consulta
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          Encontre os melhores profissionais de forma rápida, fácil e online.
        </p>
        <a
          href="#profissionais"
          className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300"
        >
          Ver Profissionais
        </a>
      </section>

      {/* --- Seção de Profissionais --- */}
      <section id="profissionais" className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Nossos Profissionais
        </h2>

        {/* 🔹 Estado de erro */}
        {erro && (
          <p className="text-center text-red-600 mb-8">{erro}</p>
        )}

        {/* 🔹 Estado de carregamento */}
        {carregando ? (
          <div className="text-center text-gray-600">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2">Carregando...</p>
          </div>
        ) : (
          // 🔹 Grid de cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profissionais.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                Nenhum profissional cadastrado ainda.
              </p>
            ) : (
              profissionais.map((prof) => (
                <Link
                  key={prof.id}
                  href={`/profissionais/${prof.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <Image
                      src={prof.fotoUrl || "/default-doctor.png"} // imagem padrão
                      alt={`Foto de ${prof.nome}`}
                      width={400}
                      height={300}
                      className="w-full h-56 object-cover"
                    />
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
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
