import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FacSpaces } from './fac-spaces.entity';

@Entity()
@Unique('dim_customers_email_key', ['email'])
export class Customers {
  @Exclude()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'dim_customers_pkey' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToOne(() => FacSpaces, (clients) => clients.customers)
  @JoinColumn({
    name: 'id_customers',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'id_customers_fkey',
  })
  customers: FacSpaces;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<Customers>) {
    Object.assign(this, partial);
  }
}
