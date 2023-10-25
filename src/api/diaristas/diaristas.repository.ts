import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';

export class DiaristaRepository {
  constructor(
    @InjectRepository(UsuarioApi)
    private diaristaRepository: Repository<UsuarioApi>,
  ) {}

  repository = this.diaristaRepository.extend({
    async buscarDiaristaPorCodigoIbge(
      ibge: string,
      pageSize: number,
    ): Promise<PagedQuery<UsuarioApi>> {
      const query = this.createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.cidadesAtendidas', 'cidadesAtendidas')
        .where('cidadesAtendidas.codigoIbge = :ibge', { ibge: ibge })
        .andWhere('usuario.tipoUsuario = 2')
        .orderBy('usuario.reputacao', 'DESC');
      const usuarios = await query.limit(pageSize).getMany();
      const count = await query.getCount();

      return { content: usuarios, totalElementos: count };
    },

    async existsByCidadesAtendidasCodigoIbge(codigoIbge: string) {
      const exists = await this.createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.cidadesAtendidas', 'cidadesAtendidas')
        .where('cidadesAtendidas.codigoIbge = :ibge', { ibge: codigoIbge })
        .andWhere('usuario.tipoUsuario = 2')
        .limit(1)
        .getCount();

      return exists > 0 ? true : false;
    },
  });
}

export interface PagedQuery<T> {
  content: T[];
  totalElementos: number;
}
