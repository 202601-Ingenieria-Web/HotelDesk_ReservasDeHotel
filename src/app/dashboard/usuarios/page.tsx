"use client";

import { useEffect, useState, useCallback } from "react"; // Importamos useCallback
import { Users } from "lucide-react";
import EditUserModal from "../../../components/usuarios/EditUserModal";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Memorizamos la función fetch para evitar recreaciones redundantes
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("[FETCH_USERS_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const executeFetch = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(executeFetch);
  }, [fetchUsers]);

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Users className="text-blue-300" size={40} />
          <p className="text-blue-500">No hay usuarios registrados</p>
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-blue-200">
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Correo
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Rol
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Fecha de creación
            </th>
            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-100">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-orange-50 transition-colors"
            >
              <td className="px-6 py-4 text-xs text-amber-700 font-mono">
                {user.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium">
                {user.name ?? "—"}
              </td>
              <td className="px-6 py-4 text-gray-700 text-sm">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    user.role === "ADMIN"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-700 text-sm">
                {new Date(user.createdAt).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-3 py-1.5 text-xs font-medium border border-blue-300 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                >
                  Editar rol
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600 text-xs md:text-sm mt-1">
          Gestión de roles del personal
        </p>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-blue-300 bg-white overflow-x-auto">
        <div className="inline-block min-w-full">
          {renderTableContent()}
        </div>
      </div>

      {/* Modal editar rol */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
