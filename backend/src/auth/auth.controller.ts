import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { cpf: string; senha: string }) {
    const user = await this.authService.validateUser(body.cpf, body.senha);
    return this.authService.login(user);
  }
}
