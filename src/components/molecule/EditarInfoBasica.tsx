import React, { useState } from 'react';

interface EditarInfoBasicaProps {
  initialData: {
    nombre: string;
    profesion: string;
    ubicacion: string;
    descripcion: string;
  };
  onSave: (newData: EditarInfoBasicaProps['initialData']) => void;
  onCancel: () => void;
}

const EditarInfoBasica: React.FC<EditarInfoBasicaProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
    }}>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Profesión:</label>
        <input
          type="text"
          name="profesion"
          value={formData.profesion}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Ubicación:</label>
        <input
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
      </div>
       <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minHeight: "100px" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button type="button" onClick={onCancel} style={{
            backgroundColor: "#ccc",
            color: "#000",
            borderRadius: "5px",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer"
        }}>
          Cancelar
        </button>
        <button type="submit" style={{
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer"
        }}>
          Guardar
        </button>
      </div>
    </form>
  );
};

export default EditarInfoBasica; 