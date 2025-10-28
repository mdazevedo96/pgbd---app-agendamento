// Em: app/page.tsx
"use client";

import { useState } from "react";
// O import do Link não é mais necessário aqui, já que o removemos
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout"; // Importa o layout padrão

export default function LoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simulação de login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // A simulação ainda só verifica a senha. 
      // O CPF não importa (por enquanto).
      if (password === "12345") {
        console.log("Login simulado com sucesso para o CPF:", cpf);
        router.push("/home"); // Redireciona para a lista de profissionais
      } else {
        setError("CPF ou senha inválidos."); // Mensagem de erro atualizada
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // 2. USE O LAYOUT
  return (
    <PageLayout
      title="Acesse sua Conta"
      subtitle="Use seu CPF e senha para gerenciar seus agendamentos." // Subtítulo atualizado
    >
      {/* O 'children' do PageLayout é o card do formulário */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo de CPF */}
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

          {/* Campo de Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {/* Exibição de Erro */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg border border-red-300 dark:border-red-700">
              {error}
            </p>
          )}

          {/* Botão de Envio */}
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
 
        {/* --- CORREÇÃO APLICADA ---
           O link "Cadastre-se" foi removido daqui 
           para alinhar com a regra de negócio.
        */}
        
      </div>
    </PageLayout>
  );
}