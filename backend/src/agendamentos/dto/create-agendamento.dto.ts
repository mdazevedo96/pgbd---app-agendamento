import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';

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
}
