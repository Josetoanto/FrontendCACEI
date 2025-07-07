import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

interface EncuestaCardProps {
  title: string;
  createdAt: string;
  imageSrc: string;
  id: number;
  onDeleteSuccess: () => void;
  isFuture?: boolean;
  inicio?: Date;
  userType?: string;
}

const EncuestaCard: React.FC<EncuestaCardProps> = ({ title, createdAt, imageSrc, id, onDeleteSuccess, isFuture, inicio, userType }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!isFuture) {
      if (userType === 'Administrador') {
        navigate(`/crearEncuesta/${id}`);
      } else if (userType === 'Egresado' || userType === 'Evaluador' || userType === 'Empleador') {
        navigate(`/responderEncuesta/${id}`);
      }
    }
  };

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        Swal.fire('Error', 'No estás autenticado para realizar esta acción.', 'error');
        return;
      }

      const apiUrl = `https://egresados.it2id.cc/api/surveys/${id}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          Swal.fire('¡Eliminada!', 'La encuesta ha sido eliminada.', 'success');
          onDeleteSuccess();
        } else {
          const errorText = await response.text();
          Swal.fire('Error', `Error al eliminar la encuesta: ${response.status} - ${errorText}`, 'error');
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        Swal.fire('Error', 'Error de red al intentar eliminar la encuesta.', 'error');
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      style={{
        width: "600px",
        display: "flex",
        alignItems: "center",
        padding: "15px",
        cursor: isFuture ? "default" : "pointer",
      }}
    >
      {/* Imagen */}
      <img 
        src={imageSrc} 
        alt="Encuesta ilustrativa" 
        style={{ width: "300px", borderRadius: "8px", marginRight: "15px" }}
        onClick={handleClick}
      />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {/* Encabezado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <h2 style={{
            fontSize: "16px", 
            margin: 0, 
            cursor: isFuture ? "default" : "pointer",
            color: isFuture ? "#A9A9A9" : "inherit"
          }} onClick={handleClick}>{title}</h2>
          {userType === 'Administrador' && (
            <i 
              className="fas fa-ellipsis-v" 
              style={{ cursor: "pointer", color: "#555" , marginLeft:"10px"}}
              onClick={handleToggleMenu}
            ></i>
          )}
          {showMenu && userType === 'Administrador' && (
            <div 
              ref={menuRef} 
              style={{
                position: "absolute",
                top: "25px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                padding: "5px 0",
                minWidth: "120px",
                transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                opacity: showMenu ? 1 : 0,
                transform: showMenu ? "scale(1)" : "scale(0.95)",
                transformOrigin: "top right",
              }}
            >
              <div 
                style={{
                  padding: "8px 15px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                onClick={handleDelete}
              >
                Eliminar
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        {isFuture && inicio ? (
          <p style={{ fontSize: "14px", color: "#A9A9A9", marginBottom: "10px" }}>Activa el {inicio.toLocaleDateString()}</p>
        ) : (
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>Creada el {createdAt}</p>
        )}
      </div>
    </div>
  );
};

export default EncuestaCard;
