// API configuration - centralized for easy management
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_URL,
  endpoints: {
    products: {
      list: '/products',
      get: (id: string) => `/products/${id}`,
      create: '/products',
      update: (id: string) => `/products/${id}`,
      delete: (id: string) => `/products/${id}`,
      buy: (id: string) => `/products/${id}/buy`,
    },
  },
};

export default API_URL;
