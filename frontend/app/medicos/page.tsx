// Em: app/equipe/page.tsx
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getProfissionais } from "@/libs/api";
import type { Profissional } from "@/libs/api";

// ⚡ Função assíncrona de componente no Next 13 App Router
export default async function HomePage() {
  let profissionais: Profissional[] = [];


  try {
    profissionais = await getProfissionais();
    console.log(profissionais);
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
  }

  return (
    <PageLayout
      title="Agende sua Consulta"
      subtitle="Encontre os melhores profissionais de forma rápida, fácil e online."
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Nossos Profissionais
        </h2>

        {profissionais.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum profissional disponível no momento.</p>
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
