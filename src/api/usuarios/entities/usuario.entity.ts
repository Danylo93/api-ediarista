import { Foto } from 'src/api/fotos/entities/foto.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CidadesAtendidas } from 'src/api/cidades-atendidas/entities/cidades-atendida.entity';
import { Exclude } from 'class-transformer';
import { EnderecoDiarista } from 'src/api/endereco-diarista/entities/endereco-diarista.entity';

@Entity()
export class UsuarioApi {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  nomeCompleto: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  senha: string;

  @Column({ nullable: false })
  tipoUsuario: number;

  @Column({ nullable: true, unique: true })
  cpf: string;

  @Column({ nullable: true })
  nascimento: Date;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  reputacao: number;

  @Column({ nullable: true, unique: true })
  chavePix: string;

  @OneToOne(() => Foto, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'foto_usuario' })
  fotoUsuario: Foto;

  @OneToOne(() => Foto, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'foto_documento' })
  fotoDocumento: Foto;

  @ManyToMany(
    () => CidadesAtendidas,
    (cidadesAtendidas) => cidadesAtendidas.usuarios,
    {
      nullable: true,
      eager: true,
    },
  )
  @JoinTable({ name: 'cidades_atendidas_usuarios' })
  cidadesAtendidas: CidadesAtendidas[];

  @OneToOne(() => EnderecoDiarista, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'endereco_id' })
  endereco: EnderecoDiarista;

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
  updateAt: Date;

  @BeforeInsert()
  async setPassword(senha: string) {
    const salt = await bcrypt.genSalt();
    this.senha = await bcrypt.hash(senha || this.senha, salt);
    return this.senha;
  }
}
