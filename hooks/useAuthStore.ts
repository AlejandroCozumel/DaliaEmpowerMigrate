import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
}

interface Subscription {
  _id: string;
  name: string;
  duration: number;
  durationType: string;
  freeTrial: boolean;
  startDate: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  lastSubscriptionFetch: number | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setLastSubscriptionFetch: (timestamp: number) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateSubscription: (subscription: Subscription) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,
      lastSubscriptionFetch: null,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        if (token) {
          localStorage.setItem('dalia.auth.login', token);
          set({ token, isAuthenticated: true });
        } else {
          localStorage.removeItem('dalia.auth.login');
          set({ token: null, isAuthenticated: false });
        }
      },

      setSubscription: (subscription) => {
        set({ subscription });
        if (subscription) {
          localStorage.setItem('dalia.subscription', JSON.stringify(subscription));
        }
      },

      setLastSubscriptionFetch: (timestamp) =>
        set({ lastSubscriptionFetch: timestamp }),

      login: (token, user) => {
        localStorage.setItem('dalia.auth.login', token);
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('dalia.auth.login');
        set({
          user: null,
          token: null,
          subscription: null,
          isAuthenticated: false,
          lastSubscriptionFetch: null,
        });
      },

      updateSubscription: (subscription) => set({ subscription }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
        lastSubscriptionFetch: state.lastSubscriptionFetch,
      }),
      // Optional: Add storage validation/migration
      version: 1,
      // Optional: Add custom storage
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (e) {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// Optional: Add a hook for initial auth check
export const useInitialAuthCheck = () => {
  const { login, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if we have a token in localStorage but not in state
    const storedToken = localStorage.getItem('dalia.auth.login');
    if (storedToken && !isAuthenticated) {
      // You might want to validate the token here
      login(storedToken, { id: '', email: '' }); // Add user data if available
    }
  }, []);

  return { token, isAuthenticated };
};

export default useAuthStore;