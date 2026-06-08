"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Users, LogOut, Hotel, Menu, X } from "lucide-react";
import type { Role } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface SidebarProps {
  readonly user: {
    readonly name?: string | null;
    readonly email?: string | null;
    readonly image?: string | null;
    readonly role: Role;
  };
}

// Links visibles para todos los roles
const commonLinks = [
  {
    href: "/dashboard/transacciones",
    label: "Transacciones",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/maestros",
    label: "Habitaciones",
    icon: BookOpen,
  },
];

// Links solo para ADMIN
const adminLinks = [
  {
    href: "/dashboard/usuarios",
    label: "Usuarios",
    icon: Users,
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN";
  const [isOpen, setIsOpen] = useState(false);

  const links = isAdmin ? [...commonLinks, ...adminLinks] : commonLinks;

  // Genera las iniciales del nombre para el avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-blue-300 z-40 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Hotel className="text-blue-500" size={20} />
          <span className="text-gray-900 font-bold text-sm">
            Hotel<span className="text-blue-500">Desk</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-blue-50 rounded-lg transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-blue-300 flex flex-col transition-transform duration-300 z-50 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:sticky md:top-0`}>
        {/* Logo - Desktop */}
        <div className="hidden md:flex px-6 py-6 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <Hotel className="text-blue-500" size={24} />
            <span className="text-gray-900 font-bold text-lg">
              Hotel<span className="text-blue-500">Desk</span>
            </span>
          </div>
        </div>

        {/* Mobile spacing */}
        <div className="h-16 md:hidden" />

        {/* Info del usuario */}
        <div className="px-6 py-6 border-b border-blue-200">
          <div className="flex items-center gap-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Usuario"}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 ring-2 ring-blue-300 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {initials}
                </span>
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-gray-900 text-sm font-medium truncate">
                {user.name ?? "Usuario"}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isAdmin
                    ? "bg-blue-100 text-blue-600"
                    : "bg-blue-50 text-blue-500"
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Links de navegación */}
        <nav className="flex-1 px-4 py-5 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Icon size={18} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botón de cerrar sesión */}
        <div className="px-4 py-4 border-t border-blue-200">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
          >
            <LogOut size={18} />
            <span className="truncate">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
