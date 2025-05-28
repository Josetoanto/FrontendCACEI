import { useState } from "react";

const FormularioAgregarProyecto: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    estado: "En proceso",
    formato: "PDF",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Proyecto agregado:", formData);
  };

  return (
    <div style={{
      maxWidth: "750px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "transparent",
      
      borderRadius: "12px"
    }}>
      <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "22px" }}>Agregar Nuevo Proyecto</h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label style={{ textAlign:"left", fontWeight: "bold" }}>Nombre del Proyecto</label>
        <input 
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingrese el nombre"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff" }}
        />

        <label style={{textAlign:"left", fontWeight: "bold" }}>Descripción</label>
        <textarea 
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Ingrese una breve descripción"
          rows={4}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff" }}
        />
    

        <label style={{ textAlign:"left",fontWeight: "bold" }}>Estado del proyecto</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, estado: "En proceso" })}
            style={{
              backgroundColor: formData.estado === "En proceso" ? "#d0d0d0" : "#f0f2f5",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            En proceso
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, estado: "Finalizado" })}
            style={{
              backgroundColor: formData.estado === "Finalizado" ? "#d0d0d0" : "#f0f2f5",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Finalizado
          </button>
        </div>

        <label style={{textAlign:"left", fontWeight: "bold" }}>Evidencia</label>
        <input 
          type="text"
          name="tituloEvidencia"
          placeholder="Añade un título a la evidencia"
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff" }}
        />

        <label style={{textAlign:"left", fontWeight: "bold" }}>Descripción</label>
        <textarea 
          name="descripcionEvidencia"
          placeholder="Añade una descripción de la evidencia breve"
          rows={4}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff" }}
        />

        <label style={{textAlign:"left", fontWeight: "bold" }}>Formato de evidencia</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, formato: "PDF" })}
            style={{
              backgroundColor: formData.formato === "PDF" ? "#d0d0d0" : "#f0f2f5",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            PDF
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, formato: "Imagen" })}
            style={{
              backgroundColor: formData.formato === "Imagen" ? "#d0d0d0" : "#f0f2f5",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Imagen
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, formato: "URL" })}
            style={{
              backgroundColor: formData.formato === "URL" ? "#d0d0d0" : "#f0f2f5",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            URL
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({ ...formData, formato: "Video" })}
            style={{
              backgroundColor: formData.formato === "Video" ? "#d0d0d0" : "#f0f2f5",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Video
          </button>
        </div>

        {/* Botón de agregar */}
        <button 
          type="submit"
          style={{
            backgroundColor: "#f0f2f5",
            borderRadius: "12px",
            border: "none",
            padding: "12px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Agregar Proyecto
        </button>
      </form>
    </div>
  );
};

export default FormularioAgregarProyecto;
