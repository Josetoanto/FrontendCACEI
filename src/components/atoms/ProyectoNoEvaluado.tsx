import Evaluar from "./Evaluar";

interface ProyectoEvaluadoProps {
  nombreProyecto: string;
  estudiante: string;
  evaluador: string;
  puntuacion: number;
  fechaDeSubida: string;
  estatus: string;
}



const ProyectoNoEvaluado: React.FC<ProyectoEvaluadoProps> = ({ nombreProyecto, estudiante, fechaDeSubida, estatus }) => {
  return (
    <tr style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
      <td style={{ padding: "10px" }}>{nombreProyecto}</td>
      <td style={{ color:"#61788a", padding: "10px" }}>{estudiante}</td>
      <td style={{ color:"#61788a",  padding: "10px" }}>{fechaDeSubida}</td>
      <td  ><div  style={{ margin: "10px",borderRadius:"12px", backgroundColor:"#f0f2f5", padding: "10px" }}>{estatus}</div></td>
      <td style={{ padding: "10px" }}><Evaluar></Evaluar></td>
    </tr>
  );
};

export default ProyectoNoEvaluado;
