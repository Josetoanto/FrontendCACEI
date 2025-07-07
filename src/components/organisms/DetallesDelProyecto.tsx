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

    // Estado para almacenar enlaces de evidencias tipo URL
    const [evidenceLinks, setEvidenceLinks] = useState<{ url: string; descripcion: string; filename?: string }[]>([]);

    // Efecto para crear y revocar URLs de Blob
    useEffect(() => {
        const urls = evidenceFiles.map(item => {
            if (item.archivo?.data && Array.isArray(item.archivo.data)) {
                try {
                    const byteArray = new Uint8Array(item.archivo.data);
                    const blob = new Blob([byteArray], { type: item.mime_type });
                    const url = URL.createObjectURL(blob);
                    return { url, filename: item.filename, mime_type: item.mime_type };
                } catch (error) {
                    console.error("Error creating Blob URL for evidence:", item.filename, error);
                    return null;
                }
            } else {
                return null;
            }
        }).filter(urlItem => urlItem !== null);
        setEvidenceUrls(urls as any);
        // Extraer evidencias tipo URL
        const links = evidenceFiles.filter(item => item.github_url).map(item => ({
            url: item.github_url,
            descripcion: item.descripcion || 'Evidencia URL',
            filename: item.filename
        }));
        setEvidenceLinks(links);
        return () => {
            urls.forEach(urlItem => {
                if (urlItem) {
                    URL.revokeObjectURL(urlItem.url);
                }
            });
        };
    }, [evidenceFiles]);

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
            {/* Evidencias tipo archivo */}
            {evidenceUrls.map((item, index) => (
              <div key={index} style={{textAlign: "left"}}>
                {item.mime_type.startsWith('image/') ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px", color: "#007bff", textDecoration: "none" }}>
                    {item.filename || 'Imagen'} (ver imagen)
                  </a>
                ) : (
                  <a href={item.url} download={item.filename} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "16px", color: "#007bff", textDecoration: "none" }}>
                    {item.filename || 'Archivo'}
                  </a>
                )}
              </div>
            ))}
            {/* Evidencias tipo URL */}
            {evidenceLinks.map((item, idx) => {
              let url = item.url;
              if (url && !/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
              }
              return (
                <div key={"url-"+idx} style={{textAlign: "left"}}>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px", color: "#007bff", textDecoration: "none" }}>
                    {item.filename || item.descripcion || 'Evidencia URL'}
                  </a>
                </div>
              );
            })}
            {evidenceUrls.length === 0 && evidenceLinks.length === 0 && (
              <span style={{color:"#61788A"}}>No hay evidencias disponibles.</span>
            )}
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
  
