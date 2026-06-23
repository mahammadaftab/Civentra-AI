import { create } from 'zustand';

export type UserRole = 'citizen' | 'department_admin' | 'super_admin';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  heroPoints: number;
  trustScore: number;
  badges: string[];
  heroLevel: string;
}

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthLoading: boolean;
  setIsAuthLoading: (loading: boolean) => void;
  activeMapLayer: string;
  setActiveMapLayer: (layer: string) => void;
  pendingRole: UserRole | null;
  setPendingRole: (role: UserRole | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark', // Defaulting to dark as per typical modern AI tools
  setTheme: (theme) => set({ theme }),
  user: null,
  setUser: (user) => set({ user }),
  isAuthLoading: true,
  setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  activeMapLayer: 'default',
  setActiveMapLayer: (layer) => set({ activeMapLayer: layer }),
  pendingRole: null,
  setPendingRole: (role) => set({ pendingRole: role }),
}));
