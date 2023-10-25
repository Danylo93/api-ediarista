import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('foto')
export class Foto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, unique: true })
  @Expose({ name: 'file_name' })
  fileName: string;

  @Column({ nullable: false })
  @Expose({ name: 'content_lenght' })
  contentLength: number;

  @Column({ nullable: false })
  @Expose({ name: 'content_type' })
  contentType: string;

  @Column({ nullable: false })
  url: string;
}
