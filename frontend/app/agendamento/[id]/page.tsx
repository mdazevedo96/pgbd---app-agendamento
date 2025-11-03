"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { getProfissional, createAgendamento } from "@/libs/api";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProfissionalDetalhePage() {
  const router = useRouter();
  const params = useParams();
  const profissionalId = Number(params.id);

  const [profissional, setProfissional] = useState<any>(null);
  const [selectedServico, setSelectedServico] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // Usuário logado
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Carrega o profissional
  useEffect(() => {
    if (profissionalId) {
      getProfissional(profissionalId)
        .then(setProfissional)
        .catch(() => setMessage("Erro ao carregar profissional."));
    }
  }, [profissionalId]);

  // Serviços (pode vir do backend depois)
  const servicos = [
    { nome: "Consulta Inicial", duracao: 60, preco: 150 },
    { nome: "Retorno", duracao: 30, preco: 0 },
    { nome: "Acompanhamento", duracao: 45, preco: 100 },
  ];

  // 🔹 Quando selecionar uma data, busca horários livres no backend
  useEffect(() => {
    async function fetchHorarios() {
      if (!selectedDate || !profissionalId) return;
      setLoadingHorarios(true);
      setSelectedTime("");

      try {
        const dataFormatada = format(selectedDate, "yyyy-MM-dd");
        const response = await fetch(
          `http://localhost:3333/agendamentos/disponiveis/${profissionalId}?data=${dataFormatada}`
        );

        if (!response.ok) throw new Error("Erro ao buscar horários disponíveis");

        const data = await response.json();
        setHorariosDisponiveis(data.horariosDisponiveis || []);
      } catch (err) {
        console.error(err);
        setHorariosDisponiveis([]);
      } finally {
        setLoadingHorarios(false);
      }
    }

    fetchHorarios();
  }, [selectedDate, profissionalId]);

  // 🔹 Criar agendamento
  const handleAgendar = async () => {
    if (!selectedServico || !selectedDate || !selectedTime) {
      setMessage("⚠️ Selecione serviço, data e horário.");
      return;
    }

    const [hour, minute] = selectedTime.split(":").map(Number);
    const dataHora = new Date(
      selectedDate!.getFullYear(),
      selectedDate!.getMonth(),
      selectedDate!.getDate(),
      hour,
      minute,
      0
    );

    const dataHoraFormatada = format(dataHora, "yyyy-MM-dd'T'HH:mm:ss");

    try {
      setLoading(true);
      setMessage(null);

      if (!user || !user.id) {
        setMessage("⚠️ Usuário não está logado.");
        return;
      }

      const usuarioId = Number(user.id);

      await createAgendamento({
        medicoId: profissionalId,
        usuarioId,
        dataHora: dataHoraFormatada,
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

        {/* 1. Serviço */}
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

        {/* 2. Data */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Escolha o Dia</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            locale={ptBR}
            className="border rounded-lg p-3 w-full"
            placeholderText="Selecione uma data"
            filterDate={(date) => {
              const day = date.getDay();
              return day !== 0 && day !== 6;
            }}
          />
        </div>

        {/* 3. Horário */}
        {selectedDate && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Escolha o Horário ({format(selectedDate, "dd/MM/yyyy", { locale: ptBR })})
            </h2>

            {loadingHorarios ? (
              <div className="text-center text-gray-500">Carregando horários...</div>
            ) : horariosDisponiveis.length === 0 ? (
              <div className="text-center text-gray-500">
                Nenhum horário disponível neste dia.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {horariosDisponiveis.map((h) => (
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
            )}
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

        {/* Botão */}
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
