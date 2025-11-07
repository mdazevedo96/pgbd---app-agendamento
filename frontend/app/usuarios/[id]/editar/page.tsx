"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const usuarioId = params.id;

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    senha: "",
    nivel: "paciente",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Buscar dados do usuário existente
  useEffect(() => {
    async function fetchUsuario() {
      try {
        const res = await fetch(`http://localhost:3333/usuarios/${usuarioId}`);
        if (!res.ok) throw new Error("Erro ao carregar usuário");
        const data = await res.json();
        setForm({
          nome: data.nome,
          cpf: data.cpf,
          senha: "",
          nivel: data.nivel || "paciente",
        });
      } catch (err) {
        alert("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    }

    if (usuarioId) fetchUsuario();
  }, [usuarioId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Atualizar usuário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se a senha estiver vazia, removemos antes do envio
    const payload = { ...form };
    if (!payload.senha.trim()) {
      delete payload.senha;
    }

    try {
      const response = await fetch(`http://localhost:3333/usuarios/${usuarioId}`, {
        method: "PUT", // ✅ compatível com seu controller
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao atualizar usuário");

      alert("Usuário atualizado com sucesso!");
      router.push("/usuarios");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar usuário");
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-600">
        Carregando informações do usuário...
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto mt-24 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Editar Usuário
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
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

        {/* CPF */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">CPF</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            maxLength={11}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Nova Senha
          </label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Deixe em branco para não alterar"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Nível */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Nível de Acesso
          </label>
          <select
            name="nivel"
            value={form.nivel}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="paciente">Paciente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/usuarios")}
            className="w-1/2 bg-gray-300 text-gray-800 font-semibold py-3 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="w-1/2 bg-teal-600 text-white font-semibold py-3 rounded hover:bg-teal-700 transition"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </main>
  );
}
