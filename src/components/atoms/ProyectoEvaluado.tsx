import Revision from "./Revision";

interface ProyectoEvaluadoProps {
  nombreProyecto: string;
  estudiante: string;
  evaluador: string;
  puntuacion: number;
}

const ProyectoEvaluado: React.FC<ProyectoEvaluadoProps> = ({ nombreProyecto, estudiante, evaluador, puntuacion }) => {
  return (
    <tr style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
      <td style={{ padding: "10px" }}>{nombreProyecto}</td>
      <td style={{ color:"#61788a", padding: "10px" }}>{estudiante}</td>
      <td style={{ color:"#61788a",  padding: "10px" }}>{evaluador}</td>
      <td  ><div  style={{ margin: "10px",borderRadius:"12px", backgroundColor:"#f0f2f5", padding: "10px" }}>{puntuacion}/100</div></td>
      <td style={{ padding: "10px" }}><Revision /></td>
    </tr>
  );
};

export default ProyectoEvaluado;
