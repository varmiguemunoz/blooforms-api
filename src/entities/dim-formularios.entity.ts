import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FacEspacios } from './fac-espacios.entity';

@Entity()
export class DimFormularios {
  @Exclude()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'dim_formularios_pkey' })
  id: number;

  @Column({ length: 255 })
  form_name: string;

  @Column({ length: 255 })
  form_value: string;

  @ManyToOne(() => FacEspacios, (facEspacio) => facEspacio.formulario)
  @JoinColumn({
    name: 'fac_espacio_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_espacio_fkey',
  })
  facEspacio: FacEspacios;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<DimFormularios>) {
    Object.assign(this, partial);
  }
}
