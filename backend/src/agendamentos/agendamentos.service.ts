import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Agendamento, StatusAgendamento } from './entities/agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Medico } from 'src/medicos/entities/medico.entity';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,

    @InjectRepository(Medico)
    private medicoRepo: Repository<Medico>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) { }

  async create(dto: CreateAgendamentoDto) {
    const medico = await this.medicoRepo.findOne({ where: { id: dto.medicoId } });
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarioId } });

    if (!medico || !usuario) {
      throw new BadRequestException('Médico ou usuário não encontrado');
    }

    const dataHora = new Date(dto.dataHora);

    const agendamentoExistente = await this.agendamentoRepo.findOne({
      where: {
        usuario: { id: usuario.id },
        medico: { id: medico.id },
      },
    });

    if (agendamentoExistente) {
      throw new BadRequestException('O usuário já tem um agendamento com este médico');
    }

    const existeAgendamento = await this.agendamentoRepo.findOne({
      where: {
        medico: { id: medico.id },
        dataHora,
      },
    });

    if (existeAgendamento) {
      throw new BadRequestException(
        'Já existe um agendamento para este médico neste horário.',
      );
    }

    const agendamento = this.agendamentoRepo.create({
      medico,
      usuario,
      dataHora,
      servico: dto.servico,
      status: StatusAgendamento.PENDENTE,
    });

    return this.agendamentoRepo.save(agendamento);
  }

  async update(id: number, dto: CreateAgendamentoDto) {
    const agendamento = await this.agendamentoRepo.findOne({ where: { id } });
    if (!agendamento) throw new BadRequestException('Agendamento não encontrado');

    const medico = await this.medicoRepo.findOne({ where: { id: dto.medicoId } });
    if (!medico) throw new BadRequestException('Médico não encontrado');

    const dataHora = new Date(dto.dataHora);

    const conflito = await this.agendamentoRepo.findOne({
      where: {
        medico: { id: medico.id },
        dataHora,
      },
    });

    if (conflito && conflito.id !== agendamento.id) {
      throw new BadRequestException(
        'Este horário já está ocupado para o médico selecionado.',
      );
    }

    Object.assign(agendamento, {
      medico,
      dataHora,
      servico: dto.servico,
      status: dto.status ?? agendamento.status,
    });

    return this.agendamentoRepo.save(agendamento);
  }

  async getHorariosDisponiveis(medicoId: number, data?: string) {
    const medico = await this.medicoRepo.findOne({ where: { id: medicoId } });
    if (!medico) throw new BadRequestException('Médico não encontrado');

    if (!medico.horariosDisponiveis || medico.horariosDisponiveis.length === 0) {
      throw new BadRequestException('Este médico ainda não definiu horários disponíveis');
    }

    const dataBusca = data ? new Date(`${data}T00:00:00`) : new Date();

    const diaSemana = dataBusca.getDay();

    if (diaSemana === 0 || diaSemana === 6) {
      return {
        medicoId,
        data: dataBusca.toISOString().split('T')[0],
        horariosDisponiveis: [],
      };
    }

    const inicio = new Date(dataBusca);
    inicio.setHours(0, 0, 0, 0);

    const fim = new Date(dataBusca);
    fim.setHours(23, 59, 59, 999);

    const agendamentos = await this.agendamentoRepo.find({
      where: { medico: { id: medico.id }, dataHora: Between(inicio, fim) },
    });

    const ocupados = agendamentos.map((a) => {
      const dataLocal = new Date(a.dataHora);
      return dataLocal.toTimeString().substring(0, 5);
    });

    const livres = medico.horariosDisponiveis.filter((h) => !ocupados.includes(h));

    return {
      medicoId,
      data: dataBusca.toISOString().split('T')[0],
      horariosDisponiveis: livres,
    };
  }

  async findAll() {
    return this.agendamentoRepo.find({
      relations: ['medico', 'usuario'],
      order: { dataHora: 'ASC' },
    });
  }

  async findByUser(usuarioId: number) {
    return this.agendamentoRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['medico'],
      order: { dataHora: 'ASC' },
    });
  }

  async remove(id: number) {
    return this.agendamentoRepo.delete(id);
  }
  async atualizarStatus(id: number, status: StatusAgendamento) {
    const agendamento = await this.agendamentoRepo.findOne({
      where: { id },
      relations: ['medico', 'usuario'], // opcional, caso queira retornar com as relações
    });

    if (!agendamento) {
      throw new BadRequestException('Agendamento não encontrado');
    }

    agendamento.status = status;
    return this.agendamentoRepo.save(agendamento);
  }
}
