"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { createAgendamento, getProfissional } from "@/libs/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AgendamentoPage() {
  const router = useRouter();
  const [profissional, setProfissional] = useState<any>(null);
  const [selectedServico, setSelectedServico] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ID do médico salvo quando o usuário clicou em "Agendar"
  const medicoId = Number(localStorage.getItem("medicoSelecionadoId"));

  // Usuário logado
  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  useEffect(() => {
    if (medicoId) {
      getProfissional(medicoId).then(setProfissional);
    }
  }, [medicoId]);

  const servicos = [
    { nome: "Consulta Inicial", duracao: 60, preco: 150 },
    { nome: "Sessão de Acompanhamento", duracao: 45, preco: 100 },
    { nome: "Retorno", duracao: 30, preco: 0 },
  ];

  const horarios = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const handleAgendar = async () => {
    if (!selectedServico || !selectedDate || !selectedTime) {
      setMessage("Preencha todos os campos.");
      return;
    }

    const dataHora = new Date(`${selectedDate}T${selectedTime}:00`);

    try {
      setLoading(true);
      await createAgendamento({
        medicoId,
        usuarioId: user.id,
        dataHora: dataHora.toISOString(),
        servico: selectedServico,
      });
      setMessage("✅ Agendamento realizado com sucesso!");
      setTimeout(() => router.push("/home"), 1500);
    } catch (err: any) {
      setMessage(err.message || "Erro ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (!profissional) {
    return (
      <PageLayout title="Carregando..." subtitle="Buscando dados do profissional.">
        <div className="text-center text-gray-600 mt-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`Agendar com ${profissional.nome}`}
      subtitle={profissional.especialidade}
    >
      <div className="p-6 bg-white shadow-xl rounded-xl max-w-4xl mx-auto">
        {/* 1. Serviço */}
        <h2 className="text-lg font-bold mb-3">1. Escolha o Serviço</h2>
        <div className="flex flex-col gap-3 mb-6">
          {servicos.map((s) => (
            <button
              key={s.nome}
              onClick={() => setSelectedServico(s.nome)}
              className={`p-4 border rounded-lg text-left ${
                selectedServico === s.nome
                  ? "bg-blue-100 border-blue-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <strong>{s.nome}</strong>
              <p className="text-sm text-gray-500">
                Duração: {s.duracao} min | R$ {s.preco.toFixed(2)}
              </p>
            </button>
          ))}
        </div>

        {/* 2. Data */}
        <h2 className="text-lg font-bold mb-3">2. Escolha a Data</h2>
        <input
          type="date"
          className="border rounded-lg p-2 mb-6"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* 3. Horário */}
        <h2 className="text-lg font-bold mb-3">
          3. Escolha o Horário {selectedDate && `(${format(new Date(selectedDate), "dd/MM/yyyy", { locale: ptBR })})`}
        </h2>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {horarios.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedTime(h)}
              className={`py-2 border rounded-lg ${
                selectedTime === h
                  ? "bg-blue-600 text-white border-blue-700"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Mensagem */}
        {message && (
          <p className="text-center text-sm p-3 mb-3 rounded-lg bg-blue-100 text-blue-700">
            {message}
          </p>
        )}

        {/* Botão confirmar */}
        <button
          disabled={loading}
          onClick={handleAgendar}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Salvando..." : "Confirmar Agendamento"}
        </button>
      </div>
    </PageLayout>
  );
}
