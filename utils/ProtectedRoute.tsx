'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/hooks/useAuthStore';
import { useSubscription } from '@/hooks/useSubscription';

type AccessLevel = 'auth' | 'subscription' | 'premium';

interface ProtectedRouteProps {
  children: React.ReactNode;
  accessLevel?: AccessLevel;
  fallbackUrl?: string;
  LoadingComponent?: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  accessLevel = 'auth',
  fallbackUrl,
  LoadingComponent
}) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { subscription, loading } = useSubscription();

  // Custom loading component or default spinner
  const Loader = LoadingComponent || (() => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  ));

  useEffect(() => {
    const checkAccess = async () => {
      // Not authenticated
      if (!isAuthenticated) {
        router.push(fallbackUrl || '/login');
        return;
      }

      // Check subscription requirements
      if (accessLevel === 'subscription' && !loading && !subscription) {
        router.push(fallbackUrl || '/subscription');
        return;
      }

      // Check premium access (you can add more complex logic here)
      if (accessLevel === 'premium' && (!subscription || !subscription.freeTrial)) {
        router.push(fallbackUrl || '/upgrade');
        return;
      }
    };

    checkAccess();
  }, [isAuthenticated, subscription, loading, accessLevel, router, fallbackUrl]);

  // Show loading state while checking authentication/subscription
  if (loading || !isAuthenticated) {
    return <Loader />;
  }

  // Access level checks
  switch (accessLevel) {
    case 'subscription':
      if (!subscription) return null;
      break;
    case 'premium':
      if (!subscription || !subscription.freeTrial) return null;
      break;
    default:
      // 'auth' level only needs authentication, which we already checked
      break;
  }

  return <>{children}</>;
};

export default ProtectedRoute;