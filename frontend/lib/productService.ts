import axios from 'axios';
import { apiConfig } from './apiConfig';

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  active: boolean;
  category: {
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BuyProductPayload {
  quantity: number;
}

export const productService = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get(apiConfig.endpoints.products.list);
    return response.data;
  },

  // Get a single product
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(apiConfig.endpoints.products.get(id));
    return response.data;
  },

  // Create a new product
  create: async (product: Omit<Product, '_id'>): Promise<Product> => {
    const response = await apiClient.post(apiConfig.endpoints.products.create, product);
    return response.data;
  },

  // Update a product
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch(apiConfig.endpoints.products.update(id), product);
    return response.data;
  },

  // Delete a product
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(apiConfig.endpoints.products.delete(id));
    return response.data;
  },

  // Buy a product
  buy: async (id: string, quantity: number): Promise<Product> => {
    const response = await apiClient.post(apiConfig.endpoints.products.buy(id), { quantity });
    return response.data;
  },
};
