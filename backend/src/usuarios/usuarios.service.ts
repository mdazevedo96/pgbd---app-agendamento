import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { Usuario, NivelUsuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) { }

  findAll(): Promise<Partial<Usuario>[]> {
    return this.repo.find({
      select: ['id', 'nome', 'cpf', 'identidade', 'nivel'],
    });
  }

  async findOne(id: number): Promise<Partial<Usuario>> {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuário ${id} não encontrado`);
    delete (usuario as any).password;
    return usuario;
  }

  async create(data: CreateUsuarioDto): Promise<Partial<Usuario>> {
    const exists = await this.repo.findOneBy({ cpf: data.cpf });
    if (exists) throw new ConflictException('CPF já cadastrado');

    const hashed = await bcrypt.hash(data.password, 10);

    const novo = this.repo.create({
      nome: data.nome,
      cpf: data.cpf,
      identidade: data.identidade,
      password: hashed,
      nivel: data.nivel ?? NivelUsuario.PACIENTE,
    });

    const saved = await this.repo.save(novo);
    const { password, ...rest } = saved;
    return rest;
  }

  async update(id: number, data: UpdateUsuarioDto): Promise<Partial<Usuario>> {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuário ${id} não encontrado`);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.cpf && data.cpf !== usuario.cpf) {
      const other = await this.repo.findOneBy({ cpf: data.cpf });
      if (other) throw new ConflictException('CPF já cadastrado por outro usuário');
    }

    await this.repo.update(id, {
      ...data,
      nivel: data.nivel ?? usuario.nivel,
    });

    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException(`Usuário ${id} não encontrado após atualização`);

    const { password, ...rest } = updated;
    return rest;
  }

  async remove(id: number) {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuário ${id} não encontrado`);
    await this.repo.delete(id);
    return { deleted: true };
  }
}
