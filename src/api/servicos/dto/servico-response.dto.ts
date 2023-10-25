import { Expose } from 'class-transformer';

export class ServicoResponse {
  id: number;

  nome: string;

  @Expose({ name: 'valor_minimo' })
  valorMinimo: string;

  @Expose({ name: 'qtd_horas' })
  quantidadeHoras: number;

  @Expose({ name: 'porcentagem_comissao' })
  porcentagem: number;

  @Expose({ name: 'valor_quarto' })
  valorQuarto: string;

  @Expose({ name: 'horas_quarto' })
  horasQuarto: number;

  @Expose({ name: 'valor_sala' })
  valorSala: string;

  @Expose({ name: 'horas_sala' })
  horasSala: number;

  @Expose({ name: 'valor_banheiro' })
  valorBanheiro: string;

  @Expose({ name: 'horas_banheiro' })
  horasBanheiro: number;

  @Expose({ name: 'valor_cozinha' })
  valorCozinha: string;

  @Expose({ name: 'horas_cozinha' })
  horasCozinha: number;

  @Expose({ name: 'valor_quintal' })
  valorQuintal: string;

  @Expose({ name: 'horas_quintal' })
  horasQuintal: number;

  @Expose({ name: 'valor_outros' })
  valorOutros: string;

  @Expose({ name: 'horas_outros' })
  horasOutros: number;

  icone: string;

  posicao: number;
}