import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PasswordReset } from 'src/api/password-reset/entities/password-reset.entity';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import TipoUsuario from 'src/api/usuarios/enum/tipo-usuario.enum';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async enviarEmailDeConfirmacao(usuario: UsuarioApi) {
    let tipoUsuario = false;

    if (usuario.tipoUsuario == TipoUsuario.CLIENTE) {
      tipoUsuario = true;
    }

    await this.mailerService.sendMail({
      to: usuario.email,
      from: '"E-Diaristas" <ediaristas@suporte.com>',
      subject: 'Bem vindo(a) ao E-Diaristas',
      template: 'confirmation',
      context: {
        nome: usuario.nomeCompleto,
        tipoUsuario: tipoUsuario,
      },
    });
  }

  async enviarEmailDeResetDeSenha(passwordReset: PasswordReset) {
    await this.mailerService.sendMail({
      to: passwordReset.email,
      from: '"E-Diaristas" <ediaristas@suporte.com>',
      subject: 'Solicitação de Reset de senha',
      template: 'resetar-senha',
      context: {
        link: `http://localhost:8000/recuperar-senha?token=${passwordReset.token}`,
      },
    });
  }
}
