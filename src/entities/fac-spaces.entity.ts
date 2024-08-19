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
import { Users } from './users.entity';
import { SpaceTypes } from './space_types.entity';
import { Customers } from './customers.entity';

@Entity()
export class FacSpaces {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'fac_spaces_pkey1' })
  id: number;

  @Column()
  titulo: string;

  @OneToOne(() => Users, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_user',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_users_id_user_fkey',
  })
  user: Users;

  @OneToOne(() => SpaceTypes, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_space_type',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_spaces_id_type_fkey',
  })
  space_type: SpaceTypes;

  @OneToMany(() => Events, (event) => event.formulario)
  @JoinColumn({
    name: 'id_events',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_spaces_id_events_fkey',
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
