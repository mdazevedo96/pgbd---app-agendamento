import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricoAgendamento } from './entities/historico-agendamento.entity';

@Injectable()
export class HistoricoAgendamentosService {
  constructor(
    @InjectRepository(HistoricoAgendamento)
    private historicoRepo: Repository<HistoricoAgendamento>,
  ) {}

  async create(data: Partial<HistoricoAgendamento>) {
    const novo = this.historicoRepo.create(data);
    return this.historicoRepo.save(novo);
  }

  async findAll() {
    return this.historicoRepo.find({
      order: { dataHora: 'DESC' },
    });
  }
}
