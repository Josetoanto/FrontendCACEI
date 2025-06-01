import React, { useState } from 'react';

interface EditarEducacionProps {
  initialData: {
    institucion: string;
    fecha: string;
  };
  onSave: (newData: EditarEducacionProps['initialData']) => void;
  onCancel: () => void;
}

const EditarEducacion: React.FC<EditarEducacionProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    onSave({ ...formData, [name]: value });
  };

  return (
    <div style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
    }}>
      <h3 style={{ marginBottom: "15px" }}>Editar Educación</h3>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Institución:</label>
        <input
          type="text"
          name="institucion"
          value={formData.institucion}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Fecha:</label>
        <input
          type="text"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
      </div>
    </div>
  );
};

export default EditarEducacion; 