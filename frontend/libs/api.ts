const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export type Profissional = {
  id: number;
  nome: string;
  especialidade: string;
  fotoUrl?: string;
};

export type AgendamentoPayload = {
  medicoId: number;
  usuarioId: number;
  dataHora: string; // formato ISO
  servico: string;
};

// ==========================
// 🔹 AUTH
// ==========================
export async function loginUser(cpf: string, senha: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, senha }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao fazer login");
  }

  return res.json(); // { access_token, user }
}

// ==========================
// 🔹 MÉDICOS
// ==========================
export async function getProfissionais(): Promise<Profissional[]> {
  const res = await fetch(`${API_URL}/medicos`);
  if (!res.ok) {
    throw new Error("Erro ao buscar médicos");
  }
  return res.json();
}

export async function getProfissional(id: number): Promise<Profissional> {
  const res = await fetch(`${API_URL}/medicos/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar médico");
  }
  return res.json();
}

// ==========================
// 🔹 AGENDAMENTOS
// ==========================
export async function createAgendamento(payload: AgendamentoPayload) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/agendamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao criar agendamento");
  }

  return res.json();
}

export async function getAgendamentosByUsuario(usuarioId: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/agendamentos/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar agendamentos");
  }

  return res.json();
}
