import { useNavigate } from 'react-router-dom';

interface EncuestaCardProps {
  title: string;
  createdAt: string;
  imageSrc: string;
  id: number;
}

const EncuestaCard: React.FC<EncuestaCardProps> = ({ title, createdAt, imageSrc, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/crearEncuesta/${id}`);
  };

  return (
    <div
      style={{
        width: "600px",
        display: "flex",
        alignItems: "center",
        padding: "15px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {/* Imagen */}
      <img 
        src={imageSrc} 
        alt="Encuesta ilustrativa" 
        style={{ width: "300px", borderRadius: "8px", marginRight: "15px" }}
      />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        {/* Encabezado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "16px", margin: 0 }}>{title}</h2>
          <i className="fas fa-ellipsis-v" style={{ cursor: "pointer", color: "#555" , marginLeft:"10px"}}></i>
        </div>

        {/* Contenido */}
        <p style={{ fontSize: "14px", color: "#666" , marginBottom: "10px"}}>Creada el {createdAt}</p>
      </div>
    </div>
  );
};

export default EncuestaCard;
