import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  googleId: string;
  displayName: string;
  email: string;
  photo: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    try {
      const { data } = await axios.get<User>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
        { withCredentials: true }
      );
      set({ user: data, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("Usuario no autenticado.");
      } else {
        console.error("Error fetching user:", error);
      }
      set({ user: null, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    set({ user: null });
    window.location.assign(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`);
  },
}));
