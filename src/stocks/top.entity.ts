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
export class Top extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => Stock,
    (stock) => stock.top, // TODO: top or id?
    {
      nullable: false,
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'stock_id', referencedColumnName: 'id' })
  stock: Stock;

  @Column()
  stockId: number;

  @Column()
  rank: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  openingPrice: number;

  @Column({ type: 'float' })
  closingPrice: number;

  @Column({ type: 'float' })
  highest: number;

  @Column({ type: 'float' })
  lowest: number;

  @Column({ type: 'float' })
  priceChangeRatio: number;

  @Column()
  totalCost: number;

  @Column()
  totalVolume: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
