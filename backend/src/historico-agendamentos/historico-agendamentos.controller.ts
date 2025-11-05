import { Controller, Get, Post, Body } from '@nestjs/common';
import { HistoricoAgendamentosService } from './historico-agendamentos.service';
import { HistoricoAgendamento } from './entities/historico-agendamento.entity';

@Controller('historico-agendamentos')
export class HistoricoAgendamentosController {
  constructor(private service: HistoricoAgendamentosService) {}

  @Post()
  async create(@Body() data: Partial<HistoricoAgendamento>) {
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
