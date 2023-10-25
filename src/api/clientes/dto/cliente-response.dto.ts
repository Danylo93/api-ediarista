import { Expose } from 'class-transformer';

export class ClienteResponseDto {
  id: number;

  @Expose({ name: 'nome_completo' })
  nomeCompleto: string;

  nascimento: Date;

  @Expose({ name: 'foto_usuario' })
  fotoUsuario: string;

  telefone: string;

  @Expose({ name: 'tipo_usuario' })
  tipoUsuario: number;

  reputacao: number;
}
