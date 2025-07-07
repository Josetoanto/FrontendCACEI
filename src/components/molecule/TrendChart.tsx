import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format, subDays } from "date-fns";
import React from 'react';

Chart.register(...registerables);

interface TrendChartProps {
  dailyAverages: number[];
}

const TrendChart: React.FC<TrendChartProps> = ({ dailyAverages }) => {
  const labels = Array.from({ length: 7 }, (_, i) => 
    format(subDays(new Date(), 6 - i), 'MMM dd') // Formato para los últimos 7 días
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Promedio de Evaluaciones",
        data: dailyAverages, // Usar datos dinámicos
        borderColor: "#61788a",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4, // Suaviza la curva
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
      x: { // Asegurarse de que las etiquetas del eje X se muestren correctamente
        ticks: {
          autoSkip: false, // Evita que Chart.js omita etiquetas si hay muchas
          maxRotation: 45, // Rota las etiquetas si es necesario
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%",  height: "300px", margin: "auto"}}>
      <h2 style={{ textAlign: "left", marginBottom: "10px" }}>Tendencia de promedio de evaluaciones</h2>
      <p style={{ textAlign: "left", color: "#666" }}>Últimos 7 días</p>
      <Line data={data} options={options} />
    </div>
  );
};

export default TrendChart;
