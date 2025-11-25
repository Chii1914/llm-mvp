import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('producto')
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'id_producto' })
  id_producto: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'id_categoria', nullable: true })
  id_categoria?: number;

  @ManyToOne(() => Category, (category) => category.productos, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_categoria' })
  categoria?: Category;
}
