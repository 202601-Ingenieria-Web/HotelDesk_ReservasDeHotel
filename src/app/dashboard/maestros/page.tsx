"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, BedDouble } from "lucide-react";
import AddRoomModal from "../../../components/maestros/AddRoomModal";

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  balance: number;
  createdAt: string;
  createdBy: { name: string | null; email: string };
}

export default function MaestrosPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  // Carga las habitaciones al montar el componente
  async function fetchRooms() {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("[FETCH_ROOMS_ERROR]", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadRooms() {
      await fetchRooms();
    }
    loadRooms();
  }, []);

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (rooms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <BedDouble className="text-blue-300" size={40} />
          <p className="text-blue-500">No hay habitaciones registradas</p>
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-blue-200">
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Habitación
            </th>
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Capacidad
            </th>
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Precio / noche
            </th>
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Saldo
            </th>
            <th className="text-left px-3 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Creado por
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {rooms.map((room) => (
            <tr
              key={room.id}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="px-3 py-4 text-xs text-gray-600 font-mono">
                {room.id.slice(0, 8)}...
              </td>
              <td className="px-3 py-4 text-gray-900 font-medium">{room.name}</td>
              <td className="px-3 py-4">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-600 text-xs rounded-lg">
                  {room.type}
                </span>
              </td>
              <td className="px-3 py-4 text-gray-700">{room.capacity} pax</td>
              <td className="px-3 py-4 text-gray-700">
                ${room.pricePerNight.toLocaleString("es-CO")}
              </td>
              <td className="px-3 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    room.balance > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.balance} noches
                </span>
              </td>
              <td className="px-3 py-4 text-amber-800 text-sm">
                {room.createdBy.name ?? room.createdBy.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-amber-950">Habitaciones</h1>
          <p className="text-amber-700 text-xs md:text-sm mt-1">
            Gestión del inventario de habitaciones
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 md:py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm md:text-base rounded-lg transition-all duration-150 w-full md:w-auto"
          >
            <Plus size={18} />
            Agregar habitación
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-orange-200 bg-white overflow-x-auto">
        <div className="inline-block min-w-full">
          {renderTableContent()}
        </div>
      </div>

      {/* Modal para agregar habitación */}
      {showModal && (
        <AddRoomModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchRooms(); // refresca la tabla automáticamente
          }}
        />
      )}
    </div>
  );
}
