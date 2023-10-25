import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioApi } from './entities/usuario.entity';

export class UsuarioRepository {
  constructor(
    @InjectRepository(UsuarioApi)
    private usuarioRepository: Repository<UsuarioApi>,
  ) {}

  repository = this.usuarioRepository.extend({
    async getMediaReputacao(tipoUsuario: number): Promise<number> {
      const { avg } = await this.createQueryBuilder('usuario')
        .select('AVG(usuario.reputacao)', 'avg')
        .where('usuario.tipo_usuario = :tipo_usuario', {
          tipo_usuario: tipoUsuario,
        })
        .getRawOne();
      return avg;
    },
  });
}
