import { useNavigate } from "react-router-dom";

interface EvaluarProps {
  projectId: number;
}

const Evaluar: React.FC<EvaluarProps> = ({ projectId }) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(`/evaluar/${projectId}`)}
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
      Evaluar
    </button>
  );
};

export default Evaluar;
