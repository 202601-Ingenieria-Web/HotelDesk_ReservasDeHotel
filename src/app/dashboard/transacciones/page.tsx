"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, TrendingUp } from "lucide-react";
import AddBookingModal from "../../../components/transacciones/AddBookingModal";
import OccupancyChart from "../../../components/transacciones/OccupancyChart";

interface Room {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface Booking {
  id: string;
  type: "ENTRADA" | "SALIDA";
  nights: number;
  date: string;
  user: { name: string | null; email: string };
}

export default function TransaccionesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Carga habitaciones al montar
  useEffect(() => {
    let isMounted = true;
    fetch("/api/rooms")
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        setRooms(data);
        if (data.length > 0) setSelectedRoom(data[0]);
      })
      .catch((err) => console.error("[FETCH_ROOMS_INIT_ERROR]", err))
      .finally(() => {
        if (isMounted) setLoadingRooms(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Memorizar la consulta de reservas
  const fetchBookings = useCallback(async (roomId: string) => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/bookings?roomId=${roomId}`);
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("[FETCH_BOOKINGS_ERROR]", error);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  // Carga bookings cuando cambia la habitación seleccionada
  useEffect(() => {
    if (!selectedRoom) return;

    const executeFetch = setTimeout(() => {
      fetchBookings(selectedRoom.id);
    }, 0);

    return () => clearTimeout(executeFetch);
  }, [selectedRoom, fetchBookings]);

  const refreshData = useCallback(async () => {
    if (!selectedRoom) return;

    try {
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch(`/api/bookings?roomId=${selectedRoom.id}`).then((r) => r.json()),
        fetch("/api/rooms").then((r) => r.json()),
      ]);

      setBookings(bookingsRes);
      setRooms(roomsRes);

      const updatedRoom = roomsRes.find((r: Room) => r.id === selectedRoom.id);
      if (updatedRoom) setSelectedRoom(updatedRoom);
    } catch (error) {
      console.error("[REFRESH_DATA_ERROR]", error);
    }
  }, [selectedRoom]);

  const renderTableContent = () => {
    if (loadingBookings) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <TrendingUp className="text-blue-300" size={40} />
          <p className="text-blue-500">No hay movimientos registrados</p>
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-blue-200">
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Fecha
            </th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tipo
            </th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Noches
            </th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Registrado por
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="px-3 py-4 text-xs text-gray-600 font-mono">
                {booking.id.slice(0, 8)}...
              </td>
              <td className="px-3 py-4 text-gray-700 text-sm">
                {new Date(booking.date).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-3 py-4">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                    booking.type === "ENTRADA"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {booking.type === "ENTRADA" ? "Check-in" : "Check-out"}
                </span>
              </td>
              <td className="px-3 py-4 text-amber-950 font-medium">
                {booking.nights} {booking.nights === 1 ? "noche" : "noches"}
              </td>
              <td className="px-3 py-4 text-amber-800 text-sm">
                {booking.user.name ?? booking.user.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mr-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-amber-950">Transacciones</h1>
          <p className="text-amber-700 text-xs md:text-sm mt-1">
            Movimientos de reservas por habitación
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!selectedRoom}
          className="flex items-center justify-center md:justify-start gap-2 px-3 md:px-4 py-2 md:py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm md:text-base rounded-lg transition-all duration-150 w-full md:w-auto"
        >
          <Plus size={18} />
          Agregar movimiento
        </button>
      </div>

      {/* Dropdown selector de habitación */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
        <label
          htmlFor="room-select"
          className="text-amber-900 text-sm font-medium whitespace-nowrap text-center sm:text-left"
        >
          Habitación:
        </label>
        {loadingRooms ? (
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <select
            id="room-select"
            value={selectedRoom?.id ?? ""}
            onChange={(e) => {
              const room = rooms.find((r) => r.id === e.target.value);
              if (room) setSelectedRoom(room);
            }}
            className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-amber-950 focus:outline-none focus:ring-1 focus:ring-orange-500 transition w-full sm:w-auto"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — Saldo: {room.balance} noches
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tabla de movimientos */}
      <div className="rounded-lg border border-blue-300 bg-white overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="pl-3 pr-3 py-4 border-b border-blue-200">
            <h2 className="text-gray-900 font-semibold text-sm md:text-base"> 
              Movimientos{selectedRoom ? ` — ${selectedRoom.name}` : ""}
            </h2>
          </div>
          {/* Renderizado condicional limpio sin ternarios anidados */}
          {renderTableContent()}
        </div>
      </div>

      {/* Gráfica de ocupación */}
      {selectedRoom && bookings.length > 0 && (
        <OccupancyChart bookings={bookings} roomName={selectedRoom.name} />
      )}

      {/* Modal */}
      {showModal && selectedRoom && (
        <AddBookingModal
          room={selectedRoom}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
}
