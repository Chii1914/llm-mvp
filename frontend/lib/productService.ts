import axios from 'axios';
import { apiConfig, getApiUrl } from './apiConfig';

// Create axios instance with default base URL
export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create a client with dynamic base URL
export const createApiClient = (selectedDB: 'nosql' | 'mysql' | null) => {
  const baseURL = getApiUrl(selectedDB);
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export interface Product {
  _id?: string;
  id_producto?: number;
  nombre?: string;
  name?: string;
  descripcion?: string;
  description?: string;
  precio?: number;
  price?: number;
  stock: number;
  activo?: boolean;
  active?: boolean;
  category?: {
    name: string;
  };
  categoria?: {
    nombre: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BuyProductPayload {
  quantity: number;
}

// Helper function to normalize product data (MongoDB vs MySQL)
const normalizeProduct = (product: any): Product => {
  return {
    _id: product._id || product.id_producto?.toString(),
    id_producto: product.id_producto,
    name: product.name || product.nombre,
    nombre: product.nombre || product.name,
    description: product.description || product.descripcion,
    descripcion: product.descripcion || product.description,
    price: product.price || product.precio,
    precio: product.precio || product.price,
    stock: product.stock,
    active: product.active !== undefined ? product.active : product.activo,
    activo: product.activo !== undefined ? product.activo : product.active,
    category: product.category || (product.categoria ? { name: product.categoria.nombre } : undefined),
    categoria: product.categoria,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const productService = {
  // Get all products
  getAll: async (selectedDB?: 'nosql' | 'mysql' | null): Promise<Product[]> => {
    const client = createApiClient(selectedDB || null);
    const response = await client.get(apiConfig.endpoints.products.list);
    return response.data.map(normalizeProduct);
  },

  // Get a single product
  getById: async (id: string, selectedDB?: 'nosql' | 'mysql' | null): Promise<Product> => {
    const client = createApiClient(selectedDB || null);
    const response = await client.get(apiConfig.endpoints.products.get(id));
    return normalizeProduct(response.data);
  },

  // Create a new product
  create: async (product: Omit<Product, '_id' | 'id_producto'>, selectedDB?: 'nosql' | 'mysql' | null): Promise<Product> => {
    const client = createApiClient(selectedDB || null);
    const payload = {
      name: product.name || product.nombre,
      description: product.description || product.descripcion,
      price: product.price || product.precio,
      stock: product.stock,
      active: product.active !== undefined ? product.active : true,
      category: product.category || (product.categoria ? { name: product.categoria.nombre } : undefined),
    };
    const response = await client.post(apiConfig.endpoints.products.create, payload);
    return normalizeProduct(response.data);
  },

  // Update a product
  update: async (id: string | number, product: Partial<Product>, selectedDB?: 'nosql' | 'mysql' | null): Promise<Product> => {
    const client = createApiClient(selectedDB || null);
    const payload: any = {};
    if (product.name !== undefined && product.name !== '') payload.name = product.name;
    if (product.nombre !== undefined && product.nombre !== '') payload.name = product.nombre;
    if (product.description !== undefined) payload.description = product.description;
    if (product.descripcion !== undefined) payload.description = product.descripcion;
    if (product.price !== undefined && product.price > 0) payload.price = product.price;
    if (product.precio !== undefined && product.precio > 0) payload.price = product.precio;
    if (product.stock !== undefined) payload.stock = product.stock;
    if (product.active !== undefined) payload.active = product.active;
    if (product.activo !== undefined) payload.active = product.activo;
    if (product.category) payload.category = product.category;
    
    const response = await client.patch(apiConfig.endpoints.products.update(String(id)), payload);
    return normalizeProduct(response.data);
  },

  // Delete a product
  delete: async (id: string, selectedDB?: 'nosql' | 'mysql' | null): Promise<{ message: string }> => {
    const client = createApiClient(selectedDB || null);
    const response = await client.delete(apiConfig.endpoints.products.delete(id));
    return response.data;
  },

  // Buy a product
  buy: async (id: string, quantity: number, selectedDB?: 'nosql' | 'mysql' | null): Promise<Product> => {
    const client = createApiClient(selectedDB || null);
    const response = await client.post(apiConfig.endpoints.products.buy(id), { quantity });
    return normalizeProduct(response.data);
  },
};

