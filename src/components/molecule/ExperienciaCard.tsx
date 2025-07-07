interface ExperienciaCardProps {
    titulo: string;
    ubicacion: string;
    tiempo: string;
    imagen: string;
}
  
const ExperienciaCard: React.FC<ExperienciaCardProps> = ({ titulo, ubicacion, tiempo, imagen }) => {
    return (
      <div style={{
        borderRadius: "8px",
        maxWidth: "500px",
        padding: "16px",
        display: "flex",
        alignItems: "center"
      }}>
        <img src={imagen} alt={titulo} style={{ width: "90px", height: "90px", borderRadius: "8px", marginRight: "16px" }} />
        <div>
          <h2 style={{ margin: "0", fontSize: "18px" }}>{titulo}</h2>
          <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>{ubicacion}</p>
          <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>{tiempo}</p>
        </div>
      </div>
    );
};
  
export default ExperienciaCard;
  
