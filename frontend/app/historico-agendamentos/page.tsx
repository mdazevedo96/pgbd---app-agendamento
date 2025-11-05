"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

type Medico = { id: number; nome: string; especialidade: string; crm: string };
type Usuario = { id: number; nome: string; nivel: string };
type Agendamento = {
  id: number;
  dataHora: string;
  servico: string;
  status: "pendente" | "confirmado" | "cancelado";
  finalizado?: boolean;
  medico: Medico;
  usuario?: Usuario;
};

export default function HistoricoAgendamentosPage() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    if (usuario.nivel === "admin") fetchUsuarios();
    fetchAgendamentos();
  }, [usuario]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar usuários");
      const data = await res.json();
      const pacientes = data.filter((u: Usuario) => u.nivel === "paciente");
      setUsuarios(pacientes);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAgendamentos = async (pacienteId?: string) => {
    if (!usuario) return;
    try {
      setLoading(true);
      let url = "";
      if (usuario.nivel === "admin") {
        url = `${API_URL}/agendamentos?status=confirmado&finalizado=true`;
        if (pacienteId) url += `&usuarioId=${pacienteId}`;
      } else {
        url = `${API_URL}/agendamentos/usuario/${usuario.id}?status=confirmado&finalizado=true`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar histórico");
      const data = await res.json();
      setAgendamentos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePacienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPacienteSelecionado(id);
    fetchAgendamentos(id);
  };

  return (
    <PageLayout
      title="Histórico de Agendamentos"
      subtitle={
        usuario?.nivel === "admin"
          ? "Visualize os agendamentos finalizados por paciente"
          : "Meus agendamentos finalizados"
      }
    >
      {/* Botão de Voltar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/meus-agendamentos"
          className="flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Voltar aos Agendamentos
        </Link>
      </div>

      {/* Select de Paciente (apenas para admin) */}
      {usuario?.nivel === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-100">
          <label className="block text-gray-700 font-medium mb-3">
            Selecione um paciente:
          </label>
          <select
            value={pacienteSelecionado}
            onChange={handlePacienteChange}
            className="border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-1/2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          >
            <option value="">-- Todos os pacientes --</option>
            {usuarios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Lista de históricos */}
      {loading ? (
        <p className="text-center text-lg text-gray-600">
          Carregando histórico...
        </p>
      ) : agendamentos.length === 0 ? (
        <div className="text-center bg-white rounded-xl p-10 shadow border border-gray-100">
          <p className="text-gray-500 text-lg">
            Nenhum agendamento finalizado encontrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agendamentos.map((agendamento) => {
            const dataObj = new Date(agendamento.dataHora);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR");
            const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={agendamento.id}
                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-md border-l-4 border-green-500 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <CheckCircleIcon className="w-5 h-5" />
                  <h3 className="text-xl font-bold">{agendamento.medico.nome}</h3>
                </div>

                {usuario?.nivel === "admin" && agendamento.usuario && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Paciente:</span>{" "}
                    {agendamento.usuario.nome}
                  </p>
                )}
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Data:</span> {dataFormatada}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Horário:</span> {horaFormatada}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Serviço:</span>{" "}
                  {agendamento.servico}
                </p>
                <p className="text-blue-600 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4" /> Finalizado
                </p>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
