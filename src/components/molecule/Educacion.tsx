interface EducacionProps {
    institucion: string;
    fecha: string;
  }
  
  const Educacion: React.FC<EducacionProps> = ({ institucion, fecha }) => {
    return (
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "left",
        paddingBottom: "0px",
        paddingTop: "0px"
      }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Educación</h2>
        <p style={{ fontSize: "16px", paddingLeft: "15px"}}>{institucion}</p>
        <p style={{ fontSize: "16px", color: "#555" , paddingLeft: "15px"}}>{fecha}</p>
      </div>
    );
  };
  
  export default Educacion;
  