import { useState } from "react";

const FormularioAgregarProyecto: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [evidencias, setEvidencias] = useState<{ titulo: string; descripcion: string; archivo: File | null }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEvidencia = () => {
    setEvidencias([...evidencias, { titulo: "", descripcion: "", archivo: null }]);
  };

  const handleRemoveEvidencia = (index: number) => {
    setEvidencias(evidencias.filter((_, i) => i !== index));
  };

  const handleEvidenciaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newEvidencias = [...evidencias];
    newEvidencias[index] = { ...newEvidencias[index], [e.target.name]: e.target.value };
    setEvidencias(newEvidencias);
  };

  const handleEvidenciaFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newEvidencias = [...evidencias];
    if (e.target.files && e.target.files[0]) {
      newEvidencias[index] = { ...newEvidencias[index], archivo: e.target.files[0] };
    } else {
      newEvidencias[index] = { ...newEvidencias[index], archivo: null };
    }
    setEvidencias(newEvidencias);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
        alert("No autenticado. Por favor, inicia sesión.");
        return;
    }

    // 1. Crear Proyecto
    try {
      const projectApiUrl = 'https://gcl58kpp-8000.use2.devtunnels.ms/projects';
      const projectResponse = await fetch(projectApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.nombre,
          descripcion: formData.descripcion,
        }),
      });

      if (!projectResponse.ok) {
        const errorText = await projectResponse.text();
        alert(`Error al crear el proyecto: ${projectResponse.status} - ${errorText}`);
        return;
      }

      const projectData = await projectResponse.json();
      const projectId = projectData.id; // Obtener el ID del proyecto recién creado

      // 2. Crear Evidencias
      const evidenceApiUrl = 'https://gcl58kpp-8000.use2.devtunnels.ms/evidences';

      for (const evidencia of evidencias) {
        if (!evidencia.archivo) {
          alert("Por favor, adjunta un archivo PDF para todas las evidencias.");
          return; // Detener si falta un archivo en alguna evidencia
        }

        const formDataEvidence = new FormData();
        formDataEvidence.append('proyecto_id', projectId.toString());
        formDataEvidence.append('filename', evidencia.archivo.name);
        formDataEvidence.append('mime_type', evidencia.archivo.type);
        
        let tipoIdForEvidence: string;
        if (evidencia.archivo.type === 'application/pdf') {
          tipoIdForEvidence = '1';
        } else if (evidencia.archivo.type === 'image/jpeg' || evidencia.archivo.type === 'image/jpg') {
          tipoIdForEvidence = '2';
        } else {
          alert(`Tipo de archivo no soportado para la evidencia '${evidencia.titulo || evidencia.archivo.name}'. Solo se permiten PDF e imágenes JPG.`);
          continue; // Saltar esta evidencia y continuar con la siguiente
        }

        formDataEvidence.append('tipo_id', tipoIdForEvidence);
        formDataEvidence.append('archivo', evidencia.archivo); // El archivo PDF
        formDataEvidence.append('descripcion', evidencia.descripcion); // Descripción opcional

        try {
          const evidenceResponse = await fetch(evidenceApiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              // 'Content-Type': 'multipart/form-data' se establece automáticamente por fetch al usar FormData
            },
            body: formDataEvidence,
          });

          if (!evidenceResponse.ok) {
            const errorText = await evidenceResponse.text();
            console.error(`Error al crear evidencia para el proyecto ${projectId}: ${evidenceResponse.status} - ${errorText}`);
            alert(`Error al crear una evidencia: ${evidencia.titulo || evidencia.archivo.name}. Ver consola para más detalles.`);
          } else {
            console.log(`Evidencia '${evidencia.titulo || evidencia.archivo.name}' creada con éxito.`);
          }
        } catch (error) {
          console.error(`Error al conectar con la API para crear evidencia '${evidencia.titulo || evidencia.archivo.name}':`, error);
          alert(`Error al crear la evidencia: ${evidencia.titulo || evidencia.archivo.name}. Por favor, inténtalo de nuevo más tarde.`);
        }
      }

      alert("Proyecto y evidencias creadas con éxito.");
      // Opcional: limpiar el formulario
      setFormData({ nombre: "", descripcion: "" });
      setEvidencias([]); // Limpiar evidencias

    } catch (error) {
      console.error('Error general al procesar el proyecto o las evidencias:', error);
      alert('Error al crear el proyecto o las evidencias. Por favor, inténtalo de nuevo más tarde.');
    }
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
    
        {/* Evidencias */}
        {evidencias.map((evidencia, index) => (
          <div key={index} style={{ border: "1px solid #eee", padding: "15px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#f9f9f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: "0" }}>Evidencia {index + 1}</h3>
              {evidencias.length > 1 && (
                <button type="button" onClick={() => handleRemoveEvidencia(index)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "18px" }}>X</button>
              )}
            </div>

            <p style={{textAlign:"left", fontWeight: "bold", marginBottom: "10px" }}>Título de la Evidencia</p>
            <input 
              type="text"
              name="titulo"
              value={evidencia.titulo}
              onChange={(e) => handleEvidenciaChange(e, index)}
              placeholder="Añade un título a la evidencia"
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff", width: "100%", marginBottom: "5px", boxSizing: "border-box" }}
            />

            <p style={{textAlign:"left", fontWeight: "bold", marginBottom: "10px" }}>Descripción de la Evidencia</p>
            <textarea 
              name="descripcion"
              value={evidencia.descripcion}
              onChange={(e) => handleEvidenciaChange(e, index)}
              placeholder="Añade una descripción de la evidencia breve"
              rows={4}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff", width: "100%", marginBottom: "5px", boxSizing: "border-box" }}
            />

            <p style={{textAlign:"left", fontWeight: "bold", marginBottom: "10px" }}>Adjuntar evidencia (PDF)</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleEvidenciaFileChange(e, index)}
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff", width: "100%", boxSizing: "border-box" }}
            />
            {evidencia.archivo && <p style={{ marginTop: "5px", fontSize: "12px", color: "#555" }}>Archivo seleccionado: {evidencia.archivo.name}</p>}
          </div>
        ))}

        <button 
          type="button" 
          onClick={handleAddEvidencia}
          style={{
            backgroundColor: "#e0e0e0",
            borderRadius: "8px",
            border: "1px solid #ddd",
            padding: "10px",
            cursor: "pointer",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          Añadir Otra Evidencia
        </button>

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
