import "@fortawesome/fontawesome-free/css/all.min.css";
import React from 'react';
import Swal from 'sweetalert2';

interface ProyectoProps {
  id: number;
  nombre: string;
  fecha: string;
  onDelete: (id: number) => void;
  isOpen: boolean;
  onToggleMenu: (id: number | null) => void;
}

const Proyecto: React.FC<ProyectoProps> = ({ id, nombre, fecha, onDelete, isOpen, onToggleMenu }) => {
  const toggleMenu = () => {
    onToggleMenu(isOpen ? null : id);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    });

    if (!result.isConfirmed) {
      return;
    }

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        await Swal.fire("Error", "No autenticado. Por favor, inicia sesión.", "error");
        return;
    }

    try {
      const apiUrl = `http://188.68.59.176:8000/projects/${id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error al eliminar proyecto:', response.status);
        await Swal.fire("Error", "No se pudo eliminar el proyecto.", "error");
        return;
      }

      await Swal.fire("¡Eliminado!", "El proyecto ha sido eliminado.", "success");
      onDelete(id); // Llama a la función onDelete del padre para actualizar la lista
    } catch (error) {
      console.error('Error al conectar con la API para eliminar:', error);
      await Swal.fire("Error", "Error al eliminar el proyecto. Por favor, inténtalo de nuevo más tarde.", "error");
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
        {isOpen && (
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
