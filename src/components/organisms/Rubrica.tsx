
  
  // Definir la interfaz para las props, incluyendo evaluationDetails
  interface RubricaProps {
      evaluationDetails: any; // Usamos any por ahora, idealmente sería el tipo de la evaluación enriquecida
  }
  
  // Actualizar la definición del componente para aceptar evaluationDetails
  const Rubrica: React.FC<RubricaProps> = ({ evaluationDetails }) => {
      // Usar los criterios de evaluationDetails si están disponibles
      const rubricasToShow = evaluationDetails?.criterios || [];
  
    return (
      <div style={{ paddingTop: "10px", backgroundColor: "transparent", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "left", marginBottom: "14px" , fontSize:"18px"}}>Rúbrica de Evaluación</h2>
  
        {/* Tabla de rúbrica */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rubricasToShow.map((item: any, index: number) => (
            <div key={index} style={{ paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>
              {/* Mostrar nombre del criterio y puntuación de la evaluación específica */}
              <p style={{ fontSize: "14px", color: "#61788A", margin: "16px 0 0" }}>{item.nombre || 'Sin nombre de rúbrica'}</p>
              <p style={{ fontSize: "14px", color: "black", margin: "5px 0 0" }}>{item.puntuacion}/100</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Rubrica;
  