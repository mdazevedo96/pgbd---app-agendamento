"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const generateHorarios = () => {
  const horarios: string[] = [];
  for (let h = 8; h <= 18; h++) {
    if (h === 18) {
      horarios.push("18:00");
      break;
    }
    horarios.push(`${String(h).padStart(2, "0")}:00`);
    horarios.push(`${String(h).padStart(2, "0")}:30`);
  }
  return horarios;
};

export default function NovoMedicoPage() {
  const router = useRouter();
  const horariosFixos = generateHorarios();

  const [form, setForm] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    fotoUrl: "",
    horariosDisponiveis: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleHorarioToggle = (horario: string) => {
    setForm((prev) => {
      const jaSelecionado = prev.horariosDisponiveis.includes(horario);
      return {
        ...prev,
        horariosDisponiveis: jaSelecionado
          ? prev.horariosDisponiveis.filter((h) => h !== horario)
          : [...prev.horariosDisponiveis, horario],
      };
    });
  };

  const handleSelectAll = () => {
    if (form.horariosDisponiveis.length === horariosFixos.length) {
      setForm({ ...form, horariosDisponiveis: [] });
    } else {
      setForm({ ...form, horariosDisponiveis: [...horariosFixos] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3333/medicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar médico");

      alert("Médico cadastrado com sucesso!");
      router.push("/medicos");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar médico");
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-24 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Cadastrar Novo Médico
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">CRM</label>
          <input
            type="text"
            name="crm"
            value={form.crm}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Especialidade
          </label>
          <input
            type="text"
            name="especialidade"
            value={form.especialidade}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            URL da Foto
          </label>
          <input
            type="text"
            name="fotoUrl"
            value={form.fotoUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-gray-700 font-semibold">
              Selecione os horários disponíveis (08:00 – 18:00)
            </label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
            >
              {form.horariosDisponiveis.length === horariosFixos.length
                ? "Limpar todos"
                : "Selecionar todos"}
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded p-3">
            {horariosFixos.map((horario) => (
              <label
                key={horario}
                className={`flex items-center space-x-2 cursor-pointer ${
                  form.horariosDisponiveis.includes(horario)
                    ? "text-teal-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.horariosDisponiveis.includes(horario)}
                  onChange={() => handleHorarioToggle(horario)}
                  className="accent-teal-600"
                />
                <span>{horario}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/medicos")}
            className="w-1/2 bg-gray-300 text-gray-800 font-semibold py-3 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="w-1/2 bg-teal-600 text-white font-semibold py-3 rounded hover:bg-teal-700 transition"
          >
            Salvar Médico
          </button>
        </div>
      </form>
    </main>
  );
}
