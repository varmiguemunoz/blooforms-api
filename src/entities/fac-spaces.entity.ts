import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Events } from './events.entity';
import { Exclude } from 'class-transformer';
import { DimUsuarios } from './users.entity';
import { SpaceTypes } from './space_types.entity';
import { Customers } from './customers.entity';

@Entity()
export class FacSpaces {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'fac_espacios_pkey1' })
  id: number;

  @Column()
  titulo: string;

  @OneToOne(() => DimUsuarios, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_usuario',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_usuarios_id_usuario_fkey',
  })
  user: DimUsuarios;

  @OneToOne(() => SpaceTypes, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_space_type',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_spaces_id_type_fkey',
  })
  space_type: SpaceTypes;

  @OneToMany(() => Events, (event) => event.formulario)
  @JoinColumn({
    name: 'id_formularios',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_spaces_id_formularios_fkey',
  })
  formulario: Events[];

  @OneToMany(() => Customers, (event) => event.customers)
  @JoinColumn({
    name: 'id_customers',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_spaces_id_customers_fkey',
  })
  customers: Customers[];

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
