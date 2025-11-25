import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id_producto: 1,
    nombre: 'Laptop',
    descripcion: 'High performance',
    precio: 1000,
    stock: 5,
    activo: true,
    id_categoria: 1,
    categoria: { id_categoria: 1, nombre: 'Electronics' },
  };

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue({ message: 'Product deleted' }),
    buyProduct: jest.fn().mockResolvedValue(mockProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = {
        name: 'Laptop',
        description: 'High performance',
        price: 1000,
        stock: 5,
        active: true,
        category: { name: 'Electronics' },
      };

      const result = await controller.create(dto);

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await controller.findOne(1);

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated Laptop',
        price: 1200,
      };

      const result = await controller.update(1, dto);

      expect(result).toEqual(mockProduct);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      const result = await controller.remove(1);

      expect(result.message).toEqual('Product deleted');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('buyProduct', () => {
    it('should handle product purchase', async () => {
      const result = await controller.buyProduct(1, { quantity: 2 });

      expect(result).toEqual(mockProduct);
      expect(service.buyProduct).toHaveBeenCalledWith(1, { quantity: 2 });
    });
  });
});
