// app/equipe/page.tsx
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getProfissionais } from "@/libs/api";
import type { Profissional } from "@/libs/api";

// Simula busca do usuário logado (você pode trocar depois por autenticação real)
async function getCurrentUser() {
  // Exemplo: busca do cookie/session/token
  // Aqui vamos simular um usuário admin logado
  return {
    nome: "Administrador",
    role: "admin", // ou "user"
  };
}

export default async function HomePage() {
  let profissionais: Profissional[] = [];
  let currentUser: { nome: string; role: string } | null = null;

  try {
    [profissionais, currentUser] = await Promise.all([
      getProfissionais(),
      getCurrentUser(),
    ]);
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
  }

  return (
    <PageLayout
      title="Agende sua Consulta"
      subtitle="Encontre os melhores profissionais de forma rápida, fácil e online."
    >
      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Medicos Disponiveis
        </h2>

        {/* 🔹 Botão de adicionar novo médico (visível só para admin) */}
        {currentUser?.role === "admin" && (
          <Link
            href="/medicos/novo"
            className="absolute top-0 right-0 bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold shadow-lg hover:bg-teal-700 transition"
            title="Cadastrar novo médico"
          >
            +
          </Link>
        )}

        {profissionais.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhum profissional disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profissionais.map((prof) => (
              <Link
                key={prof.id}
                href={`/agendamento/${prof.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <Image
                    src={prof.fotoUrl || "/placeholder.jpg"}
                    alt={`Foto de ${prof.nome}`}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover"
                    priority
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
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
