interface ProyectoDetallesProps {
    titulo: string;
    descripcion: string;
    evidencia: string[];
    ultimoComentario: string;
  }
  
  const DetallesDelProyecto: React.FC<ProyectoDetallesProps> = ({ titulo, descripcion, evidencia, ultimoComentario }) => {
    return (
      <div style={{
        width: "100%",
        margin: "auto",
        backgroundColor: "transparent"
      }}>
        {/* Título principal */}
        <h1 style={{ textAlign: "left", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
          Detalles del proyecto
        </h1>
        {/* Sección de atributos */}
        <div style={{ display: "grid", gridTemplateColumns: "30% 70%", rowGap: "8x" }}>
                     
        <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />
          <span style={{color:"#61788A", fontSize: "16px" }}>Título:</span>
          <span style={{fontSize: "16px"}}>{titulo}</span>
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

          <span style={{color:"#61788A",fontSize: "16px"}}>Descripción:</span>
          <span style={{ fontSize: "16px" }}>{descripcion}</span>
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

          <span style={{color:"#61788A", fontSize: "16px"}}>Evidencia:</span>
          <div>
            {evidencia.map((item, index) => (
              <a key={index} href={item} target="_blank" rel="noopener noreferrer" 
                style={{ fontSize: "16px", color: "#007bff", textDecoration: "none", display: "block" }}>
                Enlace {index + 1}
              </a>
            ))}
          </div>          
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

  
          <span style={{color:"#61788A", fontSize: "16px" }}>Último comentario:</span>
          <span style={{fontSize: "16px", fontStyle: "italic", color: "#666" }}>{ultimoComentario}</span>
          <hr style={{ border: "1px solid #ccc", gridColumn: "span 2", margin: "10px 0" }} />

        </div>
      </div>
    );
  };
  
  export default DetallesDelProyecto;
  