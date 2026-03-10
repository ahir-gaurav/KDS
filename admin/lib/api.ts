import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for Admin Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const adminAPI = {
    login: (data: any) => api.post('/api/admin/login', data),
    register: (data: any) => api.post('/api/admin/auth/signup', data),
    getStats: () => api.get('/api/admin/stats'),

    // Products
    getProducts: (params?: any) => api.get('/api/admin/products', { params }),
    createProduct: (data: FormData) => api.post('/api/admin/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateProduct: (id: string, data: any) => api.put(`/api/admin/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/api/admin/products/${id}`),
    addVariant: (id: string, data: any) => api.post(`/api/admin/products/${id}/variants`, data),
    updateProductOffer: (id: string, data: any) => api.patch(`/api/admin/products/${id}/offer`, data),

    // Orders
    getOrders: (params?: any) => api.get('/api/admin/orders', { params }),
    updateOrderStatus: (id: string, data: any) => api.put(`/api/admin/orders/${id}/status`, data),

    // Hero & Ticker
    getHero: () => api.get('/api/hero'),
    addHero: (data: FormData) => api.post('/api/admin/hero', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteHero: (id: string) => api.delete(`/api/admin/hero/${id}`),

    getTicker: () => api.get('/api/ticker'),
    addTicker: (data: any) => api.post('/api/admin/ticker', data),
    deleteTicker: (id: string) => api.delete(`/api/admin/ticker/${id}`),

    // Settings
    getSettings: () => api.get('/api/settings'),
    updateSettings: (data: any) => api.put('/api/admin/settings', data),

    // Coupons
    getCoupons: () => api.get('/api/admin/coupons'),
    createCoupon: (data: any) => api.post('/api/admin/coupons', data),
    deleteCoupon: (id: string) => api.delete(`/api/admin/coupons/${id}`),

    // Users
    getUsers: () => api.get('/api/admin/users'),
};

export default api;
