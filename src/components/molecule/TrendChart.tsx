import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format, subDays, isSameDay } from "date-fns";
import React, { useState, useEffect } from 'react';

Chart.register(...registerables);

const TrendChart: React.FC = () => {
  const [dailyAverages, setDailyAverages] = useState<number[]>([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      const userToken = localStorage.getItem('userToken');

      if (!userToken) {
        console.log('No user token found, cannot fetch evaluations for chart.');
        // setDailyAverages(Array(7).fill(0)); // Opcional: mostrar 0 si no hay token
        return;
      }

      const apiUrl = 'https://gcl58kpp-8000.use2.devtunnels.ms/evaluations';

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Error fetching evaluations for chart:', response.status);
          // setDailyAverages(Array(7).fill(0)); // Opcional: mostrar 0 en caso de error
          return;
        }

        const data = await response.json();

        // Calculate daily averages for the last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

        const averages = last7Days.map(day => {
          const evaluationsOnDay = data.filter((evaluation: any) =>
            isSameDay(new Date(evaluation.creado_en), day)
          );

          if (evaluationsOnDay.length === 0) {
            return 0; // Return 0 if no evaluations on this day
          }

          let totalCriterionScoreSum = 0;
          let totalCriterionCount = 0;

          evaluationsOnDay.forEach((evaluation: any) => {
            if (evaluation.criterios && Array.isArray(evaluation.criterios)) {
              evaluation.criterios.forEach((criterio: any) => {
                if (typeof criterio.puntuacion === 'number') {
                  totalCriterionScoreSum += criterio.puntuacion;
                  totalCriterionCount++;
                }
              });
            }
          });

          return totalCriterionCount > 0 ? (totalCriterionScoreSum / totalCriterionCount) : 0;
        });

        setDailyAverages(averages);

      } catch (error) {
        console.error('Error fetching evaluations for chart:', error);
        // setDailyAverages(Array(7).fill(0)); // Opcional: mostrar 0 en caso de error
      }
    };

    fetchEvaluations();
  }, []); // Empty dependency array means this effect runs once on mount

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
