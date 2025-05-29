import Habilidad from "../atoms/Habilidad";
import React from 'react';

interface ListaDeHabilidadesProps {
  habilidades: string[];
  isEditing?: boolean;
  setHabilidades?: React.Dispatch<React.SetStateAction<string[]>>;
}

// const habilidades = ["Diseñador", "Programador", "React", "Java", "Python", "AWS"]; // Remove hardcoded data

const ListaDeHabilidades: React.FC<ListaDeHabilidadesProps> = ({ habilidades, isEditing }) => {
  const showList = !isEditing;

  return (
    <div style={{
      padding: "20px",
      paddingTop: "1px",
      paddingBottom: "4px"
    }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Habilidades</h2>
      
      {showList ? (
        <div style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "left",
          paddingLeft: "15px"
        }}>
          {habilidades.map((item, index) => (
            <Habilidad key={index} habilidad={item} />
          ))}
        </div>    
      ) : (
        <div style={{ paddingLeft: "15px" }}>Modo edición de Habilidades (funcionalidad no habilitada aquí)...</div>
      )}
    </div>
  );
};

export default ListaDeHabilidades;
