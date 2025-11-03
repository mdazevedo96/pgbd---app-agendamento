import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { StatusAgendamento } from './entities/agendamento.entity';

@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  async create(@Body() dto: CreateAgendamentoDto) {
    return this.agendamentosService.create(dto);
  }

  @Get('disponiveis/:medicoId')
  async getHorariosDisponiveis(
    @Param('medicoId') medicoId: number,
    @Query('data') data?: string,
  ) {
    return this.agendamentosService.getHorariosDisponiveis(medicoId, data);
  }

  @Get()
  async findAll() {
    return this.agendamentosService.findAll();
  }

  @Get('usuario/:usuarioId')
  async findByUser(@Param('usuarioId') usuarioId: number) {
    return this.agendamentosService.findByUser(usuarioId);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.agendamentosService.remove(id);
  }

  // Nova rota PATCH para atualizar status
  @Patch(':id/status')
  async atualizarStatus(
    @Param('id') id: number,
    @Body('status') status: StatusAgendamento, // 'pendente' | 'confirmado' | 'cancelado'
  ) {
    return this.agendamentosService.atualizarStatus(id, status);
  }
}
