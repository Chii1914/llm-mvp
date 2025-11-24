export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  active?: boolean;
  category: {
    name: string;
  };
}
