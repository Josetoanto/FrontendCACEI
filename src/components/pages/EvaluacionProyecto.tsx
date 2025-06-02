import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DescripcionProyecto from "../atoms/DescripcionProyecto";
import DetallesPresentacion from "../molecule/DetallesPresentacion";
import Header from "../organisms/Header";
import RubricaPresentacion from "../organisms/RubricaPresentacion";

const EvaluacionProyecto: React.FC = () => {
    const { evaluationId } = useParams<{ evaluationId: string }>();
    const navigate = useNavigate();
    const [projectTitle, setProjectTitle] = useState("Cargando título...");
    const [projectDescription, setProjectDescription] = useState("Cargando descripción...");
    const [presenterName, setPresenterName] = useState("Cargando presentador...");
    const [projectDate, setProjectDate] = useState("Cargando fecha...");
    const [evidenceFiles, setEvidenceFiles] = useState<any[]>([]);
    const [evidenceUrls, setEvidenceUrls] = useState<{ url: string; filename: string; mime_type: string }[]>([]);
    const [comentarioGeneral, setComentarioGeneral] = useState('');
    const [rubricasEvaluadas, setRubricasEvaluadas] = useState<{ criterio_id: number; puntuacion: number | null }[]>([]);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const fetchProjectAndUserData = async () => {
            if (!evaluationId) {
                console.error("No se encontró el ID de evaluación en la URL.");
                return;
            }

            try {
                const token = localStorage.getItem('userToken');
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                };

                // Fetch project data
                const projectResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/projects/${evaluationId}`, {
                    headers: headers,
                });
                if (!projectResponse.ok) {
                    throw new Error(`HTTP error! status: ${projectResponse.status}`);
                }
                const projectData = await projectResponse.json();
                setProjectTitle(projectData.titulo);
                setProjectDescription(projectData.descripcion);
                
                // Formatear la fecha de actualización para la presentación
                if (projectData.actualizado_en) {
                    const date = new Date(projectData.actualizado_en);
                    const formattedDate = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                    setProjectDate(formattedDate);
                }

                // Fetch evidence data using projectData.id
                const evidenceResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/evidences/project/${projectData.id}`, {
                    headers: headers,
                });
                if (!evidenceResponse.ok) {
                    throw new Error(`HTTP error! status: ${evidenceResponse.status}`);
                }
                const evidenceData = await evidenceResponse.json();
                setEvidenceFiles(evidenceData || []);

                // Fetch user data using egresado_id from project data
                const userResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/users/${projectData.egresado_id}`, {
                    headers: headers,
                });
                if (!userResponse.ok) {
                    throw new Error(`HTTP error! status: ${userResponse.status}`);
                }
                const userData = await userResponse.json();
                setPresenterName(userData.nombre);

            } catch (error) {
                console.error("Error fetching data:", error);
                setProjectTitle("Error al cargar título");
                setProjectDescription("Error al cargar descripción");
                setPresenterName("Error al cargar presentador");
            }
        };

        fetchProjectAndUserData();
    }, [evaluationId]);

    // Efecto para crear y revocar URLs de Blob para la evidencia
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
                console.warn("Evidence data missing or invalid format:", item.filename);
                return null;
            }
        }).filter(urlItem => urlItem !== null);

        setEvidenceUrls(urls as any);

        return () => {
            urls.forEach(urlItem => {
                 if (urlItem) {
                     URL.revokeObjectURL(urlItem.url);
                 }
            });
        };
    }, [evidenceFiles]);

    const handleRubricasChange = (evaluadas: { criterio_id: number; puntuacion: number | null }[]) => {
      setRubricasEvaluadas(evaluadas);
    };

    useEffect(() => {
      const hasRubricas = rubricasEvaluadas.length > 0;
      const allRubricasFilled = rubricasEvaluadas.every(rubrica => 
        rubrica.puntuacion !== null && rubrica.puntuacion >= 1 && rubrica.puntuacion <= 100
      );
      setIsFormValid(hasRubricas && allRubricasFilled);
    }, [rubricasEvaluadas]);

    const handleEnviarReporte = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        Swal.fire('Error', 'No se encontró el token de usuario. Por favor, inicia sesión de nuevo.', 'error');
        return;
      }

      if (!evaluationId) {
        Swal.fire('Error', 'No se encontró el ID del proyecto.', 'error');
        return;
      }

      // Prepara los criterios para el envío
      const criteriosParaEnvio = rubricasEvaluadas.map(r => ({
        criterio_id: r.criterio_id,
        puntuacion: r.puntuacion !== null ? r.puntuacion : 0, // Si la puntuación es nula, se envía 0
        comentario: comentarioGeneral // Se usa el comentario general para todos los criterios
      }));

      const body = {
        proyecto_id: parseInt(evaluationId), // Usamos evaluationId como projectId
        criterios: criteriosParaEnvio
      };

      try {
        const response = await fetch('https://gcl58kpp-8000.use2.devtunnels.ms/evaluations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al enviar el reporte: ${response.status} - ${errorText}`);
        }

        Swal.fire('Éxito', 'Reporte enviado con éxito.', 'success');
        navigate('/evaluador');
      } catch (error: any) {
        console.error("Error al enviar el reporte:", error);
        Swal.fire('Error', `Error: ${error.message}`, 'error');
      }
    };

    return (
      <div style={{textAlign:"center", flex:"1"}}>
        <Header></Header>
        <div style={{maxWidth:"800px", margin: "0 auto"}}>
        <h3 style={{textAlign:"left", fontWeight:"lighter", color:"#61788A"}}>Evaluacion de proyecto</h3>
        <h1 style={{textAlign:"left"}}>Revision de proyecto "{projectTitle}"</h1>
        <DetallesPresentacion
      datos={[
        { etiqueta: "Presentador", valor: presenterName },
        { etiqueta: "Fecha de presentación", valor: projectDate },
        { etiqueta: "Evidencia", 
          valor: (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {evidenceUrls.length > 0 ? (
                evidenceUrls.map((item, index) => (
                  <div key={index} style={{textAlign: "right"}}>
                    {item.mime_type.startsWith('image/') ? (
                      <img src={item.url} alt={item.filename} style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                      <a href={item.url} download={item.filename} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "16px", color: "#007bff", textDecoration: "none", display: "block" }}>
                        {item.filename}
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <span style={{color:"#61788A"}}>No hay evidencias disponibles.</span>
              )}
            </div>
          )
        }
      ]} />
      <DescripcionProyecto descripcion={projectDescription} />

      
      <RubricaPresentacion onRubricasChange={handleRubricasChange} />    
      <h3 style={{fontSize:"16px", textAlign:"left"}}>Comentario</h3>
      <input 
        style={{borderRadius:"6px", width:"100%", border:"1px solid #61788A", height:"25px"}}
        value={comentarioGeneral}
        onChange={(e) => setComentarioGeneral(e.target.value)}
      />
      <button
        onClick={handleEnviarReporte}
        style={{
          backgroundColor: "#f0f2f5",
          borderRadius: "12px",
          border: "none",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
          marginTop:"12px",
          fontWeight:"lighter",
          marginBottom:"25px"
        }}
        disabled={!isFormValid}
      >
        Enviar reporte
      </button>
        </div>
      </div>
    );
  };
  
export default EvaluacionProyecto;
  