"use client";

import { signIn } from "next-auth/react";
import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
      return;
    }

    router.push("/dashboard/transacciones");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-blue-50 border border-blue-300 rounded-xl p-6 md:p-8 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Hotel<span className="text-blue-500">Desk</span>
          </h1>
          <p className="text-gray-600 mt-2 text-xs md:text-sm">
            Ingresa tus credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email-input"
              className="text-sm text-gray-700 font-medium"
            >
              Correo electrónico
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              required
              placeholder="admin@hoteldesk.com"
              className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password-input"
              className="text-sm text-gray-700 font-medium"
            >
              Contraseña
            </label>
            <input
              id="password-input"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-white border border-blue-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <p className="text-red-700 text-sm text-center bg-red-100 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
