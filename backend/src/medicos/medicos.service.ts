import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from './entities/medico.entity';
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
        const { id, ...cleanData } = data as any;
        const medico = this.repo.create(cleanData);
        const saved = await this.repo.save(medico);
        return saved;
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
