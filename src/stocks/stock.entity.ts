import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { StockType } from './stock-type.enum';
import { Hst } from './hst.entity';
import { Top } from './top.entity';

@Entity()
@Unique(['number'])
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string; // TODO: new entity - StockCategory

  @Column({ nullable: true })
  type?: StockType;

  @Column({ nullable: true })
  capital?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  dateOfListing?: Date;

  @Column({ type: 'date', nullable: true })
  dateOfEstablishing?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    (type) => Hst,
    (hst) => hst.stock,
    { eager: false, cascade: true },
  )
  hst?: Hst[];

  @OneToMany(
    (type) => Top,
    (top) => top.stock,
    { eager: false, cascade: true },
  )
  top?: Top[];
}
