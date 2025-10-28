
// Tipos que seus componentes irão usar
export type Profissional = {
  id: string;
  nome: string;
  especialidade: string;
  fotoUrl: string;
};

export type Servico = {
  id: string;
  nome: string;
  duracao: number; // em minutos
  preco: number;
};

export type SlotDisponivel = {
  inicio: Date; // Objeto Date do JavaScript
  fim: Date;
};

// --- NOSSOS DADOS FALSOS ---

const MOCK_PROFISSIONAIS: Profissional[] = [
  {
    id: "1",
    nome: "Dr. André Silva",
    especialidade: "Clínico Geral",
    fotoUrl: "/dr-andre-silva.png", 
  },
  {
    id: "2",
    nome: "Dra. Beatriz Costa",
    especialidade: "Psicóloga",
    fotoUrl: "/dra-beatriz-costa.png",
  },
  
  {
    id: "3",
    nome: "Dra. Ana Laura",
    especialidade: "Dentista",
    fotoUrl: "/dra-ana-laura.png", 
  },
];

const MOCK_SERVICOS: Servico[] = [
  { id: "s1", nome: "Consulta Inicial", duracao: 60, preco: 150.0 },
  { id: "s2", nome: "Sessão de Acompanhamento", duracao: 45, preco: 100.0 },
  { id: "s3", nome: "Retorno", duracao: 30, preco: 0.0 },
  // (No futuro, você pode querer criar MOCK_SERVICOS_DENTISTA, etc.)
];

// --- NOSSAS FUNÇÕES FALSAS DE API ---

// Simula uma chamada de rede com um pequeno delay
const fakeNetworkDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 500));

/** Busca todos os profissionais */
export async function getProfissionais(): Promise<Profissional[]> {
  await fakeNetworkDelay();
  return Promise.resolve(MOCK_PROFISSIONAIS);
}

/** Busca um profissional específico pelo ID */
export async function getProfissional(id: string): Promise<Profissional | undefined> {
  await fakeNetworkDelay();
  // Encontra o profissional no array MOCK_PROFISSIONAIS
  const profissional = MOCK_PROFISSIONAIS.find((p) => p.id === id);
  return Promise.resolve(profissional);
}

/** Busca os serviços de um profissional (neste mock, todos oferecem os mesmos) */
export async function getServicos(profissionalId: string): Promise<Servico[]> {
  await fakeNetworkDelay();
  // A lógica real buscaria serviços por ID, aqui só ignoramos o ID
  // Se o ID for '3' (Dentista), podemos retornar serviços diferentes no futuro.
  return Promise.resolve(MOCK_SERVICOS);
}

/** Busca os horários vagos de um profissional em um dia específico */
export async function getSlotsDisponiveis(
  profissionalId: string,
  dia: Date
): Promise<SlotDisponivel[]> {
  await fakeNetworkDelay();
  const slots: SlotDisponivel[] = [];
  
  // Lógica falsa: Apenas simula horários vagos das 9h às 17h
  // A lógica real seria muito mais complexa (buscar na API, etc)
  for (let i = 9; i <= 17; i++) {
    const dataBase = new Date(dia); // Clona a data
    slots.push({
      inicio: new Date(dataBase.setHours(i, 0, 0, 0)),
      fim: new Date(dataBase.setHours(i + 1, 0, 0, 0)),
    });
  }
  return Promise.resolve(slots);
}

/** Salva um novo agendamento */
export async function criarAgendamento(agendamento: {
  profissionalId: string;
  servicoId: string;
  inicio: Date;
}) {
  await fakeNetworkDelay();
  // Em um mock, nós apenas fingimos que salvamos
  console.log("AGENDAMENTO CRIADO (MOCK):", agendamento);
  return Promise.resolve({ success: true, id: "novoAgendamento123" });
}