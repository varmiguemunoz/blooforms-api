import {
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

import { Users } from './users.entity';
import { Exclude } from 'class-transformer';
import { Roles } from './roles.entity';

@Entity()
export class FacUsers {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'fac_users_pkey1' })
  id: number;

  @OneToOne(() => Users, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_users',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_users_id_usuario_fkey',
  })
  usuario: Users;

  @OneToOne(() => Roles, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_rol',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_users_id_rol_fkey',
  })
  role: Roles;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
