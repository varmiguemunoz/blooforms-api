import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentTypes {
  @Exclude()
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'dim_payment_types_pkey',
  })
  id: number;

  @Column()
  name: string;

  constructor(partial: Partial<PaymentTypes>) {
    Object.assign(this, partial);
  }
}
