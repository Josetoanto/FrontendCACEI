interface HabilidadProps {
    habilidad: string;
  }
  
  const Habilidad: React.FC<HabilidadProps> = ({ habilidad }) => {
    return (
      <div style={{
        backgroundColor: "#f0f2f5",
        padding: "10px 20px",
        borderRadius: "10px",
        boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
        textAlign: "left",
        fontSize: "16px",
        fontWeight: "normal",
        paddingBottom: "6px",
        marginBottom: "6px"
      }}>
        {habilidad}
      </div>
    );
  };
  
  export default Habilidad;
  