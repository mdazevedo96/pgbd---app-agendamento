import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { AgendamentosService } from './agendamentos.service';
import { AgendamentosController } from './agendamentos.controller';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { HistoricoAgendamento } from 'src/historico-agendamentos/entities/historico-agendamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agendamento, Medico, Usuario, HistoricoAgendamento])],
  controllers: [AgendamentosController],
  providers: [AgendamentosService],
})
export class AgendamentosModule {}
