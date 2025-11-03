import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Medico } from './entities/medico.entity';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  create(createMedicoDto: CreateMedicoDto) {
    const medico = this.medicoRepository.create(createMedicoDto);
    return this.medicoRepository.save(medico);
  }

  async findAll(filters: { nome?: string; especialidade?: string; crm?: string }) {
    const where: FindOptionsWhere<Medico> = {};

    if (filters.nome && filters.nome.trim() !== '') {
      where.nome = Like(`%${filters.nome}%`);
    }

    if (filters.especialidade && filters.especialidade.trim() !== '') {
      where.especialidade = Like(`%${filters.especialidade}%`);
    }

    if (filters.crm && filters.crm.trim() !== '') {
      where.crm = Like(`%${filters.crm}%`);
    }

    // Se não houver filtros, retorna tudo
    if (Object.keys(where).length === 0) {
      return this.medicoRepository.find();
    }

    // Se houver filtros, aplica todos os definidos (AND)
    return this.medicoRepository.find({ where });
  }

  findOne(id: number) {
    return this.medicoRepository.findOneBy({ id });
  }

  update(id: number, updateMedicoDto: UpdateMedicoDto) {
    return this.medicoRepository.update(id, updateMedicoDto);
  }

  remove(id: number) {
    return this.medicoRepository.delete(id);
  }
}
