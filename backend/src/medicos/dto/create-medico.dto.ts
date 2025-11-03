import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  nome: string;

  @IsString()
  crm: string;

  @IsString()
  especialidade: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;

  @IsOptional()
  @IsArray()
  horariosDisponiveis?: string[];
}
