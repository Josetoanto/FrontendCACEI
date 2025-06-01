import React, { useState, useEffect } from 'react';

interface ProyectoDetallesProps {
    titulo: string;
    descripcion: string;
    evidencia: string[];
    evidenceFiles: any[];
    ultimoComentario: string;
  }
  
  const DetallesDelProyecto: React.FC<ProyectoDetallesProps> = ({ titulo, descripcion, evidenceFiles, ultimoComentario }) => {
    // Estado para almacenar las URLs de Blob
    const [evidenceUrls, setEvidenceUrls] = useState<{
        url: string;
        filename: string;
        mime_type: string;
    }[]>([]);

    // Efecto para crear y revocar URLs de Blob
    useEffect(() => {
        const urls = evidenceFiles.map(item => {
            // Verificar si los datos binarios existen y son un array
            if (item.archivo?.data && Array.isArray(item.archivo.data)) {
                try {
                    // Convertir el array de números a Uint8Array
                    const byteArray = new Uint8Array(item.archivo.data);
                    // Crear un Blob con los datos binarios y el tipo MIME
                    const blob = new Blob([byteArray], { type: item.mime_type });
                    // Crear una URL de objeto para el Blob
                    const url = URL.createObjectURL(blob);
                    return { url, filename: item.filename, mime_type: item.mime_type };
                } catch (error) {
                    console.error("Error creating Blob URL for evidence:", item.filename, error);
                    return null; // Retornar null en caso de error
                }
            } else {
                console.warn("Evidence data missing or invalid format:", item.filename);
                return null; // Retornar null si los datos no están en el formato esperado
            }
        }).filter(urlItem => urlItem !== null); // Filtrar los resultados nulos

        setEvidenceUrls(urls as any); // Actualizar el estado con las URLs generadas

        // Función de limpieza para revocar URLs de Blob
        return () => {
            urls.forEach(urlItem => {
                 if (urlItem) { // Asegurarse de que urlItem no es null
                     URL.revokeObjectURL(urlItem.url);
                 }
            });
        };
    }, [evidenceFiles]); // Re-ejecutar cuando cambien los archivos de evidencia

    return (
      <div style={{
        width: "100%",
        margin: "auto",
        backgroundColor: "transparent"
      }}>
        {/* Título principal */}
        <h1 style={{ textAlign: "left", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
          Detalles del proyecto
        </h1>
        {/* Sección de atributos */}
        <div style={{ display: "grid", gridTemplateColumns: "30% 70%", rowGap: "8x" }}>
                     
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />
          <span style={{color:"#61788A", fontSize: "16px"}}>Título:</span>
          <span style={{fontSize: "16px"}}>{titulo}</span>
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />
          <span style={{color:"#61788A",fontSize: "16px"}}>Descripción:</span>
          <span style={{ fontSize: "16px" }}>{descripcion}</span>
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

          <span style={{color:"#61788A", fontSize: "16px"}}>Evidencia:</span>
          <div>
            {/* Renderizar evidencias binarias */}
            {evidenceUrls.map((item, index) => (
              <div key={index}>
                 {item.mime_type.startsWith('image/') ? (
                     // Mostrar imágenes
                     <img src={item.url} alt={item.filename} style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
                 ) : (
                     // Proporcionar enlace para otros tipos (ej. PDF)
                     <a href={item.url} download={item.filename} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "16px", color: "#007bff", textDecoration: "none", display: "block", marginTop: '10px' }}>
                         Descargar {item.filename}
                     </a>
                 )}
              </div>
            ))}
          </div>          
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

  
          <span style={{color:"#61788A", fontSize: "16px" }}>Último comentario:</span>
          <span style={{fontSize: "16px", fontStyle: "italic", color: "#666" }}>{ultimoComentario}</span>
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

        </div>
      </div>
    );
  };
  
  export default DetallesDelProyecto;
  