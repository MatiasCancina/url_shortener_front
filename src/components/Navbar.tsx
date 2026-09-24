import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

const Navbar = () => {
  const { user, logout, isLoading } = useAuthStore();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        URL Shortener
      </Link>

      {isLoading ? (
        <p>Cargando...</p>
      ) : user ? (
        <div className="flex items-center gap-4">
          <Image
            width={40}
            height={40}
            src={user.photo}
            alt={user.displayName}
            className="w-10 h-10 rounded-full"
          />
          <span>{user.displayName}</span>
          <button
            onClick={logout}
            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="http://localhost:5000/auth/google"
          className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
        >
          Login con Google
        </a>
      )}
    </nav>
  );
};

export default Navbar;
