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
import { FacSpaces } from './fac-spaces.entity';

@Entity()
export class Events {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'dim_events_pkey' })
  id: number;

  @Column({ length: 255 })
  form_name: string;

  @Column({ length: 255 })
  form_value: string;

  @ManyToOne(() => FacSpaces, (formulario) => formulario.formulario)
  @JoinColumn({
    name: 'id_spaces',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'id_spaces_fkey',
  })
  formulario: FacSpaces;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<Events>) {
    Object.assign(this, partial);
  }
}
