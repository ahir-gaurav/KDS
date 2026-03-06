'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
    isAdmin: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (storedToken) {
            setToken(storedToken);
            setIsAdmin(true);
        }
    }, []);

    const login = (newToken: string) => {
        setToken(newToken);
        setIsAdmin(true);
        localStorage.setItem('adminToken', newToken);
    };

    const logout = () => {
        setToken(null);
        setIsAdmin(false);
        localStorage.removeItem('adminToken');
    };

    return (
        <AdminAuthContext.Provider value={{ isAdmin, token, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return ctx;
};
