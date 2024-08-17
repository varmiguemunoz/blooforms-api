import {
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

import { DimUsuarios } from './users.entity';
import { Exclude } from 'class-transformer';
import { Roles } from './roles.entity';

@Entity()
export class FacUsers {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'fac_usuarios_pkey1' })
  id: number;

  @OneToOne(() => DimUsuarios, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_usuario',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_usuarios_id_usuario_fkey',
  })
  usuario: DimUsuarios;

  @OneToOne(() => Roles, { nullable: false, cascade: true })
  @JoinColumn({
    name: 'id_rol',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_usuarios_id_rol_fkey',
  })
  role: Roles;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
