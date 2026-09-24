"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
