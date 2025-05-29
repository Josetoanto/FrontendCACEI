import Curso from "../atoms/Curso";
import React from 'react';

interface CursoData {
  nombre: string;
  fecha: string;
  url: string;
}

interface ListaDeCursosProps {
  cursos: CursoData[];
  isEditing: boolean;
  setCursos: React.Dispatch<React.SetStateAction<CursoData[]>>;
}

// const cursos = [...]; // Remove hardcoded data

const ListaDeCursos: React.FC<ListaDeCursosProps> = ({ cursos, isEditing }) => {
  return (
    <div style={{
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      paddingBottom: "0px",
      paddingTop: "0px"
    }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Cursos</h2>

      {isEditing ? (
        // Placeholder for editing component
        <div style={{ paddingLeft: "15px" }}>Modo edición de Cursos...</div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          {cursos.map((item, index) => (
            <Curso key={index} nombre={item.nombre} fecha={item.fecha} url={item.url} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaDeCursos;
