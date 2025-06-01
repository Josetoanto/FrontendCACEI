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

        const apiUrl = 'https://gcl58kpp-8000.use2.devtunnels.ms/criteria';
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

  // Función para agregar una nueva rúbrica
  const handleAddRubrica = async () => {
    if (rubricas.length < 5) {
      const newId = Date.now(); // Genera un ID temporal para el estado local
      const nuevaRubrica = {
        id: newId,
        titulo: "Nueva Rúbrica",
        descripcion: "Descripción de la nueva rúbrica."
      };

      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          alert('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
          return;
        }

        const apiUrl = 'https://gcl58kpp-8000.use2.devtunnels.ms/criteria';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre: "Nueva Rubrica", // Nombre por defecto para la nueva rúbrica
            descripcion: "Descripcion de Rubrica", // Descripción por defecto
            peso: 100, // Valor de peso fijado a 100
            competencia_asociada: "" // Valor por defecto, ya que se ignora
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al agregar rúbrica: ${response.status} - ${errorText}`);
        }

        const addedRubrica = await response.json();
        // Asumiendo que la API devuelve la rúbrica creada con su ID real y otros datos
        const formattedAddedRubrica = {
          id: addedRubrica.id,
          titulo: addedRubrica.nombre,
          descripcion: addedRubrica.descripcion,
        };

        setRubricas([...rubricas, formattedAddedRubrica]);
      } catch (err: any) {
        alert(`Error al agregar la rúbrica: ${err.message}`);
      }
    }
  };

  // Función para eliminar una rúbrica por su ID
  const handleRemoveRubrica = async (id: number) => {
    if (rubricas.length > 3) {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          alert('No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
          return;
        }

        const apiUrl = `https://gcl58kpp-8000.use2.devtunnels.ms/criteria/${id}`;
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar rúbrica: ${response.status} - ${errorText}`);
        }

        // Si la eliminación en la API es exitosa, actualiza el estado local
        setRubricas(rubricas.filter(rubrica => rubrica.id !== id));
        alert('Rúbrica eliminada exitosamente.');
      } catch (err: any) {
        alert(`Error al eliminar la rúbrica: ${err.message}`);
      }
    }
  };

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