"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import Link from "next/link";

type Usuario = {
  id: number;
  nome: string;
  cpf: string;
  nivel: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch("http://localhost:3333/usuarios");
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <PageLayout title="Carregando..." subtitle="Buscando usuários...">
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        </div>
      </PageLayout>
    );
  }

  if (usuarios.length === 0) {
    return (
      <PageLayout title="Usuários" subtitle="Nenhum usuário encontrado.">
        <p className="text-center text-gray-500 text-lg">Nenhum usuário encontrado.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Usuários" subtitle="Lista de usuários cadastrados">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-end">
          <Link
            href="/usuarios/novo"
            className="bg-teal-500 text-white rounded-full py-2 px-4 font-semibold hover:bg-teal-600"
          >
            Adicionar Usuário
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{usuario.nome}</h3>
              <p className="text-gray-700">CPF: {usuario.cpf}</p>
              <p className="text-gray-700">Nível: {usuario.nivel}</p>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/usuarios/${usuario.id}/editar`}
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
