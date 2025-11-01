"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { loginUser } from "@/libs/api";

export default function LoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 🔹 Chama o backend real
      const data = await loginUser(cpf, senha);

      // 🔹 Armazena o token e o usuário
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login realizado com sucesso:", data.user);

      // 🔹 Redireciona para a home
      router.push("/home");
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      setError(err.message || "CPF ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Acesse sua Conta"
      subtitle="Use seu CPF e senha para gerenciar seus agendamentos."
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CPF */}
          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              CPF
            </label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              required
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
              placeholder="000.000.000-00"
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-300 dark:border-red-700">
              {error}
            </p>
          )}

          {/* Botão */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 transition duration-150 ease-in-out"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
