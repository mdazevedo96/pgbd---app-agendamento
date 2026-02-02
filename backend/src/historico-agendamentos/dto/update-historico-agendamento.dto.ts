import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoricoAgendamentoDto } from './create-historico-agendamento.dto';

export class UpdateHistoricoAgendamentoDto extends PartialType(CreateHistoricoAgendamentoDto) {}
