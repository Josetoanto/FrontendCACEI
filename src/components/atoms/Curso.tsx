interface CursoProps {
    nombre: string;
    fecha: string;
    url: string;
  }
  
  const Curso: React.FC<CursoProps> = ({ nombre, fecha, url }) => {
    return (
      <div style={{
        borderRadius: "8px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left",
        paddingBottom: "0px",
        paddingTop: "0px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <h3 style={{ fontSize: "16px",  marginBottom: "0px" }}>{nombre}</h3>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{
              padding: "12px",
              borderRadius: "6px",
              textDecoration: "none",
              paddingBottom: "0px", 
            }}>
            Ver
          </a>
        </div>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>{fecha}</p>
      </div>
    );
  };
  
  export default Curso;
  
