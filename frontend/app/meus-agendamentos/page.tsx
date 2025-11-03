"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { ClockIcon, CheckCircleIcon, XCircleIcon, FunnelIcon } from "@heroicons/react/24/solid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

type Medico = { id: number; nome: string; crm: string; especialidade: string; fotoUrl?: string };
type Usuario = { id: number; nome: string };
type Agendamento = {
  id: number;
  dataHora: string;
  servico: string;
  status: "pendente" | "confirmado" | "cancelado";
  medico: Medico;
  usuario?: Usuario;
};

export default function AgendamentosPage() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [medicoNome, setMedicoNome] = useState("");
  const [usuarioNome, setUsuarioNome] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<Agendamento["status"] | "">("");
  const [dataFiltro, setDataFiltro] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const fetchAgendamentos = async (filtros?: {
    medico?: string;
    usuario?: string;
    status?: string;
    data?: string;
  }) => {
    if (!usuario) return;
    try {
      setLoading(true);

      let url = `${API_URL}/agendamentos`;
      const params = new URLSearchParams();

      if (usuario.nivel === "admin") {
        // Corrigido: enviar nomes, não IDs
        if (filtros?.medico) params.append("medicoNome", filtros.medico);
        if (filtros?.usuario) params.append("usuarioNome", filtros.usuario);
        if (filtros?.status) params.append("status", filtros.status);
        if (filtros?.data) params.append("data", filtros.data);
      } else {
        // Usuário normal: só pega seus próprios agendamentos
        url = `${API_URL}/agendamentos/usuario/${usuario.id}`;
        if (filtros?.status) params.append("status", filtros.status);
        if (filtros?.data) params.append("data", filtros.data);
      }

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar agendamentos");

      const data = await res.json();
      setAgendamentos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, [usuario]);

  const aplicarFiltros = () => {
    fetchAgendamentos({
      medico: medicoNome || undefined,
      usuario: usuarioNome || undefined,
      status: statusFiltro || undefined,
      data: dataFiltro || undefined,
    });
  };

  const limparFiltros = () => {
    setMedicoNome("");
    setUsuarioNome("");
    setStatusFiltro("");
    setDataFiltro("");
    fetchAgendamentos();
  };

  function renderStatus(status: Agendamento["status"]) {
    switch (status) {
      case "pendente":
        return <ClockIcon className="inline w-5 h-5 text-yellow-500 mr-1" />;
      case "confirmado":
        return <CheckCircleIcon className="inline w-5 h-5 text-green-500 mr-1" />;
      case "cancelado":
        return <XCircleIcon className="inline w-5 h-5 text-red-500 mr-1" />;
    }
  }

  function cardClass(status: Agendamento["status"]) {
    switch (status) {
      case "pendente":
        return "border-l-4 border-yellow-500";
      case "confirmado":
        return "border-l-4 border-green-500";
      case "cancelado":
        return "border-l-4 border-red-500";
    }
  }

  return (
    <PageLayout
      title="Agendamentos"
      subtitle={usuario?.nivel === "admin" ? "Todos os agendamentos" : "Meus agendamentos"}
    >
      {/* Cabeçalho e botão de filtro */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Agendamentos</h2>

        <button
          onClick={() => setFiltrosAbertos(prev => !prev)}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-teal-400/40 hover:scale-110 transition-all duration-300"
          title="Filtros"
        >
          <FunnelIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Painel de filtros */}
      {filtrosAbertos && (
        <div className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-100 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Filtrar por médico"
              value={medicoNome}
              onChange={e => setMedicoNome(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            {usuario?.nivel === "admin" && (
              <input
                type="text"
                placeholder="Filtrar por paciente"
                value={usuarioNome}
                onChange={e => setUsuarioNome(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            )}
            <select
              value={statusFiltro}
              onChange={e => setStatusFiltro(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <input
              type="date"
              value={dataFiltro}
              onChange={e => setDataFiltro(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button
              onClick={aplicarFiltros}
              className="bg-teal-500 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-600 transition"
            >
              Aplicar
            </button>
            <button
              onClick={limparFiltros}
              className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition"
            >
              Limpar
            </button>
          </div>
        </div>
      )}

      {/* Lista de agendamentos */}
      {loading ? (
        <p className="text-center text-lg">Carregando agendamentos...</p>
      ) : agendamentos.length === 0 ? (
        <p className="text-center text-lg">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {agendamentos.map((agendamento) => {
            const dataObj = new Date(agendamento.dataHora);
            const dataFormatada = dataObj.toLocaleDateString("pt-BR");
            const horaFormatada = dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={agendamento.id}
                className={`bg-white p-6 rounded-xl shadow hover:shadow-lg transition ${cardClass(agendamento.status)}`}
              >
                <h3 className="text-xl font-bold mb-2">{agendamento.medico.nome}</h3>
                {usuario?.nivel === "admin" && agendamento.usuario && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Paciente:</span> {agendamento.usuario.nome}
                  </p>
                )}
                <p className="text-gray-700">
                  <span className="font-semibold">Data:</span> {dataFormatada}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Horário:</span> {horaFormatada}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Serviço:</span> {agendamento.servico}
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="font-semibold mr-1">Status:</span> {renderStatus(agendamento.status)}{" "}
                  {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
