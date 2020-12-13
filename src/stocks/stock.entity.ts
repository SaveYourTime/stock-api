import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockType } from './stock-type.enum';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { Hst } from './hst.entity';
import { Top } from './top.entity';
import { Distribution } from './distribution.entity';

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
  companyName?: string;

  @ManyToOne((type) => Category, (category) => category.stock, {
    eager: true,
    cascade: true,
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne((type) => Subcategory, (subcategory) => subcategory.stock, {
    eager: true,
    cascade: true,
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'subcategory_id', referencedColumnName: 'id' })
  subcategory?: Subcategory;

  @Column({ nullable: true })
  subcategoryId?: number;

  @Column({ nullable: true })
  type?: StockType;

  @Column({ nullable: true })
  capital?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date', nullable: true })
  dateOfListing?: Date;

  @Column({ type: 'date', nullable: true })
  dateOfEstablishing?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany((type) => Hst, (hst) => hst.stock, { eager: true, cascade: true })
  hst?: Hst[];

  @OneToMany((type) => Top, (top) => top.stock, { eager: true, cascade: true })
  top?: Top[];

  @OneToMany((type) => Distribution, (distribution) => distribution.stock, {
    eager: true,
    cascade: true,
  })
  distribution?: Distribution[];
}
