import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EnderecoDiarista {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, length: 60 })
  logradouro: string;

  @Column({ nullable: false, length: 10 })
  numero: string;

  @Column({ nullable: false, length: 30 })
  bairro: string;

  @Column({ nullable: true })
  complemento: string;

  @Column({ nullable: false, length: 8 })
  cep: string;

  @Column({ nullable: false, length: 30 })
  cidade: string;

  @Column({ nullable: false, length: 2 })
  estado: string;
}
