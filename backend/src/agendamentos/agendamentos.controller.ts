import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';

@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  async create(@Body() dto: CreateAgendamentoDto) {
    return this.agendamentosService.create(dto);
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
}
