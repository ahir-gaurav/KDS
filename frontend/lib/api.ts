import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface Product {
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
    description?: string;
    images: string[];
    stock?: number;
    tags?: string[];
    isActive?: boolean;
    soldCount?: number;
    variants?: Array<{ size: string; stock: number; sku: string }>;
}

export interface Address {
    _id?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export interface Order {
    _id: string;
    orderNumber: string;
    status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: 'razorpay' | 'cod';
    totalPrice: number;
    products: Array<{ name: string; quantity: number; price: number; size?: string }>;
    deliveryAddress: Address;
    createdAt: string;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    addresses: Address[];
}

export interface Settings {
    gst: number;
    deliveryCharge: number;
    freeDeliveryThreshold: number;
    storeName?: string;
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach backend JWT stored after Clerk sync
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('backendToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — surface errors as toasts
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
        if (status === 500) {
            toast.error('Server error. Please try again later.');
        } else if (status === 429) {
            toast.error('Too many requests. Please slow down.');
        }
        return Promise.reject(error);
    }
);

// ─── API Methods ──────────────────────────────────────────────────────────────

// Products
export const productAPI = {
    getAll: (params?: { page?: number; sort?: string; category?: string; limit?: number; search?: string }) =>
        api.get('/api/products', { params }),
    getBestSellers: () => api.get('/api/products/best-sellers'),
    getCategories: () => api.get('/api/products/categories'),
    getOne: (id: string) => api.get(`/api/products/${id}`),
};

// Orders
export const orderAPI = {
    create: (data: {
        products: Array<{ productId: string; size: string; quantity: number }>;
        deliveryAddress: Address;
        paymentMethod: string;
        couponCode?: string;
    }) => api.post('/api/orders', data),
    getMyOrders: () => api.get('/api/orders/my'),
    getOne: (id: string) => api.get(`/api/orders/${id}`),
};

// Payment
export const paymentAPI = {
    verify: (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        orderId: string;
    }) => api.post('/api/payment/verify', data),
};

// Coupons
export const couponAPI = {
    validate: (data: { code: string; subtotal: number }) => api.post('/api/coupons/validate', data),
};

// User
export const userAPI = {
    getProfile: () => api.get('/api/user/profile'),
    updateProfile: (data: Partial<{ name: string; email: string }>) => api.put('/api/user/profile', data),
    addAddress: (data: Omit<Address, '_id'>) => api.post('/api/user/addresses', data),
    updateAddress: (id: string, data: Partial<Address>) => api.put(`/api/user/addresses/${id}`, data),
    deleteAddress: (id: string) => api.delete(`/api/user/addresses/${id}`),
};

// Public
export const publicAPI = {
    getHero: () => api.get('/api/hero'),
    getTicker: () => api.get('/api/ticker'),
    getSettings: () => api.get('/api/settings'),
};

export default api;
