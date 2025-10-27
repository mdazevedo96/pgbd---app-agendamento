import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './entitites/medico.entity';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Injectable()
export class MedicosService {
    constructor(
        @InjectRepository(Medico)
        private repo: Repository<Medico>,
    ) { }

    findAll() {
        return this.repo.find();
    }

    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

    async create(data: CreateMedicoDto) {
        const medico = this.repo.create(data);
        return this.repo.save(medico);
    }

    async update(id: number, data: UpdateMedicoDto) {
        await this.repo.update(id, data);
        return this.repo.findOneBy({ id });
    }

    async remove(id: number) {
        await this.repo.delete(id);
        return { deleted: true };
    }
}
