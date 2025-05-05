import ProjectCard from "../molecule/ProjectCard";

const EstadoDeProyecto: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      paddingTop: "20px"
    }}>
      <ProjectCard iconClass="fas fa-folder-open" title="3 Evidencias" value="Evidencias de proyectos" />
      <ProjectCard iconClass="fas fa-user-check" title="15 Evaluadores" value="Este proyecto ha sido revisado 15 veces" />
      <ProjectCard iconClass="fas fa-calendar-alt" title="Subido el 16 de Mayo" value="Fecha de subida del proyecto" />
      <ProjectCard iconClass="fas fa-check-circle" title="Finalizado" value="Estado actual del proyecto" />
    </div>
  );
};

export default EstadoDeProyecto;
