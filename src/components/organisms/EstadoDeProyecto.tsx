import ProjectCard from "../molecule/ProjectCard";
import { Link } from 'react-router-dom';

// Definir la interfaz para las props
interface EstadoDeProyectoProps {
  evidenciasCount: number;
  evaluationsCount: number | string; // Aceptar number o string
  uploadDate: string;
  projectStatus: string;
  projectStatusDescription?: string; // Nueva prop opcional para la descripción del estado
  evaluatorId?: string | null; // Nueva prop opcional para el ID del evaluador
}

// Actualizar la definición del componente para aceptar las props
const EstadoDeProyecto: React.FC<EstadoDeProyectoProps> = ({ evidenciasCount, evaluationsCount, uploadDate, projectStatus, projectStatusDescription, evaluatorId }) => {
  const isReviewedStatus = projectStatus.includes("Revisado por");

  let finalProjectStatusTitle: string | React.ReactNode = projectStatus;

  if (isReviewedStatus && evaluatorId) {
    const parts = projectStatus.split("Revisado por ");
    if (parts.length > 1) {
      const evaluatorName = parts[1];
      finalProjectStatusTitle = (
        <>
          Revisado por <Link to={`/perfil/${evaluatorId}`} style={{ textDecoration: 'none', color: '#007bff' }}>
            {evaluatorName}
          </Link>
        </>
      );
    }
  }

  return (
    <div style={{
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      paddingTop: "20px"
    }}>
      {/* Usar datos dinámicos en ProjectCard */}
      <ProjectCard iconClass="fas fa-folder-open" title={`${evidenciasCount} Evidencias`} value="Evidencias de proyectos" />
      <ProjectCard iconClass="fas fa-user-check" title={`${evaluationsCount} Evaluaciones`} value={`Este proyecto ha sido revisado ${evaluationsCount} veces`} />
      <ProjectCard iconClass="fas fa-calendar-alt" title={`Subido el ${uploadDate}`} value="Fecha de subida del proyecto" />
      
      <ProjectCard iconClass="fas fa-check-circle" title={finalProjectStatusTitle} value={projectStatusDescription || "Estado actual del proyecto"} />
    </div>
  );
};

export default EstadoDeProyecto;
