import { Injectable } from '@nestjs/common';
import { HateoasLinks } from './hateoas.interface';
import { HateoasBase } from './hatoas-base';
import { DiariasController } from 'src/api/diarias/diarias.controller';
import TipoUsuario from 'src/api/usuarios/enum/tipo-usuario.enum';
import { EnderecoDiaristaController } from 'src/api/endereco-diarista/endereco-diarista.controller';
import { CidadesAtendidasController } from 'src/api/cidades-atendidas/cidades-atendidas.controller';
import { OportunidadesController } from 'src/api/oportunidades/oportunidades.controller';
import { PagamentosController } from 'src/api/pagamentos/pagamentos.controller';
import { UsuariosController } from 'src/api/usuarios/usuarios.controller';

@Injectable()
export class HateoasUsuario extends HateoasBase {
  gerarLinksHateos(tipoUsuario?: number): HateoasLinks[] {
    this.LINKS = [];

    if (tipoUsuario == TipoUsuario.CLIENTE) {
      this.adicionarLinks(
        'POST',
        'cadastrar_diaria',
        DiariasController,
        DiariasController.prototype.cadastrar,
      );
    }

    if (tipoUsuario === TipoUsuario.DIARISTA) {
      this.adicionarLinks(
        'PUT',
        'cadastrar_endereco',
        EnderecoDiaristaController,
        EnderecoDiaristaController.prototype.atualizarEndereco,
      );

      this.adicionarLinks(
        'GET',
        'listar_endereco',
        EnderecoDiaristaController,
        EnderecoDiaristaController.prototype.exibirEndereco,
      );

      this.adicionarLinks(
        'PUT',
        'relacionar_cidades',
        CidadesAtendidasController,
        CidadesAtendidasController.prototype.atualizarCidadesAtendidas,
      );

      this.adicionarLinks(
        'GET',
        'listar_cidades',
        CidadesAtendidasController,
        CidadesAtendidasController.prototype.listarCidadesAtendidas,
      );

      this.adicionarLinks(
        'GET',
        'lista_oportunidades',
        OportunidadesController,
        OportunidadesController.prototype.buscarOportunidades,
      );

      this.adicionarLinks(
        'GET',
        'lista_pagamentos',
        PagamentosController,
        PagamentosController.prototype.listarPagamentos,
      );
    }

    this.adicionarLinks(
      'POST',
      'alterar_foto_usuario',
      UsuariosController,
      UsuariosController.prototype.atualizarFotoUsuario,
    );

    this.adicionarLinks(
      'PUT',
      'editar_usuario',
      UsuariosController,
      UsuariosController.prototype.atualizar,
    );

    this.adicionarLinks(
      'GET',
      'lista_diarias',
      DiariasController,
      DiariasController.prototype.listarDiarias,
    );

    return this.LINKS;
  }
}