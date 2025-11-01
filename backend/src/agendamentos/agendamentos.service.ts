import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agendamento, StatusAgendamento } from './entities/agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Medico } from 'src/medicos/entitites/medico.entity';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,

    @InjectRepository(Medico)
    private medicoRepo: Repository<Medico>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateAgendamentoDto) {
    const medico = await this.medicoRepo.findOne({ where: { id: dto.medicoId } });
    const usuario = await this.usuarioRepo.findOne({ where: { id: dto.usuarioId } });

    if (!medico || !usuario) {
      throw new Error('Médico ou usuário não encontrado');
    }

    const dataHora = new Date(dto.dataHora);

    const agendamento = this.agendamentoRepo.create({
      medico,
      usuario,
      dataHora,
      servico: dto.servico,
      status: StatusAgendamento.PENDENTE,
    });

    return this.agendamentoRepo.save(agendamento);
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
}
