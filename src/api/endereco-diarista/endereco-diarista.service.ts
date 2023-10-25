import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnderecoMapper } from '../consulta-endereco/endereco.mapper';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioRepository } from '../usuarios/usuarios.repository';
import { EnderecoDiaristaRequestDto } from './dto/endereco-diarista-request.dto';
import { EnderecoDiaristaMapper } from './endereco-diarista.mapper';
import { EnderecoDiarista } from './entities/endereco-diarista.entity';

@Injectable()
export class EnderecoDiaristaService {
  constructor(
    @InjectRepository(EnderecoDiarista)
    private enderecoRepository: Repository<EnderecoDiarista>,
    private usuarioRepository: UsuarioRepository,
    private enderecoMapper: EnderecoDiaristaMapper,
  ) {}
  async atualizarEndereco(
    enderecoDiarista: EnderecoDiaristaRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    if (!usuarioLogado.endereco) {
      return this.cadastrarEndereco(enderecoDiarista, usuarioLogado);
    }
    return this.novoEndereco(enderecoDiarista, usuarioLogado);
  }

  async exibirEndereco(usuarioLogado: UsuarioApi) {
    if (!usuarioLogado.endereco) {
      throw new NotFoundException(
        `Endereço do usuário ${usuarioLogado.email} não encontrado`,
      );
    }

    return this.enderecoMapper.toEnderecoDiaristaResponse(
      usuarioLogado.endereco,
    );
  }

  private async novoEndereco(
    enderecoDiarista: EnderecoDiaristaRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    enderecoDiarista.id = usuarioLogado.endereco.id;
    usuarioLogado.endereco = await this.enderecoRepository.save(
      enderecoDiarista,
    );

    const usuarioAtualizado = await this.usuarioRepository.repository.save(
      usuarioLogado,
    );

    return this.enderecoMapper.toEnderecoDiaristaResponse(
      usuarioAtualizado.endereco,
    );
  }

  private async cadastrarEndereco(
    enderecoDiarista: EnderecoDiaristaRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    usuarioLogado.endereco = await this.enderecoRepository.save(
      enderecoDiarista,
    );
    const usuarioAtualizado = await this.usuarioRepository.repository.save(
      usuarioLogado,
    );

    return this.enderecoMapper.toEnderecoDiaristaResponse(
      usuarioAtualizado.endereco,
    );
  }
}
