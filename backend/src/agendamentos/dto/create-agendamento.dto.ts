import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { StatusAgendamento } from '../entities/agendamento.entity';

export class CreateAgendamentoDto {
  @IsNumber()
  medicoId: number;

  @IsNumber()
  usuarioId: number;

  @IsDateString({}, { message: 'O campo dataHora deve estar em formato ISO (ex: 2025-11-02T14:00:00Z)' })
  dataHora: string;

  @IsString()
  @IsNotEmpty()
  servico: string;

  @IsEnum(StatusAgendamento)
  @IsOptional()
  status?: StatusAgendamento;

  @IsBoolean()
  @IsOptional()
  finalizado?: boolean;
}
