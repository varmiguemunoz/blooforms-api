import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { DimFormularios } from './dim-formularios.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class FacEspacios {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'fac_espacios_pkey1' })
  id: number;

  @Column()
  titulo: string;

  @OneToMany(
    () => DimFormularios,
    (dimFormulario) => dimFormulario.facEspacio,
    { cascade: true },
  )
  @JoinColumn({
    name: 'dim_formularios',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'dim_formularios_fkey',
  })
  formulario: DimFormularios[];

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
