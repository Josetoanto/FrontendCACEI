interface DatoPresentacionProps {
    etiqueta: string;  // Texto a la izquierda
    valor: React.ReactNode;      // Texto a la derecha
  }
  
  const DatoPresentacion: React.FC<DatoPresentacionProps> = ({ etiqueta, valor }) => {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "30% 70%",
        alignItems: "center",
        padding: "10px",
        paddingLeft: "0px",
        borderBottom: "1px solid #ddd"
      }}>
        <span style={{textAlign:"left", color:"#61788A"}}>{etiqueta}:</span>
        <span style={{textAlign:"right"}}>{valor}</span>
      </div>
    );
  };
  
  export default DatoPresentacion;
  
