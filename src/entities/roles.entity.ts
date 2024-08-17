import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Roles {
  @Exclude()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'dim_roles_pkey' })
  id: number;

  @Column()
  name: string;

  constructor(partial: Partial<Roles>) {
    Object.assign(this, partial);
  }
}
