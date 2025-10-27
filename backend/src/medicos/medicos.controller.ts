import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { Medico } from './medico.entity';

@Controller('medicos')
export class MedicosController {
    constructor(private readonly service: MedicosService) { }

    @Get()
    findAll(): Promise<Medico[]> {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Medico | null> {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Medico>) {
        return this.service.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: Partial<Medico>) {
        return this.service.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.service.remove(id);
    }
}
