import "@fortawesome/fontawesome-free/css/all.min.css";

interface ProyectoProps {
  nombre: string;
  fecha: string;
}

const Proyecto: React.FC<ProyectoProps> = ({ nombre, fecha }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "10% 75% 15%",
      alignItems: "center",
      padding: "10px",
      borderBottom: "1px solid #ddd"
    }}>
      {/* Columna 1 - Ícono de maleta */}
      <i className="fas fa-briefcase" style={{ fontSize: "20px", color: "black" , backgroundColor:"#f0f2f5", "maxWidth":"20px", padding:"15px", borderRadius:"12px"}}></i>

      {/* Columna 2 - Nombre y fecha */}
      <div>
        <strong>{nombre}</strong>
        <p style={{ margin: "5px 0 0", color: "#666" }}>{fecha}</p>
      </div>

      {/* Columna 3 - Menú */}
      <i className="fas fa-ellipsis-v" style={{ cursor: "pointer", color: "#888" }}></i>
    </div>
  );
};

export default Proyecto;
