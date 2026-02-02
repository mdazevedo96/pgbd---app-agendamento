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
  dataHora: string;
  servico: string;
};

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

  return res.json();
}

export async function getProfissionais(filtros?: {
  nome?: string;
  especialidade?: string;
  crm?: string;
}) {
  const params = new URLSearchParams();

  if (filtros?.nome) params.append("nome", filtros.nome);
  if (filtros?.especialidade) params.append("especialidade", filtros.especialidade);
  if (filtros?.crm) params.append("crm", filtros.crm);

  const res = await fetch(`http://localhost:3333/medicos?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar profissionais");
  return res.json();
}

export async function getProfissional(id: number): Promise<Profissional> {
  const res = await fetch(`${API_URL}/medicos/${id}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar médico");
  }
  return res.json();
}

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

export async function getAgendamentos(filtros?: {
  usuarioId?: number;
  medicoId?: number;
  status?: string;
  data?: string;
}) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams();

  if (filtros?.usuarioId) params.append("usuarioId", filtros.usuarioId.toString());
  if (filtros?.medicoId) params.append("medicoId", filtros.medicoId.toString());
  if (filtros?.status) params.append("status", filtros.status);
  if (filtros?.data) params.append("data", filtros.data);

  const res = await fetch(`${API_URL}/agendamentos?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Erro ao buscar agendamentos");
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
