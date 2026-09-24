import { create } from "zustand";
import axios from "axios";

interface Url {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

interface UrlStore {
  urls: Url[];
  loading: boolean;
  error: string | null;
  shortenUrl: (originalUrl: string, recaptchaToken: string) => Promise<void>;
}

export const useUrlStore = create<UrlStore>((set) => ({
  urls: [],
  loading: false,
  error: null,

  shortenUrl: async (originalUrl, recaptchaToken) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/urls/shorten`,
        { originalUrl, recaptchaToken }
      );
      set((state) => ({
        urls: [data, ...state.urls],
        loading: false,
      }));
    } catch (error: unknown) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
