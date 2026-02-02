"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

type Historico = {
  id: number;
  medicoNome: string;
  usuarioNome: string;
  dataHora: string;
  servico: string;
  status: string;
};

export default function HistoricoAgendamentosPage() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (usuario) fetchHistorico();
  }, [usuario]);

  const fetchHistorico = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/historico-agendamentos`;
      if (usuario.nivel === "paciente") {
        url += `?usuarioNome=${usuario.nome}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar histórico");
      const data = await res.json();
      setHistoricos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Histórico de Consultas"
      subtitle={
        usuario?.nivel === "admin"
          ? "Todos os atendimentos realizados"
          : "Suas consultas anteriores"
      }
    >
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/meus-agendamentos"
          className="flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Voltar aos Agendamentos
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">
          Carregando histórico...
        </p>
      ) : historicos.length === 0 ? (
        <div className="text-center bg-white rounded-xl p-10 shadow border border-gray-100">
          <p className="text-gray-500 text-lg">
            Nenhuma consulta finalizada encontrada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {historicos.map((h) => {
            const dataObj = new Date(h.dataHora);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR");
            const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={h.id}
                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <CheckCircleIcon className="w-5 h-5" />
                  <h3 className="text-xl font-bold">{h.medicoNome}</h3>
                </div>

                {usuario?.nivel === "admin" && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Paciente:</span>{" "}
                    {h.usuarioNome}
                  </p>
                )}

                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Data:</span> {dataFormatada}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Horário:</span>{" "}
                  {horaFormatada}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Serviço:</span> {h.servico}
                </p>

                <p className="text-blue-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" /> Consulta finalizada
                </p>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
