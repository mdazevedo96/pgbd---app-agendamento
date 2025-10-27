import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicoDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  especialidade: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}
