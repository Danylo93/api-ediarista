import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetConfirmacaoRequestDto } from './dto/password-reset-confirmacao.dto';
import { PasswordResetRequestDto } from './dto/password-reset.dto';
import { PasswordResetService } from './password-reset.service';

@Controller('/api/recuperar-senha')
export class PasswordResetController {
  constructor(private passwordResetService: PasswordResetService) {}

  @Post()
  async solicitarResetDeSenha(@Body() request: PasswordResetRequestDto) {
    return await this.passwordResetService.solicitarResetDeSenha(request);
  }

  @Post('confirm')
  async confirmarResetDeSenha(
    @Body() request: PasswordResetConfirmacaoRequestDto,
  ) {
    return await this.passwordResetService.confirmarResetSenha(request);
  }
}