import { Expose } from 'class-transformer';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CidadesAtendidas {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  @Expose({ name: 'codigo_ibge ' })
  codigoIbge: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false })
  estado: string;

  @ManyToMany(() => UsuarioApi)
  usuarios: UsuarioApi[];
}
