import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioRequestDto } from './dto/usuario-request.dto';
import { UsuarioRepository } from './usuarios.repository';
import { UsuarioMapper } from './usuarios.mapper';
import { ValidatorPasswordConfirmation } from 'src/core/validators/usuarios/validator-password';
import { ValidatorUsuarioPix } from 'src/core/validators/usuarios/validator-usuario-pix';
import { Request } from 'express';
import { FotosService } from '../fotos/fotos.service';
import { MailService } from 'src/core/services/mail/mail.service';
import { JwtTokens } from 'src/auth/strategies/jwt-tokens';
import { JwtPayload } from 'src/auth/strategies/jwt-payload.interface';
import { UsuarioApi } from './entities/usuario.entity';
import * as fs from 'fs/promises';
import { join } from 'path';
import { UsuarioAtualizarRequestDto } from './dto/usuario-atualizar-request.dto';
import * as aws from 'aws-sdk';
import { config } from 'dotenv';

@Injectable()
export class UsuariosService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private usuarioMapper: UsuarioMapper,
    private validator: ValidatorPasswordConfirmation,
    private validatorPix: ValidatorUsuarioPix,
    private foto: FotosService,
    private mailService: MailService,
    private jwtTokens: JwtTokens,
  ) {}
  async cadastrar(
    usuarioRequestDto: UsuarioRequestDto,
    file: Express.MulterS3.File,
    req: Request,
  ) {
    this.validator.validarConfirmacaoDeSenha(
      usuarioRequestDto.password,
      usuarioRequestDto.passwordConfirmation,
    );

    usuarioRequestDto.chavePix =
      this.validatorPix.validarUsuarioPix(usuarioRequestDto);

    const foto = await this.foto.salvar(file, req);
    const usuarioParaCadastrar = this.usuarioMapper.toUsuarioRequestDto(
      usuarioRequestDto,
      foto,
    );

    usuarioParaCadastrar.reputacao = await this.calcularReputacaoMedia(
      usuarioRequestDto.tipoUsuario,
    );

    const usuarioCadastrado = await this.usuarioRepository.repository.save(
      usuarioParaCadastrar,
    );
    const usuarioCadastroDto =
      this.usuarioMapper.toUsuarioCadastroResponseDto(usuarioCadastrado);

    const { email } = usuarioCadastrado;
    const payload: JwtPayload = { email };
    usuarioCadastroDto.token = await this.jwtTokens.gerarTokens(payload);
    /* await this.mailService.enviarEmailDeConfirmacao(usuarioCadastrado); */
    return usuarioCadastroDto;
  }

  async atualizarFotoUsuario(
    file: Express.MulterS3.File,
    usuarioLogado: UsuarioApi,
    req: Request,
  ): Promise<{ mensagem: string }> {
    if (!usuarioLogado.fotoUsuario) {
      const foto = await this.foto.salvar(file, req);
      usuarioLogado.fotoUsuario = foto;
      await this.usuarioRepository.repository.save(usuarioLogado);
      return { mensagem: 'Foto salva com sucesso' };
    } else {
      const id = usuarioLogado.fotoUsuario.id;
      const nome = usuarioLogado.fotoUsuario.fileName;
      const foto = await this.foto.salvar(file, req);
      usuarioLogado.fotoUsuario = foto;
      await this.usuarioRepository.repository.save(usuarioLogado);
      await this.apagarFotoDesatualizada(nome, id);
      return { mensagem: 'Foto atualizada com sucesso' };
    }
  }

  async atualizar(
    atualizarUsuarioRequestDto: UsuarioAtualizarRequestDto,
    usuarioLogado: UsuarioApi,
  ): Promise<{ mensagem: string }> {
    this.atualizarInformacoesUsuarioLogado(
      atualizarUsuarioRequestDto,
      usuarioLogado,
    );

    await this.atualizarSenha(atualizarUsuarioRequestDto, usuarioLogado);

    await this.usuarioRepository.repository.save(usuarioLogado);
    return { mensagem: 'Usuário atualizado com sucesso' };
  }
  private async atualizarSenha(
    atualizarUsuarioRequestDto: UsuarioAtualizarRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    const hasSenha =
      atualizarUsuarioRequestDto.password &&
      atualizarUsuarioRequestDto.newPassword &&
      atualizarUsuarioRequestDto.passwordConfirmation;

    if (hasSenha) {
      await this.verificarSenha(atualizarUsuarioRequestDto, usuarioLogado);
      this.validator.validarConfirmacaoDeSenha(
        atualizarUsuarioRequestDto.newPassword,
        atualizarUsuarioRequestDto.passwordConfirmation,
      );
      const novaSenha = atualizarUsuarioRequestDto.newPassword;
      await usuarioLogado.setPassword(novaSenha);
    }
  }
  private async verificarSenha(
    atualizarUsuarioRequestDto: UsuarioAtualizarRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    const senhaRequest = atualizarUsuarioRequestDto.password;
    const senhaDB = usuarioLogado.senha;

    if (!(await bcrypt.compare(senhaRequest, senhaDB))) {
      throw new BadRequestException('A senha informada está incorreta');
    }
  }

  private atualizarInformacoesUsuarioLogado(
    atualizarUsuarioRequestDto: UsuarioAtualizarRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    usuarioLogado.nomeCompleto = !atualizarUsuarioRequestDto.nomeCompleto
      ? usuarioLogado.nomeCompleto
      : atualizarUsuarioRequestDto.nomeCompleto;

    usuarioLogado.chavePix = !atualizarUsuarioRequestDto.chavePix
      ? usuarioLogado.chavePix
      : atualizarUsuarioRequestDto.chavePix;

    usuarioLogado.cpf = !atualizarUsuarioRequestDto.cpf
      ? usuarioLogado.cpf
      : atualizarUsuarioRequestDto.cpf;

    usuarioLogado.email = !atualizarUsuarioRequestDto.email
      ? usuarioLogado.email
      : atualizarUsuarioRequestDto.email;

    usuarioLogado.nascimento = !atualizarUsuarioRequestDto.nascimento
      ? usuarioLogado.nascimento
      : atualizarUsuarioRequestDto.nascimento;

    usuarioLogado.telefone = !atualizarUsuarioRequestDto.telefone
      ? usuarioLogado.telefone
      : atualizarUsuarioRequestDto.telefone;
  }

  private async calcularReputacaoMedia(tipoUsuario: number): Promise<number> {
    let reputacaoMedia =
      await this.usuarioRepository.repository.getMediaReputacao(tipoUsuario);

    if (reputacaoMedia === null || reputacaoMedia === 0) {
      reputacaoMedia = 5;
    }

    return reputacaoMedia;
  }

  private async apagarFotoDesatualizadaLocal(nome: string, id: number) {
    try {
      const path = join(__dirname, '..', '..', '..', '/public/images', nome);
      if (!id) return null;
      await fs.unlink(path);
      await this.foto.deletar(id);
    } catch (error) {
      console.log('Current directory:', __dirname);
      console.log(error);
      throw new BadRequestException('Problema ao excluir foto desatualizada');
    }
  }

  private async apagarFotoDesatualizada(nome: string, id: number) {


    try {
      const s3 = new aws.S3({
        region: process.env.REGION,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
      });
      s3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: nome,
        },
        (err) => console.error(err),
      );

      await this.foto.deletar(id);
    } catch (error) {
      throw new BadRequestException({
        mensagem: 'Problema ao excluir foto desatualizada',
        error: `${error}`,
      });
    }
  }
}
