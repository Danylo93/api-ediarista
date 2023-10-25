import { Expose } from 'class-transformer';
import { ClienteResponseDto } from 'src/api/clientes/dto/cliente-response.dto';
import { DiaristaDiariaResponseDto } from 'src/api/diaristas/dto/diarista-diaria.dto';
import { HateoasLinks } from 'src/core/hateoas/hateoas.interface';

export class DiariaResponseDto {
  id: number;

  status: number;

  @Expose({ name: 'data_atendimento' })
  dataAtendimento: Date;

  @Expose({ name: 'tempo_atendimento' })
  tempoAtendimento: number;

  @Expose({ name: 'valor_comissao' })
  valorComissao: number;

  complemento: string;

  preco: number;

  logradouro: string;

  numero: number;

  bairro: string;

  cidade: string;

  estado: string;

  cep: string;

  @Expose({ name: 'codigo_ibge' })
  codigoIbge: string;

  @Expose({ name: 'quantidade_quartos' })
  quantidadeQuartos: number;

  @Expose({ name: 'quantidade_salas' })
  quantidadeSalas: number;

  @Expose({ name: 'quantidade_cozinhas' })
  quantidadeCozinhas: number;

  @Expose({ name: 'quantidade_banheiros' })
  quantidadeBanheiros: number;

  @Expose({ name: 'quantidade_quintais' })
  quantidadeQuintais: number;

  @Expose({ name: 'quantidade_outros' })
  quantidadeOutros: number;

  observacoes: string;

  @Expose({ name: 'motivo_cancelamento' })
  motivoCancelamento: string;

  servico: number;

  @Expose({ name: 'nome_servico' })
  nomeServico: string;

  cliente: ClienteResponseDto;

  diarista: DiaristaDiariaResponseDto;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  links: HateoasLinks[];
}
