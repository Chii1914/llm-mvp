// API configuration - centralized for easy management
const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

export const getApiUrl = (selectedDB: 'nosql' | 'mysql' | null): string => {
  if (selectedDB === 'mysql') {
    return 'http://localhost/api-sql';
  }
  // Default to NoSQL API
  return 'http://localhost/api';
};

export const apiConfig = {
  baseURL: DEFAULT_API_URL,
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

export default DEFAULT_API_URL;
