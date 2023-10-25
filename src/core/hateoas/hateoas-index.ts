import { Injectable } from '@nestjs/common';
import { ConsultaEnderecoController } from 'src/api/consulta-endereco/consulta-endereco.controller';
import { DiaristasController } from 'src/api/diaristas/diaristas.controller';
import { MeController } from 'src/api/me/me.controller';
import { ServicosController } from 'src/api/servicos/servicos.controller';
import { UsuariosController } from 'src/api/usuarios/usuarios.controller';
import { AuthController } from 'src/auth/auth.controller';
import { HateoasLinks } from './hateoas.interface';
import { HateoasBase } from './hatoas-base';

@Injectable()
export class HateosIndex extends HateoasBase {
  gerarLinksHateos(): HateoasLinks[] {
    this.LINKS = [];

    this.adicionarLinks(
      'GET',
      'diaristas_localidades',
      DiaristasController,
      DiaristasController.prototype.buscarPorCep,
    );

    this.adicionarLinks(
      'GET',
      'verificar_disponibilidade_atendimento',
      DiaristasController,
      DiaristasController.prototype.verificarDisponibilidadePorCep,
    );

    this.adicionarLinks(
      'GET',
      'endereco_cep',
      ConsultaEnderecoController,
      ConsultaEnderecoController.prototype.buscarEnderecoPorCep,
    );

    this.adicionarLinks(
      'GET',
      'listar_servicos',
      ServicosController,
      ServicosController.prototype.findAll,
    );

    this.adicionarLinks(
      'POST',
      'cadastrar_usuario',
      UsuariosController,
      UsuariosController.prototype.cadastrar,
    );

    this.adicionarLinks(
      'POST',
      'login',
      AuthController,
      AuthController.prototype.autenticar,
    );

    this.adicionarLinks(
      'POST',
      'refresh',
      AuthController,
      AuthController.prototype.reautenticar,
    );

    this.adicionarLinks(
      'POST',
      'logout',
      AuthController,
      AuthController.prototype.logOut,
    );

    this.adicionarLinks(
      'GET',
      'usuario_logado',
      MeController,
      MeController.prototype.me,
    );

    return this.LINKS;
  }
}
