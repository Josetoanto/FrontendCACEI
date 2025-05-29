import React, { useState } from 'react';

interface CursoData {
  nombre: string;
  fecha: string;
  url: string;
}

interface EditarCursosProps {
  cursos: CursoData[];
  setCursos: React.Dispatch<React.SetStateAction<CursoData[]>>; // Function to update the courses state
}

const EditarCursos: React.FC<EditarCursosProps> = ({ cursos, setCursos }) => {
  const [newCurso, setNewCurso] = useState<CursoData>({ nombre: '', fecha: '', url: '' });

  const handleAddCurso = () => {
    if (newCurso.nombre && newCurso.fecha && newCurso.url) {
      setCursos(prevCursos => [...prevCursos, newCurso]);
      setNewCurso({ nombre: '', fecha: '', url: '' }); // Clear the input fields
    }
  };

  const handleRemoveCurso = (index: number) => {
    setCursos(prevCursos => prevCursos.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCurso(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "15px" }}>Editar Cursos</h3>
      
      {/* Lista de cursos existentes con opción de eliminar */}
      {cursos.map((curso, index) => (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <div>
            <p style={{ margin: "0", fontWeight: "bold" }}>{curso.nombre}</p>
            <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>{curso.fecha}</p>
            <a href={curso.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "#007bff", textDecoration: "none" }}>Ver curso</a>
          </div>
          <button onClick={() => handleRemoveCurso(index)} style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              cursor: "pointer"
          }}>Eliminar</button>
        </div>
      ))}

      {/* Formulario para agregar nuevo curso */}
      <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <h4 style={{ marginBottom: "10px" }}>Agregar Nuevo Curso</h4>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del curso"
          value={newCurso.nombre}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <input
          type="text"
          name="fecha"
          placeholder="Fecha"
          value={newCurso.fecha}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
         <input
          type="text"
          name="url"
          placeholder="URL del curso"
          value={newCurso.url}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <button onClick={handleAddCurso} style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            cursor: "pointer"
        }}>Agregar Curso</button>
      </div>

    </div>
  );
};

export default EditarCursos; 