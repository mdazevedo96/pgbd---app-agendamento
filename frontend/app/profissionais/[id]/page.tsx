"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { getProfissional, createAgendamento } from "@/libs/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProfissionalDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const profissionalId = Number(params.id);

  const [profissional, setProfissional] = useState<any>(null);
  const [selectedServico, setSelectedServico] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Usuário logado
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  // Carrega o profissional
  useEffect(() => {
    if (profissionalId) {
      getProfissional(profissionalId)
        .then(setProfissional)
        .catch(() => setMessage("Erro ao carregar profissional."));
    }
  }, [profissionalId]);

  // Serviços fictícios (pode vir do backend depois)
  const servicos = [
    { nome: "Consulta Inicial", duracao: 60, preco: 150 },
    { nome: "Retorno", duracao: 30, preco: 0 },
    { nome: "Acompanhamento", duracao: 45, preco: 100 },
  ];

  // Horários fixos por enquanto
  const horarios = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Agendar
  const handleAgendar = async () => {
    if (!selectedServico || !selectedDate || !selectedTime) {
      setMessage("⚠️ Selecione serviço, data e horário.");
      return;
    }

    const dataHora = new Date(`${selectedDate}T${selectedTime}:00`);
    try {
      setLoading(true);
      setMessage(null);

      await createAgendamento({
        medicoId: profissionalId,
        usuarioId: user.id,
        dataHora: dataHora.toISOString(),
        servico: selectedServico,
      });

      setMessage("✅ Agendamento realizado com sucesso!");
      setTimeout(() => router.push("/home"), 1200);
    } catch (err: any) {
      setMessage(err.message || "Erro ao criar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (!profissional) {
    return (
      <PageLayout title="Carregando..." subtitle="Buscando dados do profissional.">
        <div className="text-center mt-6 text-gray-600">
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
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-8">

        {/* 1. Escolher serviço */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Escolha o Serviço</h2>
          <div className="space-y-3">
            {servicos.map((s) => (
              <button
                key={s.nome}
                onClick={() => setSelectedServico(s.nome)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedServico === s.nome
                    ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
                    : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
              >
                <div className="font-semibold text-gray-900">{s.nome}</div>
                <div className="text-sm text-gray-600">
                  Duração: {s.duracao} min | R$ {s.preco.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Escolher data */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Escolha o Dia</h2>
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={(date) => setSelectedDate(format(date!, "yyyy-MM-dd"))}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            className="border rounded-lg p-3 w-full"
            placeholderText="Selecione uma data"
          />
        </div>

        {/* 3. Escolher horário */}
        {selectedDate && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Escolha o Horário ({format(new Date(selectedDate), "dd/MM/yyyy", { locale: ptBR })})
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {horarios.map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedTime(h)}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all ${selectedTime === h
                      ? "bg-blue-500 text-white border-blue-700"
                      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800"
                    }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem */}
        {message && (
          <p
            className={`mt-4 text-center text-sm p-3 rounded-lg ${message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {message}
          </p>
        )}

        {/* Botão confirmar */}
        {selectedServico && selectedDate && selectedTime && (
          <div>
            <button
              onClick={handleAgendar}
              disabled={loading}
              className="w-full py-4 px-6 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-400"
            >
              {loading ? "Salvando..." : "Confirmar Agendamento"}
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
