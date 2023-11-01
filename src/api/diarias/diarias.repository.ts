import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from '../avaliacoes/entities/avaliacao.entity';
import { Servico } from '../servicos/entities/servico.entity';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { DiariaRequestDto } from './dto/diaria-request.dto';
import { Diaria } from './entities/diaria.entity';
import DiariaStatus from './enum/diaria-status.enum';

export class DiariaRepository {
  constructor(
    @InjectRepository(Diaria)
    private diariaRepository: Repository<Diaria>,
  ) {}
  repository = this.diariaRepository.extend({
    async createDiaria(diariaRequest: DiariaRequestDto, servico: Servico) {
      const {
        dataAtendimento,
        tempoAtendimento,
        preco,
        logradouro,
        numero,
        bairro,
        complemento,
        cep,
        estado,
        cidade,
        quantidadeBanheiros,
        quantidadeCozinhas,
        quantidadeOutros,
        quantidadeQuartos,
        quantidadeQuintais,
        quantidadeSalas,
        observacoes,
        valorComissao,
        motivoCancelamento,
        cliente,
        codigoIbge,
        status,
      } = diariaRequest;

      const diaria = this.create({
        dataAtendimento,
        tempoAtendimento,
        preco: preco * 100,
        logradouro,
        numero,
        bairro,
        complemento,
        cep,
        estado,
        quantidadeBanheiros,
        quantidadeCozinhas,
        quantidadeOutros,
        quantidadeQuartos,
        quantidadeQuintais,
        quantidadeSalas,
        observacoes,
        valorComissao: valorComissao * 100,
        motivoCancelamento,
        cliente,
        codigoIbge,
        status,
        servico,
        cidade,
      });
      await this.save(diaria);
      return diaria;
    },
    async findByCliente(cliente: UsuarioApi): Promise<Diaria[]> {
      return await this.find({
        where: {
          cliente: {
            id: cliente.id,
          },
        },
      });
    },
    async findByDiarista(diarista: UsuarioApi): Promise<Diaria[]> {
      return await this.find({
        where: {
          diarista: {
            id: diarista.id,
          },
        },
      });
    },

    async findOportunidades(
      cidades: string[],
      usuarioLogado: UsuarioApi,
    ): Promise<Diaria[]> {
      const diariasSql = await this.manager.query(
        `select * from diaria where status = ${DiariaStatus.PAGO}
        and codigo_ibge IN (${cidades})
        and (select count(*)
        from diaria_candidatos
        where diaria.id = diaria_candidatos.diaria_id) < 4
        and not exists (select * from diaria_candidatos
        where diaria.id = diaria_candidatos.diaria_id
        and usuario_api_id = ${usuarioLogado.id})`,
      );

      console.log(cidades);

      const ids = diariasSql.map((diaria) => diaria.id);

      if (ids.length === 0) {
        throw new NotFoundException('Não há diárias disponíveis');
      }

      const diarias = await this.createQueryBuilder('diaria')
        .select('diaria')
        .leftJoinAndSelect('diaria.cliente', 'cliente')
        .leftJoinAndSelect('diaria.candidatos', 'candidatos')
        .leftJoinAndSelect('diaria.servico', 'service')
        .leftJoinAndSelect('diaria.diarista', 'diarista')
        .where('diaria.id IN(:id)', { id: ids })
        .andWhere('diaria.diarista IS NULL')
        .getMany();

      return diarias;
    },

    async getAptasParaSelecaoDiarista(): Promise<Diaria[]> {
      const diaria = await this.createQueryBuilder('diaria')
        .select('diaria')
        .leftJoinAndSelect('diaria.candidatos', 'candidatos')
        .leftJoinAndSelect('candidatos.endereco', 'endereco')
        .where('diaria.status = :status', { status: DiariaStatus.PAGO })
        .andWhere('diaria.diarista IS NULL')
        .andWhere('usuario_api_id IS NOT NULL')
        .andWhere('diaria.created_at + interval 1 day < now()')
        .getMany();

      return diaria;
    },

    async getAptasParaCancelamento(): Promise<Diaria[]> {
      const diariasSemCandidatoPaga = await this.createQueryBuilder('diaria')
        .select('diaria')
        .leftJoinAndSelect('diaria.candidatos', 'candidatos')
        .where('usuario_api_id IS NULL')
        .andWhere('diaria.status = :status', { status: DiariaStatus.PAGO })
        .andWhere('diaria.data_atendimento - interval 1 day < now()')
        .getMany();

      const diariasSemCandidatoSemPagamento = await this.createQueryBuilder(
        'diaria',
      )
        .select('diaria')
        .leftJoinAndSelect('diaria.candidatos', 'candidatos')
        .where('usuario_api_id IS NULL')
        .andWhere('diaria.status = :status', {
          status: DiariaStatus.SEM_PAGAMENTO,
        })
        .andWhere('diaria.created_at + interval 1 day < now()')
        .getMany();

      const diarias = diariasSemCandidatoPaga.concat(
        diariasSemCandidatoSemPagamento,
      );

      return diarias;
    },
  });
}
