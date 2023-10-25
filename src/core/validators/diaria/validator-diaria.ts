import { BadRequestException, Injectable } from '@nestjs/common';
import { DiariaRequestDto } from 'src/api/diarias/dto/diaria-request.dto';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { DiaristaRepository } from 'src/api/diaristas/diaristas.repository';
import { Servico } from 'src/api/servicos/entities/servico.entity';
import { ViaCepService } from 'src/core/via-cep.service';

@Injectable()
export class ValidatorDiaria {
  constructor(
    private validatorCep: ViaCepService,
    private diariastaRepository: DiaristaRepository,
  ) {}
  async validarDiaria(
    diariaRequestDto: DiariaRequestDto,
    horaLimiteAtendimento: number,
    servico: Servico,
  ) {
    this.validarDataDiaria(diariaRequestDto);
    this.validarHoraAtendimento(diariaRequestDto, horaLimiteAtendimento);
    this.validarTempoAtendimento(diariaRequestDto, servico);
    this.validarPrecoAtendimento(diariaRequestDto, servico);
    await this.validarCep(diariaRequestDto);
    await this.validarIbge(diariaRequestDto);
    await this.validarDisponibilidade(diariaRequestDto);
  }

  private validarDataDiaria(diariaRequestDto: DiariaRequestDto) {
    const horasMinimasAtendimento = 48;
    const dataAtendimento = new Date(diariaRequestDto.dataAtendimento);
    const dataAgora = new Date(Date.now());
    const diferencaDatas = dataAtendimento.getTime() - dataAgora.getTime();

    const diferencaHoras = diferencaDatas / (1000 * 60 * 60);

    if (diferencaHoras < horasMinimasAtendimento) {
      throw new BadRequestException(
        'Data de atendimento deve ter pelo menos 48h a partir da data atual',
      );
    }
  }

  validarDiariaCancelamento(diaria: Diaria) {
    this.validarStatus(diaria);
    this.validarDataAtendimento(diaria);
  }

  private validarDataAtendimento(diaria: Diaria) {
    const hoje = new Date(Date.now());
    const dataAtendimento = diaria.dataAtendimento;

    if (hoje > dataAtendimento) {
      throw new BadRequestException({
        diaria:
          'Não é mais possível cancelar a diária, diária ultrapassou a data de atendimento',
      });
    }
  }

  private validarStatus(diaria: Diaria) {
    const status = !(
      diaria.status === DiariaStatus.PAGO ||
      diaria.status === DiariaStatus.CONFIRMADO
    );

    if (status) {
      throw new BadRequestException({
        diaria:
          'Diária a ser cancelada deve estar com o status pago ou confirmado',
      });
    }
  }

  private async validarDisponibilidade(diariaRequestDto: DiariaRequestDto) {
    const codigoIbge = diariaRequestDto.codigoIbge;
    const disponibilidade =
      await this.diariastaRepository.repository.existsByCidadesAtendidasCodigoIbge(
        codigoIbge,
      );

    if (disponibilidade === false) {
      throw new BadRequestException(
        'Não há diaristas disponíveis para este CEP',
      );
    }
  }

  private async validarIbge(diariaRequestDto: DiariaRequestDto) {
    const cep = diariaRequestDto.cep;
    const codigoIbge = diariaRequestDto.codigoIbge;

    const condigoIbgeValido = (
      await this.validatorCep.buscarEnderecoPorCep(cep)
    ).ibge;

    if (codigoIbge !== condigoIbgeValido) {
      throw new BadRequestException('Código Ibge Inválido');
    }
  }

  private async validarCep(diariaRequestDto: DiariaRequestDto) {
    const cep = diariaRequestDto.cep;

    try {
      await this.validatorCep.buscarEnderecoPorCep(cep);
    } catch (error) {
      throw new BadRequestException('Cep Inválido');
    }
  }

  private validarPrecoAtendimento(
    diariaRequestDto: DiariaRequestDto,
    servico: Servico,
  ) {
    const preco = diariaRequestDto.preco * 100;
    const valorTotal = this.calcularValorTotal(diariaRequestDto, servico);

    if (valorTotal != preco) {
      throw new BadRequestException('Preço Inválido');
    }
  }
  private calcularValorTotal(
    diariaRequestDto: DiariaRequestDto,
    servico: Servico,
  ) {
    let valorTotal = 0;

    valorTotal += diariaRequestDto.quantidadeBanheiros * servico.valorBanheiro;
    valorTotal += diariaRequestDto.quantidadeCozinhas * servico.valorCozinha;
    valorTotal += diariaRequestDto.quantidadeOutros * servico.valorOutros;
    valorTotal += diariaRequestDto.quantidadeQuartos * servico.valorQuarto;
    valorTotal += diariaRequestDto.quantidadeQuintais * servico.valorQuintal;
    valorTotal += diariaRequestDto.quantidadeSalas * servico.valorSala;

    if (valorTotal < servico.valorMinimo) {
      return servico.valorMinimo;
    }

    return valorTotal;
  }

  private validarTempoAtendimento(
    diariaRequestDto: DiariaRequestDto,
    servico: Servico,
  ) {
    const tempoAtendimento = diariaRequestDto.tempoAtendimento;
    const tempoTotal = this.calcularTempoTotal(diariaRequestDto, servico);
    if (tempoAtendimento != tempoTotal) {
      throw new BadRequestException('Tempo de atendimento inválido');
    }
  }

  private calcularTempoTotal(
    diariaRequestDto: DiariaRequestDto,
    servico: Servico,
  ): number {
    let tempoTotal = 0;
    tempoTotal += diariaRequestDto.quantidadeBanheiros * servico.horasBanheiro;
    tempoTotal += diariaRequestDto.quantidadeCozinhas * servico.horasCozinha;
    tempoTotal += diariaRequestDto.quantidadeOutros * servico.horasOutros;
    tempoTotal += diariaRequestDto.quantidadeQuartos * servico.horasQuarto;
    tempoTotal += diariaRequestDto.quantidadeQuintais * servico.horasQuintal;
    tempoTotal += diariaRequestDto.quantidadeSalas * servico.horasSala;
    return tempoTotal;
  }

  private validarHoraAtendimento(
    diariaRequestDto: DiariaRequestDto,
    horaLimiteAtendimento: number,
  ) {
    const horaAtendimento = new Date(
      diariaRequestDto.dataAtendimento,
    ).getHours();

    const tempoAtendimento = diariaRequestDto.tempoAtendimento;

    if (horaAtendimento + tempoAtendimento > horaLimiteAtendimento) {
      throw new BadRequestException(
        `Horário de atendimento máximo é até as ${horaLimiteAtendimento}:00`,
      );
    }
  }
}