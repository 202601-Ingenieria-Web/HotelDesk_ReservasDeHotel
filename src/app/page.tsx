import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 p-4 md:p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Hotel<span className="text-blue-500">Desk</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-md">
          Sistema de administración interna para gestión de reservas y
          habitaciones
        </p>
      </div>

      <Link
        href="/login"
        className="mt-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 text-base md:text-lg"
      >
        Iniciar sesión
      </Link>
    </main>
  );
}
