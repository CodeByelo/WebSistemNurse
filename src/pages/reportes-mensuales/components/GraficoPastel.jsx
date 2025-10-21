import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoPastel({ inventario }) {
  const bajo = inventario.filter((i) => i.cantidad <= i.umbral_bajo).length;
  const ok = inventario.length - bajo;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="font-semibold mb-2">Estado de inventario</h3>
      <Pie
        data={{
          labels: ["OK", "Bajo stock"],
          datasets: [
            {
              data: [ok, bajo],
              backgroundColor: ["#22c55e", "#f87171"],
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
}