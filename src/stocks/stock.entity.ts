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

  @Column()
  category: string; // TODO: join table

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
    { eager: false },
  )
  hst?: Hst[];

  @OneToMany(
    (type) => Top,
    (top) => top.stock,
    { eager: false },
  )
  top?: Top[];
}
