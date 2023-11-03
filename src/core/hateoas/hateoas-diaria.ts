import { Injectable } from '@nestjs/common';
import { AvaliacaoController } from 'src/api/avaliacoes/avaliacao.controller';
import { ConfirmacaoPresencaController } from 'src/api/confirmacao-presenca/confirmacao-presenca.controller';
import { DiariasController } from 'src/api/diarias/diarias.controller';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { DiaristasController } from 'src/api/diaristas/diaristas.controller';
import { PagamentosController } from 'src/api/pagamentos/pagamentos.controller';
import TipoUsuario from 'src/api/usuarios/enum/tipo-usuario.enum';
import { HateoasLinks } from './hateoas.interface';
import { HateoasBase } from './hatoas-base';

@Injectable()
export class HateoasDiaria extends HateoasBase {
  gerarLinksHateos(
    tipoUsuario?: number,
    diaria?: Diaria,
    avaliacaoApta?: boolean,
  ): HateoasLinks[] {
    this.LINKS = [];

    const params = {
      id: diaria.id,
    };

    if (
      tipoUsuario === TipoUsuario.CLIENTE &&
      diaria.status === DiariaStatus.SEM_PAGAMENTO
    ) {
      this.adicionarLinks(
        'POST',
        'pagar_diaria',
        PagamentosController,
        PagamentosController.prototype.pagar,
        params,
      );
    }

    if (this.isAptaParaConfirmacaoPresencia(diaria, tipoUsuario)) {
      this.adicionarLinks(
        'PATCH',
        'confirmar_diarista',
        ConfirmacaoPresencaController,
        ConfirmacaoPresencaController.prototype.confirmacaoPresenca,
        params,
      );
    }

    this.adicionarLinks(
      'GET',
      'self',
      DiariasController,
      DiariasController.prototype.buscarPorId,
      params,
    );

    if (this.isAptaParaAvaliacao(diaria, avaliacaoApta)) {
      this.adicionarLinks(
        'PATCH',
        'avaliar_diaria',
        AvaliacaoController,
        AvaliacaoController.prototype.avaliarDiaria,
        params,
      );
    }

    if (this.isAptaParaCancelamento(diaria)) {
      this.adicionarLinks(
        'PATCH',
        'cancelar_diaria',
        DiariasController,
        DiariasController.prototype.cancelar,
        params,
      );
    }

    return this.LINKS;
  }
  private isAptaParaAvaliacao(diaria: Diaria, avaliacaoApta: boolean): boolean {
    return diaria.status === DiariaStatus.CONCLUIDO && !avaliacaoApta;
  }

  private isAptaParaConfirmacaoPresencia(diaria: Diaria, tipoUsuario: number) {
    const hoje = new Date(Date.now());
    if (
      tipoUsuario === TipoUsuario.CLIENTE &&
      diaria.status === DiariaStatus.CONFIRMADO &&
      diaria.dataAtendimento < hoje
    ) {
      return true;
    }
    return false;
  }

  private isAptaParaCancelamento(diaria: Diaria) {
    const dataHoje = new Date(Date.now());
    if (
      (diaria.status === DiariaStatus.PAGO ||
        diaria.status === DiariaStatus.CONFIRMADO) &&
      diaria.dataAtendimento > dataHoje
    ) {
      return true;
    }
    return false;
  }
}
