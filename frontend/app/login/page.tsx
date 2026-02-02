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
      const data = await loginUser(cpf, senha);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login realizado com sucesso:", data.user);
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
      <div className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 min-h-screen flex justify-center items-center p-0 m-0">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-16 w-full max-w-lg mx-auto transform transition-all duration-500 ease-in-out hover:scale-105">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="cpf"
                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3"
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
                className="w-full px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
                className="w-full px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-300 dark:border-red-700">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-6 border-2 border-transparent rounded-xl shadow-xl text-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500 disabled:bg-teal-300 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
