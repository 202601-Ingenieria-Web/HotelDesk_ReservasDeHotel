"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Booking {
  readonly type: "ENTRADA" | "SALIDA";
  readonly nights: number;
  readonly date: string;
}

interface OccupancyChartProps {
  readonly bookings: Booking[];
  readonly roomName: string;
}

export default function OccupancyChart({
  bookings,
  roomName,
}: OccupancyChartProps) {
  // Calcula la evolución del saldo día a día
  const chartData = bookings.map((booking, index) => {
    const saldoAcumulado = bookings.slice(0, index + 1).reduce((acc, b) => {
      return b.type === "ENTRADA" ? acc - b.nights : acc + b.nights;
    }, 30); // parte desde el saldo inicial estimado

    return {
      fecha: new Date(booking.date).toLocaleDateString("es-CO", {
        month: "short",
        day: "numeric",
      }),
      saldo: saldoAcumulado,
      tipo: booking.type === "ENTRADA" ? "Check-in" : "Check-out",
    };
  });

  return (
    <div className="bg-white border border-blue-300 rounded-lg p-4 md:p-6">
      <h2 className="text-gray-900 font-semibold mb-4 md:mb-6 text-sm md:text-base">
        Evolución de saldo — {roomName}
      </h2>
      <ResponsiveContainer width="100%" height={200} minHeight={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ABE4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ABE4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9F1FA" />
          <XAxis
            dataKey="fecha"
            tick={{ fill: "#1A1A1A", fontSize: 12 }}
            axisLine={{ stroke: "#E9F1FA" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#1A1A1A", fontSize: 12 }}
            axisLine={{ stroke: "#E9F1FA" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #00ABE4",
              borderRadius: "8px",
              color: "#1A1A1A",
            }}
            formatter={(value) => [`${value} noches`, "Saldo"]}
          />
          <Area
            type="monotone"
            dataKey="saldo"
            stroke="#00ABE4"
            strokeWidth={2}
            fill="url(#colorSaldo)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
