import ProyectoNoEvaluado from "../atoms/ProyectoNoEvaluado";

interface ListaDeProyectosAEvaluarProps {
  proyectos: any[];
}

const ListaDeProyectosAEvaluar: React.FC<ListaDeProyectosAEvaluarProps> = ({ proyectos }) => {
  return (
    <div style={{ margin: "auto", marginBottom:"18px" }}>
      <h2 style={{fontSize: "24px", textAlign: "left", marginBottom: "12px" }}>Evaluaciones de proyectos recientes</h2>
      <table style={{ width: "100%",borderRadius:"12px", borderCollapse: "collapse", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8f8f8", textAlign: "center" }}>
            <th style={{ padding: "10px" }}>Nombre del Proyecto</th>
            <th style={{ padding: "10px" }}>Estudiante</th>
            <th style={{ padding: "10px" }}>Fecha de subida</th>
            <th style={{ padding: "10px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((proyecto, index) => (
            <ProyectoNoEvaluado key={index} {...proyecto} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaDeProyectosAEvaluar;
