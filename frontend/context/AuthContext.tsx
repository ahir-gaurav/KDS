'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from "@clerk/nextjs";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut, openSignIn } = useClerk();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            if (clerkUser) {
                setUser({
                    id: clerkUser.id,
                    name: clerkUser.fullName || clerkUser.username || '',
                    email: clerkUser.primaryEmailAddress?.emailAddress || '',
                });
                // In Keyless Mode/Clerk setup, the token is handled by the browser
                // If the backend needs a JWT, it should be retrieved via clerkUser.getToken()
                setToken(null); 
            } else {
                setUser(null);
                setToken(null);
            }
            setLoading(false);
        }
    }, [clerkUser, isLoaded]);

    const login = async (email: string, password: string) => {
        openSignIn();
    };

    const logout = async () => {
        await signOut();
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, setUser, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
