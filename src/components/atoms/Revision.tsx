import { useNavigate } from "react-router-dom";

const Revision: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate("/revision")}
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
  );
};

export default Revision;
