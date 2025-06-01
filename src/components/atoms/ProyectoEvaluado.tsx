import { useNavigate } from "react-router-dom";

interface ProyectoEvaluadoProps {
  evaluation: {
    id: number;
    projectName: string;
    studentName: string;
    evaluatorName: string;
    averageEvaluationScore: number;
    proyecto_id: number;
  };
}

const ProyectoEvaluado: React.FC<ProyectoEvaluadoProps> = ({ evaluation }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/revision/proyecto/${evaluation.proyecto_id}/evaluacion/${evaluation.id}`);
  };

  return (
    <tr style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
      <td style={{ padding: "10px" }}>{evaluation.projectName}</td>
      <td style={{ color:"#61788a", padding: "10px" }}>{evaluation.studentName}</td>
      <td style={{ color:"#61788a",  padding: "10px" }}>{evaluation.evaluatorName}</td>
      <td  ><div  style={{ margin: "10px",borderRadius:"12px", backgroundColor:"#f0f2f5", padding: "10px" }}>{evaluation.averageEvaluationScore}/100</div></td>
      <td style={{ padding: "10px" }}>
        <button 
          onClick={handleViewClick}
          style={{
            backgroundColor: "transparent",
            color: "#61788a",
            fontSize:"16px",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ver
        </button>
      </td>
    </tr>
  );
};

export default ProyectoEvaluado;
