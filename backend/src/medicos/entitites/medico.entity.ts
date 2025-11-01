import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  crm: string;

  @Column()
  especialidade: string;

  @Column({ nullable: true })
  fotoUrl?: string;
}
