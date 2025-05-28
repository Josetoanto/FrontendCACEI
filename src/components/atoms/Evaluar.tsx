import { useNavigate } from "react-router-dom";

const Evaluar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate("/evaluar")}
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
