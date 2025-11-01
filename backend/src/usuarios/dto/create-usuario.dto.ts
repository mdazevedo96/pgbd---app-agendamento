import { IsNotEmpty, IsString, MinLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { NivelUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos (somente números)' })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @IsOptional()
  @IsEnum(NivelUsuario, { message: 'Nível deve ser admin ou paciente' })
  nivel?: NivelUsuario;
}
