import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface AdminProduct {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    sellingPrice?: number;
    mrp?: number;
    discountPercent?: number;
    isOfferActive?: boolean;
    offerLabel?: string;
    category: string;
    description: string;
    images: string[];
    stock: number;
    tags?: string[];
    isActive: boolean;
    soldCount?: number;
}

export interface AdminOrder {
    _id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalPrice: number;
    products: Array<{ name: string; quantity: number; price: number; size?: string }>;
    deliveryAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
    };
    createdAt: string;
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Attach admin token from localStorage on every request
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message =
            error.response?.data?.message ||
            error.message ||
            'Something went wrong';
        // Always log full details so failures are visible in the browser console
        console.error('API Error:', {
            status,
            message,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
        });
        if (status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─── API Methods ──────────────────────────────────────────────────────────────

export const adminAPI = {
    login: (data: { email: string; password: string }) => api.post('/api/admin/auth/login', data),
    register: (data: { name: string; email: string; password: string; adminCode: string }) => api.post('/api/admin/auth/signup', data),
    getStats: () => api.get('/api/admin/dashboard'), // Fixed: was /api/admin/stats

    // Products
    getProducts: (params?: Record<string, unknown>) => api.get('/api/admin/products', { params }),
    createProduct: (data: FormData) => api.post('/api/admin/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateProduct: (id: string, data: FormData | Record<string, unknown>) => api.put(`/api/admin/products/${id}`, data),
    deleteProduct: (id: string) => api.delete(`/api/admin/products/${id}`),
    addVariant: (id: string, data: { size: string; stock: number }) => api.post(`/api/admin/products/${id}/variants`, data),
    updateProductOffer: (id: string, data: { mrp: number; discountPercent: number; isOfferActive: boolean; offerLabel?: string }) =>
        api.patch(`/api/admin/products/${id}/offer`, data),

    // Orders
    getOrders: (params?: Record<string, unknown>) => api.get('/api/admin/orders', { params }),
    updateOrderStatus: (id: string, data: { status: string }) => api.put(`/api/admin/orders/${id}/status`, data),

    // Hero & Ticker
    getHero: () => api.get('/api/hero'),
    addHero: (data: FormData) => api.post('/api/admin/hero', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteHero: (id: string) => api.delete(`/api/admin/hero/${id}`),

    getTicker: () => api.get('/api/ticker'),
    addTicker: (data: { text: string; displayOrder?: number }) => api.post('/api/admin/ticker', data),
    deleteTicker: (id: string) => api.delete(`/api/admin/ticker/${id}`),

    // Settings
    getSettings: () => api.get('/api/settings'),
    updateSettings: (data: Record<string, unknown>) => api.put('/api/admin/settings', data),

    // Coupons
    getCoupons: () => api.get('/api/admin/coupons'),
    createCoupon: (data: Record<string, unknown>) => api.post('/api/admin/coupons', data),
    deleteCoupon: (id: string) => api.delete(`/api/admin/coupons/${id}`),

    // Users
    getUsers: () => api.get('/api/admin/users'),
};

export default api;
