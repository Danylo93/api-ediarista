import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pagamento {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  status: number;

  @Column({ nullable: false })
  valor: number;

  @Column({ name: 'transacao_id', nullable: false })
  transacaoId: string;

  @ManyToOne(() => Diaria, (diaria) => diaria.id, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'diaria_id' })
  diaria: Diaria;

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
