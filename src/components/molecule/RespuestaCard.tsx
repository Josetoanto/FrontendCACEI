const RespuestaVacia: React.FC = () => {
    return (
      <div style={{
        maxWidth: "800px",
        margin: "auto",
        textAlign: "center",
        marginTop:"24px",
        background: "#fafbfc", 
        minHeight: "100vh", 
        padding: "0 0 80px 0" , 
        backgroundColor:"#f0ebf8"
      }}>
        
        <div style={{backgroundColor:"#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px",  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", padding: "20px",borderRadius: "12px"}}>
          {/* Número de respuestas */}
          <h2 style={{ fontSize: "16px", fontWeight:"bold"}}>0 respuestas</h2>
          {/* Botón Descargar CSV */}
          <button 
            style={{
              backgroundColor: "transparent",
              borderRadius: "8px",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
              color:"#1a73e8"
            }}
          >
            Descargar CSV
          </button>
        </div>
        <div style={{backgroundColor:"#ffffff",boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", padding: "20px",borderRadius: "12px",}}>
        <p style={{ fontSize: "14px", color: "#555" }}>
          No hay respuestas. Publica tu formulario para comenzar a aceptar respuestas.
        </p>
        </div>
      </div>
      
    );
  };
  
  export default RespuestaVacia;
  