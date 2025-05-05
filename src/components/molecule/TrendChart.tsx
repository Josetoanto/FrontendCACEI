import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format, subMonths } from "date-fns";

Chart.register(...registerables);

const TrendChart: React.FC = () => {
  const labels = Array.from({ length: 6 }, (_, i) => 
    format(subMonths(new Date(), 5 - i), 'MMM')
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Promedio de Evaluaciones",
        data: [75, 82, 65, 90, 78, 85], // Datos de tendencia
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
    },
  };

  return (
    <div style={{ width: "100%",  height: "300px", margin: "auto"}}>
      <h2 style={{ textAlign: "left", marginBottom: "10px" }}>Tendencia de promedio de evaluaciones</h2>
      <p style={{ textAlign: "left", color: "#666" }}>Últimos 6 meses</p>
      <Line data={data} options={options} />
    </div>
  );
};

export default TrendChart;
