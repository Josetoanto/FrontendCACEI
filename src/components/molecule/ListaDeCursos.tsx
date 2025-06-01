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
  linkedinUrl?: string;
}

// const cursos = [...]; // Remove hardcoded data

const ListaDeCursos: React.FC<ListaDeCursosProps> = ({ cursos, isEditing, linkedinUrl }) => {
  return (
    <div style={{
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      paddingBottom: "0px",
      paddingTop: "0px"
    }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>LinkedIn</h2>

      {isEditing ? (
        // Placeholder for editing component
        <div style={{ paddingLeft: "15px" }}>Modo edición de Cursos (no aplica a LinkedIn)...</div>
      ) : (
        linkedinUrl ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "15px"
          }}>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px", color: "#007bff", textDecoration: "none" }}>
              {linkedinUrl}
            </a>
          </div>
        ) : (
          <div style={{ paddingLeft: "15px", color: "#777" }}>No se ha proporcionado un enlace de LinkedIn.</div>
        )
      )}
    </div>
  );
};

export default ListaDeCursos;
