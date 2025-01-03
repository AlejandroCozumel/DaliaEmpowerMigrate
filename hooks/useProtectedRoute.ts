'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/hooks/useAuthStore';
import { useSubscription } from '@/hooks/useSubscription';

// Types
export type AccessLevel = 'auth' | 'subscription' | 'premium';

interface SubscriptionType {
  _id: string;
  name: string;
  duration: number;
  durationType: string;
  freeTrial: boolean;
  startDate: string;
}

interface UseProtectedRouteReturn {
  isLoading: boolean;
  hasAccess: boolean;
}

export const useProtectedRoute = (
  accessLevel: AccessLevel = 'auth',
  redirectUrl?: string
): UseProtectedRouteReturn => {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { subscription } = useSubscription();

  useEffect(() => {
    // Only redirect if we're certain about the auth state
    if (token === null) {
      router.push(redirectUrl || '');
      return;
    }

    if (accessLevel === 'subscription' && subscription === null) {
      router.push(redirectUrl || '');
      return;
    }

    if (accessLevel === 'premium' && subscription?.freeTrial !== true) {
      router.push(redirectUrl || '');
      return;
    }
  }, [token, subscription, accessLevel, router, redirectUrl]);

  // Ensure we're always returning a boolean
  const checkAccess = (): boolean => {
    if (token === null) return false;

    switch (accessLevel) {
      case 'auth':
        return true;
      case 'subscription':
        return subscription !== null;
      case 'premium':
        return subscription?.freeTrial === true;
      default:
        return false;
    }
  };

  return {
    isLoading: false,
    hasAccess: checkAccess()
  };
};