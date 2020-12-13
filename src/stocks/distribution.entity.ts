import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from './stock.entity';

@Entity()
@Unique(['stock', 'date'])
export class Distribution extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Stock, (stock) => stock.distribution, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_id', referencedColumnName: 'id' })
  stock: Stock;

  @Column()
  stockId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  lessThan50: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
