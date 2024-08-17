import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SpaceTypes {
  @Exclude()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'dim_space_types_pkey' })
  id: number;

  @Column()
  name: string;

  constructor(partial: Partial<SpaceTypes>) {
    Object.assign(this, partial);
  }
}
