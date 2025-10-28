// Em: frontend/app/profissionais/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PageLayout from "@/components/PageLayout"; // Layout Padrão

// Imports da API (caminhos corretos para sua estrutura)
import {
  getProfissional,
  getServicos,
  getSlotsDisponiveis,
  criarAgendamento,
} from "@/libs/mockApi";
import type { Profissional, Servico, SlotDisponivel } from "@/libs/mockApi";

// Imports do Calendário e Datas
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR }  from "date-fns/locale/pt-BR";

// Configura o localizador do calendário para Português-Brasil
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function ProfissionalDetalhePage() {
  const router = useRouter();
  const params = useParams(); // Hook para pegar o [id] da URL
  const profissionalId = params.id as string;

  // Estados da página
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [slots, setSlots] = useState<SlotDisponivel[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotDisponivel | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // 1. Busca os dados do profissional e os serviços
  useEffect(() => {
    if (profissionalId) {
      setLoading(true);
      Promise.all([
        getProfissional(profissionalId),
        getServicos(profissionalId),
      ])
        .then(([profData, servicosData]) => {
          if (profData) {
            setProfissional(profData);
          }
          setServicos(servicosData);
        })
        .finally(() => setLoading(false));
    }
  }, [profissionalId]);

  // 2. Busca os slots disponíveis QUANDO a data ou o serviço mudar
  useEffect(() => {
    if (profissionalId && selectedDate && selectedServico) {
      setLoadingSlots(true); // Spinner separado para os slots
      getSlotsDisponiveis(profissionalId, selectedDate)
        .then(setSlots)
        .finally(() => setLoadingSlots(false));
    }
  }, [profissionalId, selectedDate, selectedServico]);

  // 3. Função para lidar com o agendamento final
  const handleAgendamento = async () => {
    if (!profissionalId || !selectedServico || !selectedSlot) {
      alert("Por favor, selecione um serviço e um horário.");
      return;
    }

    setLoading(true);
    try {
      await criarAgendamento({
        profissionalId: profissionalId,
        servicoId: selectedServico.id,
        inicio: selectedSlot.inicio,
      });
      alert("Agendamento realizado com sucesso! (Simulado)");
      router.push("/home"); // Volta para a lista de profissionais
    } catch (err) {
      alert("Erro ao realizar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profissional) {
    return (
      <PageLayout title="Carregando..." subtitle="Buscando dados do profissional.">
        <div className="text-center text-gray-600">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
        </div>
      </PageLayout>
    );
  }

  if (!profissional) {
    return (
      <PageLayout title="Erro" subtitle="Profissional não encontrado.">
        <p className="text-center">Este profissional não foi encontrado.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={profissional.nome}
      subtitle={profissional.especialidade}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- COLUNA 1: Serviços --- */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Escolha o Serviço</h2>
          <div className="space-y-3">
            {servicos.map((servico) => (
              <button
                key={servico.id}
                onClick={() => {
                  setSelectedServico(servico);
                  setSelectedSlot(null); // Reseta o slot ao trocar de serviço
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedServico?.id === servico.id
                    ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300" // Estado selecionado
                    : "bg-white border-gray-300 hover:border-gray-400"  // Estado padrão
                }`}
              >
                {/* --- CORREÇÃO APLICADA AQUI --- */}
                <div className="font-semibold text-gray-900">{servico.nome}</div>
                <div className="text-sm text-gray-600">
                  Duração: {servico.duracao} min | R$ {servico.preco.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* --- COLUNA 2: Calendário e Horários --- */}
        <div className="md:col-span-2 space-y-8">
          
          {/* 2. Calendário */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Escolha o Dia</h2>
            {/* O "text-gray-800" aqui garante que o calendário tenha letras escuras */}
            <div className="bg-white p-4 rounded-lg shadow-lg h-[600px] text-gray-800">
              <Calendar
                localizer={localizer}
                culture="pt-BR"
                events={[]}
                startAccessor="start"
                endAccessor="end"
                views={[Views.MONTH, Views.DAY]} // Permite visão de Mês e Dia
                defaultView={Views.MONTH}
                onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
                selectable
              />
            </div>
          </div>

          {/* 3. Slots de Horário */}
          {selectedServico && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Escolha o Horário (Dia: {format(selectedDate, "dd/MM/yyyy")})
              </h2>
              
              {loadingSlots && (
                 <div className="text-center text-gray-600">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
                  <p className="mt-1">Buscando horários...</p>
                </div>
              )}
              
              {!loadingSlots && slots.length === 0 && (
                <p className="text-gray-600 bg-gray-100 p-4 rounded-lg">
                  Nenhum horário vago para este dia.
                </p>
              )}
              
              <div className="grid grid-cols-4 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.inicio.toISOString()}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedSlot?.inicio === slot.inicio
                        ? "bg-blue-500 text-white border-blue-700" // Selecionado
                        : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800" // Padrão (letras escuras)
                    }`}
                  >
                    {format(slot.inicio, "HH:mm")}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Botão de Confirmação */}
          {selectedServico && selectedSlot && (
            <div className="mt-8">
              <button
                onClick={handleAgendamento}
                disabled={loading}
                className="w-full py-4 px-6 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 transition-all disabled:bg-gray-400"
              >
                Confirmar Agendamento
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}