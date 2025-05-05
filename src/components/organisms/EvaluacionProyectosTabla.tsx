import ProyectoEvaluado from "../atoms/ProyectoEvaluado";

const proyectos = [
  { nombreProyecto: "Plataforma E-Commerce", estudiante: "Liam Carter", evaluador: "Sophia Walker", puntuacion: 88 },
  { nombreProyecto: "App de celular", estudiante: "Chloe Davis", evaluador: "Ethan Wright", puntuacion: 92 },
  { nombreProyecto: "Social Media Dashboard", estudiante: "Noah Taylor", evaluador: "Isabella Bennett", puntuacion: 76 },
  { nombreProyecto: "Data Analytics Tool", estudiante: "Mia Evans", evaluador: "Jackson Lewis", puntuacion: 85 },
  { nombreProyecto: "AI-Powered Chatbot", estudiante: "Oliver Robinson", evaluador: "Grace Hill", puntuacion: 90 }
];

const EvaluacionProyectosTabla: React.FC = () => {
  return (
    <div style={{ margin: "auto", marginBottom:"18px" }}>
      <h2 style={{fontSize: "24px", textAlign: "left", marginBottom: "12px" }}>Evaluaciones de proyectos recientes</h2>
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
          {proyectos.map((proyecto, index) => (
            <ProyectoEvaluado key={index} {...proyecto} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluacionProyectosTabla;
