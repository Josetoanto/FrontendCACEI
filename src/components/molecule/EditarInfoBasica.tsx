import React, { useState } from 'react';

interface EditarInfoBasicaProps {
  initialData: {
    nombre: string;
    profesion: string;
    ubicacion: string;
    descripcion: string;
    fotoPerfil: string;
  };
  onCancel: () => void;
  onBasicInfoChange: (newData: { nombre: string; ubicacion: string; descripcion: string; fotoPerfil: string; }) => void;
}

const EditarInfoBasica: React.FC<EditarInfoBasicaProps> = ({ initialData, onBasicInfoChange }) => {
  const [formData, setFormData] = useState({
      nombre: initialData.nombre,
      ubicacion: initialData.ubicacion,
      descripcion: initialData.descripcion,
      fotoPerfil: initialData.fotoPerfil,
  });
  const [fotoPerfilError, setFotoPerfilError] = useState<string>("");

  const validateImageUrl = (url: string) => {
    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "fotoPerfil") {
      if (value && !validateImageUrl(value)) {
        setFotoPerfilError("La URL debe ser de una imagen válida (.jpg, .jpeg, .png, .gif, .webp)");
      } else {
        setFotoPerfilError("");
      }
    }
    setFormData(prevData => {
        const updatedData = { ...prevData, [name]: value };
        onBasicInfoChange(updatedData);
        return updatedData;
    });
  };

  

  return (
    <div style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
    }}>
      <h3 style={{ marginBottom: "15px" }}>Editar Información Básica</h3>
      
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
        {/* La profesión se obtiene del último puesto de trabajo y no se edita aquí */}
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Número de teléfono:</label>
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
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>URL de foto de perfil:</label>
        <input
          type="text"
          name="fotoPerfil"
          value={formData.fotoPerfil}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        {fotoPerfilError && (
          <span style={{ color: 'red', fontSize: '13px' }}>{fotoPerfilError}</span>
        )}
      </div>
      {/* Botones de guardar y cancelar movidos al componente padre PerfilDeUsuario */}
    </div>
  );
};

export default EditarInfoBasica; 
