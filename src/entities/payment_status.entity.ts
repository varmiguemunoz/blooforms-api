import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentStatus {
  @Exclude()
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'dim_payment_status_pkey',
  })
  id: number;

  @Column()
  name: string;

  constructor(partial: Partial<PaymentStatus>) {
    Object.assign(this, partial);
  }
}
