import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentTypes } from './payment_types.entity';
import { PaymentStatus } from './payment_status.entity';
import { Users } from './users.entity';

@Entity()
export class FacPayments {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'fac_payments_pkey1' })
  id: number;

  @Column()
  amount: string;

  @OneToOne(() => PaymentTypes, { cascade: true, nullable: false })
  @JoinColumn({
    name: 'id_payment_type',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_payments_id_payment_type_fkey',
  })
  payment_type: PaymentTypes;

  @OneToOne(() => PaymentStatus, { cascade: true, nullable: false })
  @JoinColumn({
    name: 'id_payment_status',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_payments_id_payment_status_fkey',
  })
  payment_status: PaymentStatus;

  @OneToOne(() => Users, { cascade: true, nullable: false })
  @JoinColumn({
    name: 'id_user',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fac_payments_id_user_fkey',
  })
  user: Users;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}
