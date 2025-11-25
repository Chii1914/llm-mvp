import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categoria')
export class Category {
  @PrimaryGeneratedColumn('increment', { name: 'id_categoria' })
  id_categoria: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @OneToMany(() => Product, (product) => product.categoria)
  productos: Product[];
}
