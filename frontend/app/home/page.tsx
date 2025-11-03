"use client";

import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";

export default function HomePage() {
  return (
    <>
      {/* Hero full width */}
      <section className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
  <div className="max-w-7xl mx-auto p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-8">
    <div className="flex-1 max-w-xl space-y-6">
      <h2 className="text-4xl md:text-5xl font-bold">
        Agende sua Consulta Agora
      </h2>
      <p className="text-lg md:text-xl opacity-90">
        Escolha o profissional, o horário e acompanhe seu atendimento de forma simples e online.
      </p>
      <Link
        href="/medicos"
        className="inline-block bg-white text-teal-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
      >
        Agende sua Consulta
      </Link>
    </div>
    <div className="flex-1">
      <Image
        src="/images/medicos.jpg"
        alt="Equipe de Médicos"
        width={600}
        height={400}
        className="rounded-xl object-cover shadow-lg"
        priority
      />
    </div>
  </div>
</section>


      {/* Conteúdo centralizado dentro do PageLayout */}
      <PageLayout
        title="Bem-vindo à Clínica Saúde+"
        subtitle="Cuidando da sua saúde com profissionais qualificados e agendamento rápido."
      >
        {/* --- Sessão sobre a clínica --- */}
        <section className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold mb-4">Profissionais Qualificados</h3>
            <p>Equipe de médicos e especialistas altamente capacitados para cuidar da sua saúde.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold mb-4">Atendimento Rápido</h3>
            <p>Agendamento online fácil e rápido, sem complicações ou filas de espera.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold mb-4">Cuidado Humanizado</h3>
            <p>Tratamos cada paciente com atenção e empatia, garantindo conforto e confiança.</p>
          </div>
        </section>

        {/* --- Seção de ação --- */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para cuidar da sua saúde?</h2>
          <Link
            href="/medicos"
            className="inline-block bg-teal-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-teal-700 transition text-lg"
          >
            Agende sua Consulta Aqui
          </Link>
        </section>
      </PageLayout>
    </>
  );
}
