import AgregarProyectoBoton from "../atoms/AgregarProyectoBoton";
import Proyecto from "../molecule/Proyecto";
import React, { useState } from 'react';

interface ListaDeProyectosProps {
  titulo: string;
  proyectos: { nombre: string; fecha: string; id: number }[];
  onDelete: (id: number) => void;
}

const ListaDeProyectos: React.FC<ListaDeProyectosProps> = ({ titulo, proyectos, onDelete }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleToggleMenu = (id: number | null) => {
    setOpenMenuId(id);
  };

  return (
    <div style={{
      margin: "auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
    }}>
      <h2 style={{ textAlign: "left", marginBottom: "15px" }}>{titulo}</h2>
      
      {/* Lista de proyectos o mensaje de no hay proyectos */}
      {proyectos.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {proyectos.map((proyecto, index) => (
            <Proyecto 
              key={proyecto.id}
              nombre={proyecto.nombre} 
              fecha={proyecto.fecha} 
              id={proyecto.id} 
              onDelete={onDelete}
              isOpen={proyecto.id === openMenuId}
              onToggleMenu={handleToggleMenu}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666', marginBottom: '20px' }}>No hay proyectos disponibles en este momento.</p>
      )}
      
      <AgregarProyectoBoton></AgregarProyectoBoton>
    </div>
  );
};

export default ListaDeProyectos;
