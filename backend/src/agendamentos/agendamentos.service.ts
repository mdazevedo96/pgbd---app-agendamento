import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Agendamento, StatusAgendamento } from './entities/agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AgendamentosService {

  private readonly logger = new Logger(AgendamentosService.name);

  constructor(
    @InjectRepository(Agendamento)
    private agendamentoRepo: Repository<Agendamento>,

    @InjectRepository(Medico)
    private medicoRepo: Repository<Medico>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) { }

  async create(dto: CreateAgendamentoDto) {
    const medico = await this.medicoRepo.findOne({
      where: { id: dto.medicoId },
    });
    const usuario = await this.usuarioRepo.findOne({
      where: { id: dto.usuarioId },
    });

    if (!medico || !usuario) {
      throw new BadRequestException('Médico ou usuário não encontrado');
    }

    const dataHora = new Date(dto.dataHora);

    const agendamentoExistente = await this.agendamentoRepo.findOne({
      where: {
        usuario: { id: usuario.id },
        medico: { id: medico.id },
        status: In([StatusAgendamento.PENDENTE, StatusAgendamento.CONFIRMADO]),
        finalizado: false,
      },
    });

    if (agendamentoExistente) {
      throw new BadRequestException(
        'O usuário já tem um agendamento com este médico',
      );
    }

    const existeAgendamento = await this.agendamentoRepo.findOne({
      where: { medico: { id: medico.id }, dataHora },
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
    if (!agendamento)
      throw new BadRequestException('Agendamento não encontrado');

    const medico = await this.medicoRepo.findOne({
      where: { id: dto.medicoId },
    });
    if (!medico) throw new BadRequestException('Médico não encontrado');

    const dataHora = new Date(dto.dataHora);

    const conflito = await this.agendamentoRepo.findOne({
      where: { medico: { id: medico.id }, dataHora },
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

    if (
      !medico.horariosDisponiveis ||
      medico.horariosDisponiveis.length === 0
    ) {
      throw new BadRequestException(
        'Este médico ainda não definiu horários disponíveis',
      );
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

    const ocupados = agendamentos.map((a) =>
      new Date(a.dataHora).toTimeString().substring(0, 5),
    );

    const livres = medico.horariosDisponiveis.filter(
      (h) => !ocupados.includes(h),
    );

    return {
      medicoId,
      data: dataBusca.toISOString().split('T')[0],
      horariosDisponiveis: livres,
    };
  }

  async findAll(filters?: {
    usuarioId?: number;
    medicoId?: number;
    status?: StatusAgendamento;
    data?: string;
    medicoNome?: string;
    usuarioNome?: string;
  }) {
    const query = this.agendamentoRepo
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.medico', 'medico')
      .leftJoinAndSelect('agendamento.usuario', 'usuario');

    if (filters?.usuarioId)
      query.andWhere('usuario.id = :usuarioId', {
        usuarioId: filters.usuarioId,
      });
    if (filters?.medicoId)
      query.andWhere('medico.id = :medicoId', { medicoId: filters.medicoId });
    if (filters?.status)
      query.andWhere('agendamento.status = :status', {
        status: filters.status,
      });
    if (filters?.data) {
      const inicio = new Date(`${filters.data}T00:00:00`);
      const fim = new Date(`${filters.data}T23:59:59`);
      query.andWhere('agendamento.dataHora BETWEEN :inicio AND :fim', {
        inicio,
        fim,
      });
    }
    if (filters?.medicoNome)
      query.andWhere('LOWER(medico.nome) LIKE :medicoNome', {
        medicoNome: `%${filters.medicoNome.toLowerCase()}%`,
      });
    if (filters?.usuarioNome)
      query.andWhere('LOWER(usuario.nome) LIKE :usuarioNome', {
        usuarioNome: `%${filters.usuarioNome.toLowerCase()}%`,
      });

    return query.orderBy('agendamento.dataHora', 'ASC').getMany();
  }

  async findByUser(
    usuarioId: number,
    filters?: { status?: StatusAgendamento; data?: string },
  ) {
    const query = this.agendamentoRepo
      .createQueryBuilder('agendamento')
      .leftJoinAndSelect('agendamento.medico', 'medico')
      .where('agendamento.usuarioId = :usuarioId', { usuarioId });

    if (filters?.status)
      query.andWhere('agendamento.status = :status', {
        status: filters.status,
      });

    if (filters?.data) {
      const inicio = new Date(`${filters.data}T00:00:00`);
      const fim = new Date(`${filters.data}T23:59:59`);
      query.andWhere('agendamento.dataHora BETWEEN :inicio AND :fim', {
        inicio,
        fim,
      });
    }

    return query.orderBy('agendamento.dataHora', 'ASC').getMany();
  }

  async remove(id: number) {
    return this.agendamentoRepo.delete(id);
  }

  async atualizarStatus(id: number, status: StatusAgendamento) {
    const agendamento = await this.agendamentoRepo.findOne({
      where: { id },
      relations: ['medico', 'usuario'],
    });

    if (!agendamento)
      throw new BadRequestException('Agendamento não encontrado');

    agendamento.status = status;
    return this.agendamentoRepo.save(agendamento);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async finalizarConsultasAntigas() {
    const result = await this.agendamentoRepo
      .createQueryBuilder()
      .update(Agendamento)
      .set({ finalizado: true })
      .where('dataHora < NOW()')
      .andWhere('status = :status', { status: StatusAgendamento.CONFIRMADO })
      .andWhere('finalizado = false')
      .execute();

    if (result.affected && result.affected > 0) {
      this.logger.log(`🕐 ${result.affected} agendamentos finalizados automaticamente.`);
    }
  }
}
