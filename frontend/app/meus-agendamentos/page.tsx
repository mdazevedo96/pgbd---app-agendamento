"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

type Medico = {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  fotoUrl?: string;
};

type Usuario = {
  id: number;
  nome: string;
};

type Agendamento = {
  id: number;
  dataHora: string;
  servico: string;
  status: "pendente" | "confirmado" | "cancelado";
  medico: Medico;
  usuario?: Usuario;
};

export default function MeusAgendamentosPage() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  // Pega usuário logado do localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUsuario(JSON.parse(storedUser));
    }
  }, []);

  // Busca agendamentos quando o usuário estiver disponível
  useEffect(() => {
    if (!usuario || !usuario.id) return;

    async function fetchAgendamentos() {
      try {
        const url =
          usuario.nivel === "admin"
            ? "http://localhost:3333/agendamentos"
            : `http://localhost:3333/agendamentos/usuario/${usuario.id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao buscar agendamentos");
        const data = await res.json();
        setAgendamentos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgendamentos();
  }, [usuario]);

  function renderStatus(status: Agendamento["status"]) {
    switch (status) {
      case "pendente":
        return <ClockIcon className="inline w-5 h-5 text-yellow-500 mr-1" />;
      case "confirmado":
        return <CheckCircleIcon className="inline w-5 h-5 text-green-500 mr-1" />;
      case "cancelado":
        return <XCircleIcon className="inline w-5 h-5 text-red-500 mr-1" />;
      default:
        return null;
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
      default:
        return "";
    }
  }

  // Função para alterar o status
  const alterarStatus = async (agendamentoId: number, novoStatus: Agendamento["status"]) => {
    const confirmar = window.confirm(`Deseja realmente marcar como ${novoStatus}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3333/agendamentos/${agendamentoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar status");
      const atualizado = await res.json();

      // Atualiza a lista localmente
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === agendamentoId ? { ...a, status: atualizado.status } : a))
      );

      alert(`Status alterado para ${novoStatus.charAt(0).toUpperCase() + novoStatus.slice(1)}!`);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar status!");
    }
  };

  return (
    <PageLayout
      title="Agendamentos"
      subtitle={usuario?.nivel === "admin" ? "Todos os agendamentos" : "Meus agendamentos"}
    >
      {loading ? (
        <p className="text-center text-lg">Carregando agendamentos...</p>
      ) : agendamentos.length === 0 ? (
        <p className="text-center text-lg">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
                className={`bg-white p-6 rounded-xl shadow hover:shadow-lg transition ${cardClass(
                  agendamento.status
                )}`}
              >
                <h3 className="text-xl font-bold mb-2">{agendamento.medico.nome}</h3>

                {/* Exibe paciente apenas para admin */}
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
                  <span className="font-semibold mr-1">Status:</span>{" "}
                  {renderStatus(agendamento.status)}{" "}
                  {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                </p>

                {/* Botões apenas para admin em agendamentos pendentes */}
                {usuario?.nivel === "admin" && agendamento.status === "pendente" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => alterarStatus(agendamento.id, "confirmado")}
                      className="flex-1 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => alterarStatus(agendamento.id, "cancelado")}
                      className="flex-1 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
