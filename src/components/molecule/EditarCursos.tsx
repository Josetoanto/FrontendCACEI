import React from 'react';


interface EditarCursosProps {
  linkedinUrl: string;
  setLinkedinUrl: React.Dispatch<React.SetStateAction<string>>;
}

const EditarCursos: React.FC<EditarCursosProps> = ({ linkedinUrl, setLinkedinUrl }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedinUrl(e.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "15px" }}>Editar Link de LinkedIn</h3>
      
      {/* No hay lista de elementos para eliminar, solo un único campo de edición */}

      {/* Formulario para editar el enlace de LinkedIn */}
      <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
        <h4 style={{ marginBottom: "10px" }}>Enlace de LinkedIn</h4>
        <input
          type="text"
          name="linkedinUrl"
          placeholder="URL de LinkedIn"
          value={linkedinUrl}
          onChange={handleInputChange}
          style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        {/* El botón de guardar se manejará desde el componente padre, o se puede agregar aquí si es necesario */}
      </div>

    </div>
  );
};

export default EditarCursos; 