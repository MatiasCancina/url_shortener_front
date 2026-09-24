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
  shortenUrl: (originalUrl: string, captchaToken: string) => Promise<void>;
}

export const useUrlStore = create<UrlStore>((set) => ({
  urls: [],
  loading: false,
  error: null,

  shortenUrl: async (originalUrl, captchaToken) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/urls/shorten`,
        { originalUrl, captchaToken }
      );
      set((state) => ({
        urls: [data, ...state.urls],
        loading: false,
      }));
    } catch (error: unknown) {
      const responseData = axios.isAxiosError(error)
        ? (error.response?.data as { error?: string; message?: string } | undefined)
        : undefined;
      const message = responseData?.error || responseData?.message;

      set({
        error: message || (error instanceof Error ? error.message : "No se pudo acortar la URL"),
        loading: false,
      });
    }
  },
}));
