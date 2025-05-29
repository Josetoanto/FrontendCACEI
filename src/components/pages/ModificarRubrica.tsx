import React, { useState } from 'react';
import Header from '../organisms/Header';
import RubricaItemEditable from '../molecule/RubricaItemEditable';

// Datos iniciales de la rúbrica
const initialRubricas = [
  { id: 1, titulo: "Diseño", descripcion: "Se evalúa la coherencia y estética visual del proyecto." },
  { id: 2, titulo: "Impacto en la comunidad", descripcion: "Cómo afecta positiva o negativamente a su entorno." },
  { id: 3, titulo: "Implementación y ejecución", descripcion: "La viabilidad y correcta aplicación del proyecto." },
  { id: 4, titulo: "Sustentabilidad", descripcion: "Capacidad de perdurar en el tiempo sin afectar recursos." },
  { id: 5, titulo: "Innovación y originalidad", descripcion: "Uso creativo y novedoso de tecnologías o ideas." }
];

const ModificarRubrica: React.FC = () => {
  const [rubricas, setRubricas] = useState(initialRubricas);

  // Función para agregar una nueva rúbrica
  const handleAddRubrica = () => {
    if (rubricas.length < 5) {
      const newId = Date.now();
      const nuevaRubrica = { id: newId, titulo: "Nueva Rúbrica", descripcion: "Descripción de la nueva rúbrica." };
      setRubricas([...rubricas, nuevaRubrica]);
    }
  };

  // Función para eliminar una rúbrica por su ID
  const handleRemoveRubrica = (id: number) => {
    if (rubricas.length > 3) {
      setRubricas(rubricas.filter(rubrica => rubrica.id !== id));
    }
  };

  return (
    <div>
      <Header />
      <div style={{ width: '75%', margin: '20px auto' }}>
        <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>Modificar Rúbrica de Proyectos</h1>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          Aquí puedes editar los criterios y descripciones de la rúbrica utilizada para evaluar proyectos.
        </p>

        <div style={{ borderRadius: "10px" }}>
          <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "16px" }}>Rúbrica de Evaluación</h2>

          {rubricas.map((item) => (
            <RubricaItemEditable 
              key={item.id} 
              item={item} 
              onRemove={handleRemoveRubrica}
              canRemove={rubricas.length > 3}
            />
          ))}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleAddRubrica}
              disabled={rubricas.length >= 5}
              style={{
                backgroundColor: rubricas.length >= 5 ? "#ccc" : "#4CAF50",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: rubricas.length >= 5 ? "not-allowed" : "pointer",
                marginRight: "10px"
              }}
            >
              Agregar Rúbrica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificarRubrica;