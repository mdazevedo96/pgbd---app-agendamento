import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
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
  async findAll(
    @Query('usuarioId') usuarioId?: string,
    @Query('medicoId') medicoId?: string,
    @Query('medicoNome') medicoNome?: string,
    @Query('usuarioNome') usuarioNome?: string,
    @Query('status') status?: StatusAgendamento,
    @Query('data') data?: string,
  ) {
    return this.agendamentosService.findAll({
      usuarioId: usuarioId ? parseInt(usuarioId, 10) : undefined,
      medicoId: medicoId ? parseInt(medicoId, 10) : undefined,
      medicoNome,
      usuarioNome,
      status,
      data,
    });
  }

  @Get('usuario/:usuarioId')
  async findByUser(
    @Param('usuarioId') usuarioId: number,
    @Query('status') status?: StatusAgendamento,
    @Query('data') data?: string,
  ) {
    return this.agendamentosService.findByUser(usuarioId, { status, data });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.agendamentosService.remove(id);
  }

  @Patch(':id/status')
  async atualizarStatus(
    @Param('id') id: number,
    @Body('status') status: StatusAgendamento, // 'pendente' | 'confirmado' | 'cancelado'
  ) {
    return this.agendamentosService.atualizarStatus(id, status);
  }
}
