import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DimFormularios {
  @Exclude()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'dim_formularios_pkey' })
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255 })
  form_name: string;

  @Column({ length: 255 })
  form_value: string;

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
