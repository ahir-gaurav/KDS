import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use((config) => {
    return config;
});

// Response interceptor – handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

// Products
export const productAPI = {
    getAll: (params?: any) => api.get('/api/products', { params }),
    getBestSellers: () => api.get('/api/products/best-sellers'),
    getCategories: () => api.get('/api/products/categories'),
    getOne: (id: string) => api.get(`/api/products/${id}`),
};

// Orders
export const orderAPI = {
    create: (data: any) => api.post('/api/orders', data),
    getMyOrders: () => api.get('/api/orders/my'),
    getOne: (id: string) => api.get(`/api/orders/${id}`),
};

// Payment
export const paymentAPI = {
    verify: (data: any) => api.post('/api/payment/verify', data),
};

// Coupons
export const couponAPI = {
    validate: (data: any) => api.post('/api/coupons/validate', data),
};

// User
export const userAPI = {
    getProfile: () => api.get('/api/user/profile'),
    updateProfile: (data: any) => api.put('/api/user/profile', data),
    addAddress: (data: any) => api.post('/api/user/addresses', data),
    updateAddress: (id: string, data: any) => api.put(`/api/user/addresses/${id}`, data),
    deleteAddress: (id: string) => api.delete(`/api/user/addresses/${id}`),
};

// Public
export const publicAPI = {
    getHero: () => api.get('/api/hero'),
    getTicker: () => api.get('/api/ticker'),
    getSettings: () => api.get('/api/settings'),
};

export default api;
