"use client";
import { useState, useEffect } from "react";
import { useUrlStore } from "@/store/urlStore";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { urls, shortenUrl, loading, error } = useUrlStore();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleReCaptchaVerify = async () => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
        return;
      }

      const token = await executeRecaptcha("homepage");
      setRecaptchaToken(token);
    };

    handleReCaptchaVerify();
  }, [executeRecaptcha]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      // Simular una llamada al backend para obtener los datos del usuario
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user); // Guardar el usuario en el estado global
          router.replace("/"); // Limpiar la URL eliminando el token
        })
        .catch((err) => console.error("Error al obtener el usuario:", err));
    }
  }, [setUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && recaptchaToken) {
      await shortenUrl(url, recaptchaToken);
      setUrl("");
      setRecaptchaToken(null);
    }
  };

  if (!user) {
    return <p>Registrate para poder acortar tu URL</p>;
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-black">
      <h1 className="text-2xl font-bold text-center mb-4">
        Bienvenido, {user.displayName}
      </h1>
      <p className="text-center">¡Ya estás logueado!</p>

      <h1 className="text-2xl font-bold text-center mb-4">Acorta tu URL</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          disabled={loading || !recaptchaToken}
        >
          {loading ? "Acortando..." : "Acortar"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-6 space-y-2">
        {urls.map((u) => (
          <li
            key={u.id}
            className="p-2 border rounded-md flex justify-between items-center"
          >
            <span className="truncate max-w-xs">{u.originalUrl}</span>
            <a
              href={u.shortUrl}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {u.shortUrl}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
