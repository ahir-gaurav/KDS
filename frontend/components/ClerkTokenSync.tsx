'use client';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import api from '@/lib/api';

/**
 * ClerkTokenSync
 * 
 * Invisible component that runs after Clerk authentication.
 * Calls POST /api/auth/clerk-sync with the Clerk session token + user email,
 * which the backend verifies and returns a backend JWT stored as a cookie.
 * This bridges Clerk auth → backend JWT so all protected API routes work.
 */
export default function ClerkTokenSync() {
    const { getToken, isSignedIn } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (!isSignedIn || !user) return;

        const syncWithBackend = async () => {
            try {
                const clerkToken = await getToken();
                if (!clerkToken) return;

                const email = user.primaryEmailAddress?.emailAddress;
                const name = user.fullName || user.firstName || email?.split('@')[0];

                if (!email) return;

                const { data } = await api.post('/api/auth/clerk-sync', { clerkToken, email, name });
                if (data.token) {
                    localStorage.setItem('backendToken', data.token);
                }
            } catch {
                // Silently fail — user is still authenticated via Clerk
            }
        };

        syncWithBackend();
    }, [isSignedIn, user, getToken]);

    return null;
}
