"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
    // pega o ID do usuário logado do localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.id) setUsuarioId(user.id.toString());
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-teal-500 to-cyan-600 py-10">
      <nav className="max-w-7xl mx-auto flex justify-center space-x-12">
        <Link href="/home" className="text-white text-lg font-semibold hover:underline">
          Home
        </Link>
        <Link href="/medicos" className="text-white text-lg font-semibold hover:underline">
          Médicos
        </Link>

        <Link href="/usuarios" className="text-white text-lg font-semibold hover:underline">
          Usuários
        </Link>

        {usuarioId ? (
          <Link
            href="/meus-agendamentos"
            className="text-white text-lg font-semibold hover:underline"
          >
            Meus agendamentos
          </Link>
        ) : (
          <span className="text-gray-300 text-lg">Meus agendamentos</span>
        )}

        <Link href="/login" className="text-white text-lg font-semibold hover:underline">
          Sair
        </Link>
      </nav>
    </header>
  );
}
