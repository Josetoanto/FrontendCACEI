import React, { useState, useEffect } from 'react';
import Header from '../organisms/Header';
import RubricaItemEditable from '../molecule/RubricaItemEditable';

// Datos iniciales de la rúbrica

const ModificarRubrica: React.FC = () => {
  const [rubricas, setRubricas] = useState<{ id: number; titulo: string; descripcion: string; }[]>([]); // Inicializa con un array vacío y especifica el tipo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRubricas = async () => {
      try {
        const token = localStorage.getItem('userToken'); // Obtén el token del localStorage
        if (!token) {
          setError('No se encontró el token de autenticación.');
          setLoading(false);
          return;
        }

        const apiUrl = 'http://188.68.59.176:8000/criteria';
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}` // Añade el token al encabezado
          }
        });

        if (!response.ok) {
          throw new Error(`Error al cargar las rúbricas: ${response.statusText}`);
        }

        const data = await response.json();
        // Mapea los datos de la API al formato esperado por el componente
        const formattedRubricas = data.map((item: any) => ({
          id: item.id,
          titulo: item.nombre, // 'nombre' de la API se mapea a 'titulo'
          descripcion: item.descripcion,
        }));
        setRubricas(formattedRubricas);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRubricas();
  }, []); // El array vacío asegura que se ejecute una sola vez al montar

  if (loading) {
    return <div>Cargando rúbricas...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            />
          ))}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {/* <button
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
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificarRubrica;
