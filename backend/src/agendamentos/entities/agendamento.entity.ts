import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Medico } from 'src/medicos/entities/medico.entity';

export enum StatusAgendamento {
  PENDENTE = 'pendente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
}

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => Medico, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicoId' })
  medico: Medico;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ type: 'datetime' })
  dataHora: Date;

  @Column({ length: 100 })
  servico: string;

  @Column({
    type: 'enum',
    enum: StatusAgendamento,
    default: StatusAgendamento.PENDENTE,
  })
  status: StatusAgendamento;
}
