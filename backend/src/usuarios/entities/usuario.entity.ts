import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum NivelUsuario {
  ADMIN = 'admin',
  PACIENTE = 'paciente',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  senha: string;

  @Column({ type: 'enum', enum: NivelUsuario })
  nivel: NivelUsuario;
}



