"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/navigation";

export default function CadastroUsuarioPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [nivel, setNivel] = useState("paciente"); // Nível do usuário (admin ou paciente)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função de envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3333/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          senha,
          nivel,
        }),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar usuário");

      // Redirecionar após cadastro bem-sucedido
      alert("Usuário cadastrado com sucesso!");
      router.push("/usuarios"); // Redireciona para a página de usuários
    } catch (err) {
      setError("Erro ao cadastrar usuário.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Cadastrar Usuário" subtitle="Preencha os dados abaixo para cadastrar um novo usuário">
      <div className="max-w-md mx-auto mt-8">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-700">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* CPF */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-semibold text-gray-700">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-semibold text-gray-700">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Nível */}
          <div>
            <label htmlFor="nivel" className="block text-sm font-semibold text-gray-700">
              Nível
            </label>
            <select
              id="nivel"
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="paciente">Paciente</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
