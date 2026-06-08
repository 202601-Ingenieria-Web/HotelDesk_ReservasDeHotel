import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "../../components/sidebar/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtiene la sesión del servidor — si no hay sesión, redirige al login
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar user={session.user} />
      <main className="flex-1 md:ml-32 pt-16 md:pt-0 p-4 md:p-8 w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
