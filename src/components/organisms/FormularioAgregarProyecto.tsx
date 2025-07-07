import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const FormularioAgregarProyecto: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [evidencias, setEvidencias] = useState<{ titulo: string; descripcion: string; archivo: File | null; github_url: string; tipo: 'archivo' | 'url' }[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEvidencia = () => {
    setEvidencias([...evidencias, { titulo: "", descripcion: "", archivo: null, github_url: "", tipo: 'archivo' }]);
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

  const handleEvidenciaTipoChange = (index: number, tipo: 'archivo' | 'url') => {
    const newEvidencias = [...evidencias];
    newEvidencias[index].tipo = tipo;
    // Limpiar campos no usados
    if (tipo === 'archivo') {
      newEvidencias[index].github_url = "";
    } else {
      newEvidencias[index].archivo = null;
    }
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
        Swal.fire({
          icon: 'warning',
          title: 'No autenticado',
          text: 'Por favor, inicia sesión para continuar.',
        });
        return;
    }

    // 1. Crear Proyecto
    try {
      const projectApiUrl = 'http://188.68.59.176:8000/projects';
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
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el proyecto',
          text: `Error: ${projectResponse.status} - ${errorText}`,
        });
        return;
      }

      const projectData = await projectResponse.json();
      const projectId = projectData.id; // Obtener el ID del proyecto recién creado

      // 2. Crear Evidencias
      const evidenceApiUrl = 'http://188.68.59.176:8000/evidences';

      for (const evidencia of evidencias) {
        if (evidencia.tipo === 'archivo') {
          if (!evidencia.archivo) {
            Swal.fire({
              icon: 'warning',
              title: 'Archivos requeridos',
              text: 'Por favor, adjunta un archivo PDF o imagen para todas las evidencias tipo archivo.',
            });
            return;
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
            Swal.fire({
              icon: 'error',
              title: 'Tipo de archivo no soportado',
              text: `El tipo de archivo para la evidencia '${evidencia.titulo || evidencia.archivo.name}' no es soportado. Solo se permiten PDF e imágenes JPG.`,
            });
            continue;
          }
          formDataEvidence.append('tipo_id', tipoIdForEvidence);
          formDataEvidence.append('archivo', evidencia.archivo);
          formDataEvidence.append('descripcion', evidencia.descripcion);
          try {
            const evidenceResponse = await fetch(evidenceApiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${userToken}`,
              },
              body: formDataEvidence,
            });
            if (!evidenceResponse.ok) {
              const errorText = await evidenceResponse.text();
              console.error(`Error al crear evidencia para el proyecto ${projectId}: ${evidenceResponse.status} - ${errorText}`);
              Swal.fire({
                icon: 'error',
                title: 'Error al crear evidencia',
                text: `Error al crear la evidencia: ${evidencia.titulo || evidencia.archivo.name}. Por favor, revisa la consola para más detalles.`,
              });
            } else {
              console.log(`Evidencia '${evidencia.titulo || evidencia.archivo.name}' creada con éxito.`);
            }
          } catch (error) {
            console.error(`Error al conectar con la API para crear evidencia '${evidencia.titulo || evidencia.archivo.name}':`, error);
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: `Error al conectar con la API para crear la evidencia: ${evidencia.titulo || evidencia.archivo.name}. Por favor, inténtalo de nuevo más tarde.`,
            });
          }
        } else if (evidencia.tipo === 'url') {
          if (!evidencia.github_url) {
            Swal.fire({
              icon: 'warning',
              title: 'URL requerida',
              text: 'Por favor, ingresa una URL para todas las evidencias tipo URL.',
            });
            return;
          }
          const formDataEvidence = new FormData();
          formDataEvidence.append('proyecto_id', projectId.toString());
          formDataEvidence.append('tipo_id', '4'); // Tipo 4 para URL
          formDataEvidence.append('descripcion', evidencia.descripcion);
          formDataEvidence.append('github_url', evidencia.github_url);
          try {
            const evidenceResponse = await fetch(evidenceApiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${userToken}`,
              },
              body: formDataEvidence,
            });
            if (!evidenceResponse.ok) {
              const errorText = await evidenceResponse.text();
              console.error(`Error al crear evidencia URL para el proyecto ${projectId}: ${evidenceResponse.status} - ${errorText}`);
              Swal.fire({
                icon: 'error',
                title: 'Error al crear evidencia URL',
                text: `Error al crear la evidencia URL: ${evidencia.titulo}. Por favor, revisa la consola para más detalles.`,
              });
            } else {
              console.log(`Evidencia URL '${evidencia.github_url}' creada con éxito.`);
            }
          } catch (error) {
            console.error(`Error al conectar con la API para crear evidencia URL '${evidencia.github_url}':`, error);
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: `Error al conectar con la API para crear la evidencia URL: ${evidencia.github_url}. Por favor, inténtalo de nuevo más tarde.`,
            });
          }
        }
      }

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Proyecto y evidencias creadas con éxito.',
      });
      // Opcional: limpiar el formulario
      setFormData({ nombre: "", descripcion: "" });
      setEvidencias([]); // Limpiar evidencias
      navigate('/egresado'); // Redirigir al usuario

    } catch (error) {
      console.error('Error general al procesar el proyecto o las evidencias:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error general',
        text: 'Error al crear el proyecto o las evidencias. Por favor, inténtalo de nuevo más tarde.',
      });
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
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  name={`tipo_${index}`}
                  checked={evidencia.tipo === 'archivo'}
                  onChange={() => handleEvidenciaTipoChange(index, 'archivo')}
                /> Archivo (PDF/JPG)
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name={`tipo_${index}`}
                  checked={evidencia.tipo === 'url'}
                  onChange={() => handleEvidenciaTipoChange(index, 'url')}
                /> URL (GitHub u otro)
              </label>
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
            {evidencia.tipo === 'archivo' && (
              <>
                <p style={{textAlign:"left", fontWeight: "bold", marginBottom: "10px" }}>Adjuntar evidencia (PDF/JPG)</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={(e) => handleEvidenciaFileChange(e, index)}
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff", width: "100%", boxSizing: "border-box" }}
                />
                {evidencia.archivo && <p style={{ marginTop: "5px", fontSize: "12px", color: "#555" }}>Archivo seleccionado: {evidencia.archivo.name}</p>}
              </>
            )}
            {evidencia.tipo === 'url' && (
              <>
                <p style={{textAlign:"left", fontWeight: "bold", marginBottom: "10px" }}>URL de la Evidencia (GitHub u otro)</p>
                <input
                  type="text"
                  name="github_url"
                  value={evidencia.github_url}
                  onChange={(e) => handleEvidenciaChange(e, index)}
                  placeholder="https://github.com/usuario/repositorio"
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff", width: "100%", marginBottom: "5px", boxSizing: "border-box" }}
                />
              </>
            )}
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
          Añadir evidencia
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
