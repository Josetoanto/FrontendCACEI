import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from 'react';

interface ProyectoProps {
  id: number;
  nombre: string;
  fecha: string;
  onDelete: (id: number) => void;
}

const Proyecto: React.FC<ProyectoProps> = ({ id, nombre, fecha, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este proyecto?");
    if (!confirmDelete) {
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        alert("No autenticado. Por favor, inicia sesión.");
        return;
    }

    try {
      const apiUrl = `https://gcl58kpp-8000.use2.devtunnels.ms/projects/${id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error al eliminar proyecto:', response.status);
        alert('No se pudo eliminar el proyecto.');
        return;
      }

      alert("Proyecto eliminado con éxito.");
      onDelete(id); // Llama a la función onDelete del padre para actualizar la lista
    } catch (error) {
      console.error('Error al conectar con la API para eliminar:', error);
      alert('Error al eliminar el proyecto. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "10% 75% 15%",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #ddd",
      position: "relative", // Necesario para posicionar el menú
    }}>
      {/* Columna 1 - Ícono de maleta */}
      <i className="fas fa-briefcase" style={{ fontSize: "20px", color: "black" , backgroundColor:"#f0f2f5", "maxWidth":"20px", padding:"15px", borderRadius:"12px"}}></i>

      {/* Columna 2 - Nombre y fecha */}
      <div>
        <strong>{nombre}</strong>
        <p style={{ margin: "5px 0 0", color: "#666" }}>{fecha}</p>
      </div>

      {/* Columna 3 - Menú */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <i 
          className="fas fa-ellipsis-v" 
          style={{ cursor: "pointer", color: "#888" }}
          onClick={toggleMenu}
        ></i>
        {showMenu && (
          <div style={{
            position: "absolute",
            backgroundColor: "#f9f9f9",
            minWidth: "120px",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            zIndex: 1,
            right: 0, // Posiciona el menú a la derecha del icono
            top: "20px", // Posiciona el menú debajo del icono
            borderRadius: "4px",
          }}>
            <a 
              href="#" 
              onClick={handleDelete} 
              style={{
                color: "black",
                padding: "12px 16px",
                textDecoration: "none",
                display: "block",
                textAlign: "left",
              }}
            >
              Eliminar
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proyecto;
