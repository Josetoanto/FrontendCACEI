import Evaluar from "./Evaluar";

interface ProyectoEvaluadoProps {
  nombreProyecto: string;
  estudiante: string;
  evaluador: string;
  puntuacion: number;
  fechaDeSubida: string;
  id: number;
}



const ProyectoNoEvaluado: React.FC<ProyectoEvaluadoProps> = ({ id, nombreProyecto, estudiante, fechaDeSubida }) => {
  return (
    <tr style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
      <td style={{ padding: "10px" }}>{nombreProyecto}</td>
      <td style={{ color:"#61788a", padding: "10px" }}>{estudiante}</td>
      <td style={{ color:"#61788a",  padding: "10px" }}>{fechaDeSubida}</td>
      <td style={{ padding: "10px" }}><Evaluar projectId={id}></Evaluar></td>
    </tr>
  );
};

export default ProyectoNoEvaluado;
