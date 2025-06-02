import React, { useState, useEffect } from 'react';
import RubricaItem from "../atoms/RubricaItem";

interface RubricaPresentacionProps {
  onRubricasChange: (rubricasEvaluadas: { criterio_id: number; puntuacion: number | null }[]) => void;
}

const RubricaPresentacion: React.FC<RubricaPresentacionProps> = ({ onRubricasChange }) => {
  const [rubricas, setRubricas] = useState<any[]>([]);
  const [criterioPuntuaciones, setCriterioPuntuaciones] = useState<{[key: number]: number | null}>({});

  useEffect(() => {
    const fetchRubricas = async () => {
      const token = localStorage.getItem('userToken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };

      try {
        const response = await fetch('https://gcl58kpp-8000.use2.devtunnels.ms/criteria', {
          headers: headers,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRubricas(data);
      } catch (error) {
        console.error("Error fetching rubricas:", error);
      }
    };

    fetchRubricas();
  }, []);

  useEffect(() => {
    // Cuando las puntuaciones de los criterios cambian, notificamos al componente padre
    const evaluadas = Object.entries(criterioPuntuaciones).map(([criterioId, puntuacion]) => ({
      criterio_id: parseInt(criterioId),
      puntuacion: puntuacion
    }));
    onRubricasChange(evaluadas);
  }, [criterioPuntuaciones, onRubricasChange]);

  const handlePuntuacionChange = (criterioId: number, puntuacion: number | null) => {
    setCriterioPuntuaciones(prev => ({
      ...prev,
      [criterioId]: puntuacion
    }));
  };

  return (
    <div style={{
      margin: "auto",
      borderRadius: "10px",
    }}>
      <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "16px" }}>Rúbrica de Evaluación</h2>
      
      {rubricas.map((item, index) => (
        <RubricaItem 
          key={item.id} 
          titulo={item.nombre} 
          descripcion={item.descripcion}
          criterioId={item.id}
          onPuntuacionChange={handlePuntuacionChange}
        />
      ))}
    </div>
  );
};

export default RubricaPresentacion;
