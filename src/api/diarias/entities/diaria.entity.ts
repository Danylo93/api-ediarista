import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Servico } from 'src/api/servicos/entities/servico.entity';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';

@Entity()
export class Diaria {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  dataAtendimento: Date;

  @Column({ nullable: false })
  tempoAtendimento: number;

  @Column({ nullable: false })
  status: number;

  @Column({ nullable: false })
  preco: number;

  @Column({ nullable: false })
  valorComissao: number;

  @Column({ nullable: false })
  logradouro: string;

  @Column({ nullable: false })
  numero: number;

  @Column({ nullable: false })
  bairro: string;

  @Column({ nullable: true })
  complemento: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false })
  estado: string;

  @Column({ nullable: false })
  cep: string;

  @Column({ nullable: false })
  codigoIbge: string;

  @Column({ nullable: false })
  quantidadeQuartos: number;

  @Column({ nullable: false })
  quantidadeSalas: number;

  @Column({ nullable: false })
  quantidadeCozinhas: number;

  @Column({ nullable: false })
  quantidadeBanheiros: number;

  @Column({ nullable: false })
  quantidadeQuintais: number;

  @Column({ nullable: false })
  quantidadeOutros: number;

  @Column({ nullable: true })
  observacoes: string;

  @Column({ nullable: true })
  motivoCancelamento: string;

  @ManyToOne(() => UsuarioApi, (cliente) => cliente.id, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'cliente_id' })
  cliente: UsuarioApi;

  @ManyToOne(() => UsuarioApi, (diarista) => diarista.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'diarista_id' })
  diarista: UsuarioApi;

  @ManyToOne(() => Servico, (servico) => servico.id, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'servico_id' })
  servico: Servico;

  @ManyToMany(() => UsuarioApi, (diarista) => diarista.id, {
    nullable: true,
    eager: true,
  })
  @JoinTable({ name: 'diaria_candidato' })
  candidatos: UsuarioApi[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
