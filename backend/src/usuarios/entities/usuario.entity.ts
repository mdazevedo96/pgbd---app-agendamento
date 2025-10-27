import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum NivelUsuario {
  ADMIN = 'admin',
  PACIENTE = 'paciente',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  identidade: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: NivelUsuario,
    default: NivelUsuario.PACIENTE,
  })
  nivel: NivelUsuario;
}
