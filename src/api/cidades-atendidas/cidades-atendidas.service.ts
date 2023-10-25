import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { IbgeService } from 'src/core/services/consulta-cidade/consulta-cidade.service';
import { Repository } from 'typeorm';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioRepository } from '../usuarios/usuarios.repository';
import { CidadeAtendidaRequestDto } from './dto/cidade-atendida-request.dto';
import { CidadeAtendidaResponseDto } from './dto/cidade-atendida-response.dto';
import { CidadesAtendidasRequestDto } from './dto/cidades-atendidas-request.dto';
import { CidadesAtendidas } from './entities/cidades-atendida.entity';

@Injectable()
export class CidadesAtendidasService {
  constructor(
    @InjectRepository(CidadesAtendidas)
    private cidadesAtendidasRepository: Repository<CidadesAtendidas>,
    private consultaCidade: IbgeService,
    private usuarioRepository: UsuarioRepository,
  ) {}
  cidadesAtendidas = [];
  listarCidadesAtendidas(
    usuarioLogado: UsuarioApi,
  ): CidadeAtendidaResponseDto[] {
    return usuarioLogado.cidadesAtendidas;
  }

  async atualizarCidadesAtendidas(
    request: CidadesAtendidasRequestDto,
    usuarioLogado: UsuarioApi,
  ): Promise<{ message: string }> {
    await this.mapearArrayCidades(request);

    usuarioLogado.cidadesAtendidas = this.cidadesAtendidas;
    await this.usuarioRepository.repository.save(usuarioLogado);

    return { message: 'Cidades Atendidas atualizadas com sucesso' };
  }

  private async mapearArrayCidades(request: CidadesAtendidasRequestDto) {
    return Promise.all(
      request.cidades.map(async (cidadeAtendidaRequest) => {
        const cidadeAtendidaDto = plainToInstance(
          CidadeAtendidaRequestDto,
          cidadeAtendidaRequest,
        );
        const codigoIbge = cidadeAtendidaDto.codigoIbge;
        let cidadeAtendida = new CidadesAtendidas();

        try {
          cidadeAtendida = await this.findByCodigoIbge(codigoIbge);
          console.log(codigoIbge);
        } catch (error) {
          if (error.status === 404) {
            cidadeAtendida = await this.cadastrarCidadeAtendida(codigoIbge);
          }
        }
        this.cidadesAtendidas.push(cidadeAtendida);
      }),
    );
  }

  private async cadastrarCidadeAtendida(codigoIbge: string) {
    const cidade = await this.consultaCidade.busucarCidadePorCodigoIbge(
      codigoIbge,
    );

    const cidadeAtendida = new CidadesAtendidas();
    cidadeAtendida.codigoIbge = codigoIbge;
    cidadeAtendida.cidade = cidade.cidade;
    cidadeAtendida.estado = cidade.estado;

    return await this.cidadesAtendidasRepository.save(cidadeAtendida);
  }

  private async findByCodigoIbge(codigoIbge: string) {
    const cidadeAtendida = await this.cidadesAtendidasRepository.findOneBy({
      codigoIbge: codigoIbge,
    });
    if (!cidadeAtendida) {
      throw new NotFoundException('Cidade Atendida Não Encontrada');
    }
    return cidadeAtendida;
  }
}