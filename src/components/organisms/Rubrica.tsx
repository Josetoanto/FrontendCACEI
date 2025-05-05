interface RubricaItem {
    nombreRubrica: string;
    puntuacion: number;
  }
  
  const rubricas: RubricaItem[] = [
    { nombreRubrica: "Calidad del código", puntuacion: 85 },
    { nombreRubrica: "Documentación", puntuacion: 90 },
    { nombreRubrica: "Desempeño", puntuacion: 78 },
    { nombreRubrica: "Usabilidad", puntuacion: 92 },
  ];
  
  const Rubrica: React.FC = () => {
    return (
      <div style={{ paddingTop: "10px", backgroundColor: "transparent", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "left", marginBottom: "14px" , fontSize:"18px"}}>Rúbrica de Evaluación</h2>
  
        {/* Tabla de rúbrica */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rubricas.map((item, index) => (
            <div key={index} style={{ paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>
              <p style={{ fontSize: "14px", color: "#61788A", margin: "16px 0 0" }}>{item.nombreRubrica}</p>
              <p style={{ fontSize: "14px", color: "black", margin: "5px 0 0" }}>{item.puntuacion}/100</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Rubrica;
  