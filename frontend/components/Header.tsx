import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-teal-500 to-cyan-600 py-10">
      <nav className="max-w-7xl mx-auto flex justify-center space-x-12">
        <Link href="/home" className="text-white text-lg font-semibold hover:underline">
          Home
        </Link>
        <Link href="/medicos" className="text-white text-lg font-semibold hover:underline">
          Agendamentos
        </Link>
        <Link href="/perfil" className="text-white text-lg font-semibold hover:underline">
          Perfil
        </Link>
        <Link href="/login" className="text-white text-lg font-semibold hover:underline">
          Sair
        </Link>
      </nav>
    </header>
  );
}
