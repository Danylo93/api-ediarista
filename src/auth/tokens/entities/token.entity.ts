import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  token: string;
}
