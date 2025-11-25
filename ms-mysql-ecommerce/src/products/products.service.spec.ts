import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepository: any;
  let mockCategoryRepository: any;

  const mockCategory = {
    id_categoria: 1,
    nombre: 'Electronics',
    productos: [],
  };

  const mockProduct = {
    id_producto: 1,
    nombre: 'Laptop',
    descripcion: 'High performance',
    precio: 1000,
    stock: 5,
    activo: true,
    id_categoria: 1,
    categoria: mockCategory,
  };

  beforeEach(async () => {
    mockProductRepository = {
      create: jest.fn().mockReturnValue(mockProduct),
      save: jest.fn().mockResolvedValue(mockProduct),
      find: jest.fn().mockResolvedValue([mockProduct]),
      findOne: jest.fn().mockResolvedValue(mockProduct),
      remove: jest.fn().mockResolvedValue(mockProduct),
    };

    mockCategoryRepository = {
      findOne: jest.fn().mockResolvedValue(mockCategory),
      create: jest.fn().mockReturnValue(mockCategory),
      save: jest.fn().mockResolvedValue(mockCategory),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id_producto: 1 },
        relations: ['categoria'],
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('buyProduct', () => {
    it('should decrease stock when buying', async () => {
      const product = { ...mockProduct, stock: 5 };
      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await service.buyProduct(1, { quantity: 2 });

      expect(result.stock).toBe(3);
      expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const product = { ...mockProduct, stock: 2 };
      mockProductRepository.findOne.mockResolvedValue(product);

      await expect(service.buyProduct(1, { quantity: 5 })).rejects.toThrow(BadRequestException);
    });

    it('should mark product as inactive when stock reaches 0', async () => {
      const product = { ...mockProduct, stock: 2, activo: true };
      mockProductRepository.findOne.mockResolvedValue(product);

      await service.buyProduct(1, { quantity: 2 });

      expect(product.activo).toBe(false);
    });
  });
});
