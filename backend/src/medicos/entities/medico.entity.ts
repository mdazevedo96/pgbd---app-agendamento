import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  nome: string;

  @Column()
  crm: string;

  @Column()
  especialidade: string;

  @Column({ nullable: true })
  fotoUrl?: string;

  @Column({ type: 'json', nullable: true })
  horariosDisponiveis?: string[];
}
