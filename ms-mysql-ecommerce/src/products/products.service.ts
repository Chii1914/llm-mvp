import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BuyProductDto } from './dto/buy-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Find or create category
    let category: Category | undefined;
    if (createProductDto.category?.name) {
      const existing = await this.categoryRepository.findOne({
        where: { nombre: createProductDto.category.name },
      });

      category = existing || (await this.categoryRepository.save({ nombre: createProductDto.category.name }));
    }

    // Create product
    const product = new Product();
    product.nombre = createProductDto.name;
    product.descripcion = createProductDto.description;
    product.precio = createProductDto.price;
    product.stock = createProductDto.stock;
    product.activo = createProductDto.active ?? true;
    product.categoria = category;

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['categoria'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id_producto: id },
      relations: ['categoria'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Update basic fields
    if (updateProductDto.name !== undefined) {
      product.nombre = updateProductDto.name;
    }
    if (updateProductDto.description !== undefined) {
      product.descripcion = updateProductDto.description;
    }
    if (updateProductDto.price !== undefined) {
      product.precio = updateProductDto.price;
    }
    if (updateProductDto.stock !== undefined) {
      product.stock = updateProductDto.stock;
    }
    if (updateProductDto.active !== undefined) {
      product.activo = updateProductDto.active;
    }

    // Update category if provided
    if (updateProductDto.category?.name) {
      const existing = await this.categoryRepository.findOne({
        where: { nombre: updateProductDto.category.name },
      });

      product.categoria = existing || (await this.categoryRepository.save({ nombre: updateProductDto.category.name }));
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: `Product with ID ${id} has been deleted` };
  }

  /**
   * Buy a product endpoint - handles stock management and purchase logic
   * @param id - Product ID
   * @param buyProductDto - Contains quantity to buy
   * @returns Updated product with new stock, or error if insufficient stock
   */
  async buyProduct(id: number, buyProductDto: BuyProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (product.stock < buyProductDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}, Requested: ${buyProductDto.quantity}`,
      );
    }

    // Decrease stock
    product.stock -= buyProductDto.quantity;

    // If stock reaches 0, mark as inactive
    if (product.stock === 0) {
      product.activo = false;
    }

    return this.productRepository.save(product);
  }
}
