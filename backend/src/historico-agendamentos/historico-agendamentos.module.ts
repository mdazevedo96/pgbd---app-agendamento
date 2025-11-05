import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricoAgendamento } from './entities/historico-agendamento.entity';
import { HistoricoAgendamentosService } from './historico-agendamentos.service';
import { HistoricoAgendamentosController } from './historico-agendamentos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoricoAgendamento])],
  providers: [HistoricoAgendamentosService],
  controllers: [HistoricoAgendamentosController],
  exports: [HistoricoAgendamentosService],
})
export class HistoricoAgendamentosModule {}
