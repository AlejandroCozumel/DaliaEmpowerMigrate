// hooks/useSubscription.ts
import { useApolloClient } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_MEMBERSHIPS_SUBSCRIPTIONS } from "@/apollo/Queries";
import useAuthStore from './useAuthStore';

interface Subscription {
  _id: string;
  name: string;
  duration: number;
  durationType: string;
  freeTrial: boolean;
  startDate: string;
}

interface SubscriptionData {
  getMembershipSubscriptions: Subscription[];
}

export const useSubscription = () => {
  const client = useApolloClient();
  const {
    token,
    setSubscription,
    subscription: storedSubscription,
    lastSubscriptionFetch,
    setLastSubscriptionFetch
  } = useAuthStore();

  // Initialize with stored subscription
  const [localSubscription, setLocalSubscription] = useState<Subscription | null>(() => {
    if (storedSubscription) return storedSubscription;

    // Try to get from localStorage if not in store
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dalia.subscription');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSubscription(parsed); // Update store with localStorage value
          return parsed;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

  const shouldFetchInBackground = token && (
    !lastSubscriptionFetch ||
    Date.now() - lastSubscriptionFetch > REFRESH_INTERVAL
  );

  // Background fetch
  useEffect(() => {
    if (shouldFetchInBackground) {
      const fetchSubscription = async () => {
        try {
          const result = await client.query<SubscriptionData>({
            query: GET_MEMBERSHIPS_SUBSCRIPTIONS,
            fetchPolicy: 'network-only',
          });

          if (result.data?.getMembershipSubscriptions?.length > 0) {
            const newSubscription = result.data.getMembershipSubscriptions[0];
            setSubscription(newSubscription);
            setLocalSubscription(newSubscription);
            setLastSubscriptionFetch(Date.now());
          }
        } catch (error) {
          console.error('Background subscription fetch error:', error);
        }
      };

      fetchSubscription();
    }
  }, [shouldFetchInBackground, client, setSubscription, setLastSubscriptionFetch]);

  // Return the local state that's initialized with stored value
  return {
    subscription: localSubscription || storedSubscription,
    refetch: async () => {
      setLastSubscriptionFetch(0); // Force a refresh
    }
  };
};