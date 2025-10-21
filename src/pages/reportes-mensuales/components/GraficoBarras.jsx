import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoBarras({ consultas }) {
  const prioridades = ["normal", "urgente"];
  const cantidades = prioridades.map((p) => consultas.filter((c) => c.prioridad === p).length);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="font-semibold mb-2">Consultas por prioridad</h3>
      <Bar
        data={{
          labels: prioridades.map((p) => p.charAt(0).toUpperCase() + p.slice(1)),
          datasets: [
            {
              label: "Cantidad",
              data: cantidades,
              backgroundColor: ["#10b981", "#ef4444"],
            },
          ],
        }}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    </div>
  );
}