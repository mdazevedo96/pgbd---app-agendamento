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

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    if (profissionalId) {
      getProfissional(profissionalId)
        .then(setProfissional)
        .catch(() => setMessage("Erro ao carregar profissional."));
    }
  }, [profissionalId]);

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

  const handleAgendar = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage("⚠️ Selecione a data e o horário da consulta.");
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
        servico: "Consulta",
      });

      setMessage("✅ Consulta agendada com sucesso!");
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

  const agora = new Date();
  const dataHoje = agora.toISOString().split("T")[0];

  let horariosFiltrados = horariosDisponiveis;
  let todosHorariosPassados = false;

  if (selectedDate) {
    const dataSelecionada = format(selectedDate, "yyyy-MM-dd");
    if (dataSelecionada === dataHoje) {
      const horaAtual = agora.toTimeString().substring(0, 5);
      horariosFiltrados = horariosDisponiveis.filter((h) => h > horaAtual);
      if (horariosFiltrados.length === 0) todosHorariosPassados = true;
    }
  }

  return (
    <PageLayout
      title={`Agendar com ${profissional.nome}`}
      subtitle={profissional.especialidade}
    >
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Tipo de Consulta</h2>
          <button
            onClick={() => setSelectedServico("Consulta")}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedServico === "Consulta"
                ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
                : "bg-white border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="font-semibold text-gray-900 text-lg">Consulta</div>
          </button>
        </div>

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

        {selectedDate && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Escolha o Horário ({format(selectedDate, "dd/MM/yyyy", { locale: ptBR })})
            </h2>

            {loadingHorarios ? (
              <div className="text-center text-gray-500">Carregando horários...</div>
            ) : todosHorariosPassados ? (
              <div className="text-center bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg font-medium shadow-sm">
                ⚠️ O expediente para hoje já encerrou.  
                <br />
                Escolha outro dia para agendar sua consulta.
              </div>
            ) : horariosFiltrados.length === 0 ? (
              <div className="text-center text-gray-500">
                Nenhum horário disponível para este dia.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {horariosFiltrados.map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedTime(h)}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedTime === h
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

        {message && (
          <p
            className={`mt-4 text-center text-sm p-3 rounded-lg ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {message}
          </p>
        )}

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
