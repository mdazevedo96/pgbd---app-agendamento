import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('historico_agendamentos')
export class HistoricoAgendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  medicoNome: string;

  @Column()
  usuarioNome: string;

  @Column({ type: 'datetime' })
  dataHora: Date;

  @Column()
  servico: string;

  @Column()
  status: string;

  @CreateDateColumn()
  criadoEm: Date;
}
