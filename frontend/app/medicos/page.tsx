"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getProfissionais } from "@/libs/api";
import type { Profissional } from "@/libs/api";
import { FunnelIcon } from "@heroicons/react/24/solid";

export default function HomePage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [user, setUser] = useState<{ nome: string; nivel: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [crm, setCrm] = useState("");

  // Controle do painel de filtros
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // Carregar usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Buscar profissionais
  async function fetchProfissionais(filtros?: { nome?: string; especialidade?: string; crm?: string }) {
    try {
      setLoading(true);
      const result = await getProfissionais(filtros);
      setProfissionais(result);
    } catch (error) {
      console.error("Erro ao buscar profissionais:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfissionais();
  }, []);

  // Funções dos filtros
  const handleFiltrar = async () => {
    await fetchProfissionais({
      nome: nome || undefined,
      especialidade: especialidade || undefined,
      crm: crm || undefined,
    });
  };

  const handleLimpar = async () => {
    setNome("");
    setEspecialidade("");
    setCrm("");
    await fetchProfissionais();
  };

  // Excluir profissional
  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o médico ${nome}?`)) return;
    try {
      const res = await fetch(`http://localhost:3333/medicos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir médico");
      alert("Médico excluído com sucesso!");
      setProfissionais(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir médico.");
    }
  };

  if (loading) {
    return (
      <PageLayout title="Carregando..." subtitle="Buscando médicos disponíveis.">
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Agende sua Consulta"
      subtitle="Encontre os melhores profissionais de forma rápida, fácil e online."
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Médicos Disponíveis</h2>

          <div className="flex gap-4">
            {/* Botão de filtro */}
            <button
              onClick={() => setFiltrosAbertos(prev => !prev)}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-teal-400/40 hover:scale-110 transition-all duration-300"
              title="Filtros"
            >
              <FunnelIcon className="w-6 h-6" />
            </button>

            {/* Botão "+" aparece somente para admins */}
            {user?.nivel === "admin" && (
              <Link
                href="/medicos/novo"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-4xl font-bold shadow-lg hover:shadow-teal-400/40 hover:scale-110 transition-all duration-300"
                title="Cadastrar novo médico"
              >
                +
              </Link>
            )}
          </div>
        </div>

        {/* Painel de filtros */}
        {filtrosAbertos && (
          <div className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-100 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Filtrar por especialidade..."
                value={especialidade}
                onChange={e => setEspecialidade(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Filtrar por CRM..."
                value={crm}
                onChange={e => setCrm(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={handleFiltrar}
                className="bg-teal-500 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-600 transition"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleLimpar}
                className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition"
              >
                Limpar
              </button>
            </div>
          </div>
        )}

        {/* Listagem de médicos */}
        {profissionais.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Nenhum profissional disponível no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {profissionais.map(prof => (
              <div
                key={prof.id}
                className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative">
                  <Image
                    src={prof.fotoUrl || "/placeholder.jpg"}
                    alt={`Foto de ${prof.nome}`}
                    width={400}
                    height={300}
                    className="w-full h-56 object-cover"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {prof.especialidade}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900 truncate">{prof.nome}</h3>
                  <p className="text-sm text-gray-500 font-medium">CRM: {prof.crm}</p>

                  <div className="flex justify-between items-center mt-5">
                    <Link
                      href={`/agendamento/${prof.id}`}
                      className="text-teal-600 font-semibold hover:text-teal-700 transition-colors text-sm"
                    >
                      Agendar →
                    </Link>

                    {user?.nivel === "admin" && (
                      <div className="flex gap-2">
                        <Link
                          href={`/medicos/${prof.id}/editar`}
                          className="flex items-center gap-2 bg-teal-500 text-white text-sm px-4 py-2 rounded-lg shadow-md hover:bg-teal-600 hover:shadow-lg transition-all"
                        >
                          ✏️ <span>Editar</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(prof.id, prof.nome)}
                          className="flex items-center gap-2 bg-rose-500 text-white text-sm px-4 py-2 rounded-lg shadow-md hover:bg-rose-600 hover:shadow-lg transition-all"
                        >
                          🗑️ <span>Excluir</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
