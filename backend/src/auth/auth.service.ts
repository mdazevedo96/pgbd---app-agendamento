import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async validateUser(cpf: string, senha: string) {
    const user = await this.usuariosRepo.findOne({ where: { cpf } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const isValid = await bcrypt.compare(senha, user.senha);
    if (!isValid) throw new UnauthorizedException('Senha incorreta');

    const { senha: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, nome: user.nome, nivel: user.nivel };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
