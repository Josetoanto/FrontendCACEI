import ProjectCard from "../molecule/ProjectCard";

// Definir la interfaz para las props
interface EstadoDeProyectoProps {
  evidenciasCount: number;
  evaluationsCount: number | string; // Aceptar number o string
  uploadDate: string;
  projectStatus: string;
}

// Actualizar la definición del componente para aceptar las props
const EstadoDeProyecto: React.FC<EstadoDeProyectoProps> = ({ evidenciasCount, evaluationsCount, uploadDate, projectStatus }) => {
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
      <ProjectCard iconClass="fas fa-check-circle" title={projectStatus} value="Estado actual del proyecto" />
    </div>
  );
};

export default EstadoDeProyecto;
