import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { randomUUID } from 'crypto';
  import { MailService } from 'src/core/services/mail/mail.service';
  import { Repository } from 'typeorm';
  import { UsuarioRepository } from '../usuarios/usuarios.repository';
  import { PasswordResetConfirmacaoRequestDto } from './dto/password-reset-confirmacao.dto';
  import { PasswordResetRequestDto } from './dto/password-reset.dto';
  import { PasswordReset } from './entities/password-reset.entity';
  
  @Injectable()
  export class PasswordResetService {
    constructor(
      private usuarioRepository: UsuarioRepository,
      @InjectRepository(PasswordReset)
      private passwordRepository: Repository<PasswordReset>,
      private mailService: MailService,
    ) {}
  
    async criarPasswordReset(email: string) {
      if (await this.usuarioRepository.repository.findOneBy({ email: email })) {
        const passwordReset = new PasswordReset();
        passwordReset.email = email;
        passwordReset.token = randomUUID();
        return await this.passwordRepository.save(passwordReset);
      }
      return null;
    }
  
    async resetarSenha(passwordResetToken: string, novaSenha: string) {
      const passwordReset = await this.buscarPasswordResetPorToken(
        passwordResetToken,
      );
  
      const usuario = await this.usuarioRepository.repository.findOneBy({
        email: passwordReset.email,
      });
  
      await usuario.setPassword(novaSenha);
      await this.usuarioRepository.repository.save(usuario);
      await this.passwordRepository.delete(passwordReset);
    }
  
    private async buscarPasswordResetPorToken(passwordResetToken: string) {
      const passwordReset = await this.passwordRepository.findOneBy({
        token: passwordResetToken,
      });
  
      if (!passwordReset) {
        throw new NotFoundException('Token não encontrado');
      }
  
      return passwordReset;
    }
  
    async solicitarResetDeSenha(request: PasswordResetRequestDto) {
      const passwordReset = await this.criarPasswordReset(request.email);
      if (passwordReset) {
        await this.mailService.enviarEmailDeResetDeSenha(passwordReset);
      }
      return {
        mensagem: 'Verifique o link de reset de senha em sem email cadastrado',
      };
    }
  
    async confirmarResetSenha(request: PasswordResetConfirmacaoRequestDto) {
      await this.validarConfirmacaoSenha(request);
      await this.resetarSenha(request.token, request.password);
  
      return { mensagem: 'Senha alterada com sucesso' };
    }
  
    private async validarConfirmacaoSenha(
      request: PasswordResetConfirmacaoRequestDto,
    ) {
      const senha = request.password;
      const confirmacaoSenha = request.passwordConfirmation;
  
      if (senha != confirmacaoSenha) {
        throw new BadRequestException('Senhas não conferem');
      }
    }
  }