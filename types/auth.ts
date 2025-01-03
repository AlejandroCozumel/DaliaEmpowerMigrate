export interface Subscription {
  _id: string;
  name: string;
  duration: number;
  durationType: string;
  freeTrial: boolean;
  startDate: string;
}

export type AccessLevel = 'auth' | 'subscription' | 'premium';

export interface ProtectedRouteProps {
  accessLevel?: AccessLevel;
  redirectUrl?: string;
  children: React.ReactNode;
}