// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Definición del esquema de la Categoría Incrustada
class Category {
  @Prop({ required: true })
  name: string;
}

@Schema({ timestamps: true }) // Añade campos 'createdAt' y 'updatedAt' automáticamente
export class Product extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  price: number; // Usamos Number en TypeScript/Mongoose, no DECIMAL

  @Prop({ required: true, type: Number, default: 0 })
  stock: number;

  @Prop({ default: true })
  active: boolean;

  // INCORPORACIÓN DE LA CATEGORÍA:
  // En lugar de una FK, incrustamos el objeto Category o solo su ID (referencia).
  // Aquí optamos por incrustar el nombre y mantener una referencia al ID si se necesitara una colección CATEGORIA maestra.
  @Prop({ type: Category, required: true })
  category: Category;

  // Si decides mantener la Categoría como una colección separada (para gestión centralizada):
  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  // categoryId: MongooseSchema.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);