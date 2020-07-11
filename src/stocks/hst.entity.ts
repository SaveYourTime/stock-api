import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity()
@Unique(['stock', 'date'])
export class Hst extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => Stock,
    (stock) => stock.hst, // TODO: hst or id?
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'stock_id', referencedColumnName: 'id' })
  stock: Stock;

  @Column()
  stockId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  closingPrice: number;

  @Column({ type: 'float' })
  highest: number;

  @Column({ type: 'float' })
  lowest: number;

  @Column({ type: 'float' })
  priceChangeRatio: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
