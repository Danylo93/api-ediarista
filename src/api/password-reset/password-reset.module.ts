import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/core/services/mail/mail.service';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioRepository } from '../usuarios/usuarios.repository';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioApi, PasswordReset])],
  controllers: [PasswordResetController],
  providers: [UsuarioRepository, PasswordResetService, MailService],
})
export class PasswordResetModule {}