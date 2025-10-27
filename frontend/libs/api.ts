const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// Tipo igual ao que já usa
export type Profissional = {
  id: number;
  nome: string;
  especialidade: string;
  fotoUrl?: string;
};

// Busca todos os médicos (profissionais)
export async function getProfissionais(): Promise<Profissional[]> {
  const res = await fetch(`${API_URL}/medicos`);
  if (!res.ok) {
    throw new Error("Erro ao buscar médicos");
  }
  return res.json();
}

// Busca um médico específico
export async function getProfissional(id: number): Promise<Profissional> {
  const res = await fetch(`${API_URL}/medicos/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar médico");
  }
  return res.json();
}
