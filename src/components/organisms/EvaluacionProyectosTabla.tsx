import ProyectoEvaluado from "../atoms/ProyectoEvaluado";

// Definir la interfaz para las props, incluyendo evaluationsData
interface EvaluacionProyectosTablaProps {
  evaluationsData: any[]; // Usamos any[] por ahora, idealmente sería un tipo más específico basado en la estructura combinada
}

// Eliminar datos estáticos
// const proyectos = [
//   { nombreProyecto: "Plataforma E-Commerce", estudiante: "Liam Carter", evaluador: "Sophia Walker", puntuacion: 88 },
//   // ... otros proyectos estáticos
// ];

// Actualizar la definición del componente para aceptar evaluationsData
const EvaluacionProyectosTabla: React.FC<EvaluacionProyectosTablaProps> = ({ evaluationsData }) => {
  return (
    <div style={{ margin: "auto", marginBottom:"18px" }}>
      <h2 style={{fontSize: "24px", textAlign: "left", marginBottom: "12px" }}>Evaluaciones mas recientes</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f8f8", textAlign: "center" }}>
            <th style={{ padding: "10px" }}>Nombre del Proyecto</th>
            <th style={{ padding: "10px" }}>Estudiante</th>
            <th style={{ padding: "10px" }}>Evaluador</th>
            <th style={{ padding: "10px" }}>Puntuación</th>
            <th style={{ padding: "10px" }}>Revisión</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapear sobre evaluationsData y pasar cada evaluación enriquecida a ProyectoEvaluado */}
          {evaluationsData.map((evaluation: any) => (
            <ProyectoEvaluado key={evaluation.id} evaluation={evaluation} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluacionProyectosTabla;
