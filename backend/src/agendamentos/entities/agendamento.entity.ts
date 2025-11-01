import { Medico } from 'src/medicos/entitites/medico.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum StatusAgendamento {
  PENDENTE = 'pendente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
}

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medicoId' })
  medico: Medico;

  @ManyToOne(() => Usuario)
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
