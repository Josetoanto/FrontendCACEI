interface DescargarCSVProps {
  evaluationsData: any[];
  totalEvaluations: number | string;
  averageScore: string;
  evaluatedProjectsCount: number | string;
  dailyAverages: number[];
}

const DescargarCSV: React.FC<DescargarCSVProps> = ({ 
  evaluationsData, 
  totalEvaluations, 
  averageScore, 
  evaluatedProjectsCount, 
  dailyAverages 
}) => {
  const handleDownload = () => {
    // Crear el contenido del CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // 1. Agregar estadísticas generales
    csvContent += "ESTADISTICAS GENERALES\n";
    csvContent += "Evaluaciones totales," + totalEvaluations + "\n";
    csvContent += "Puntuacion promedio," + averageScore + "\n";
    csvContent += "Proyectos evaluados," + evaluatedProjectsCount + "\n\n";
    
    // 2. Agregar tendencia de promedio de evaluaciones (ultimos 7 dias)
    csvContent += "TENDENCIA DE PROMEDIO DE EVALUACIONES (ULTIMOS 7 DIAS)\n";
    csvContent += "Dia,Puntuacion Promedio\n";
    
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: '2-digit' 
      });
      csvContent += `${dateStr},${dailyAverages[6-i] || 0}\n`;
    }
    csvContent += "\n";
    
    // 3. Agregar detalles de evaluaciones individuales
    csvContent += "DETALLES DE EVALUACIONES INDIVIDUALES\n";
    csvContent += "ID Evaluacion,Nombre del Proyecto,Estudiante,Evaluador,Puntuacion Promedio,Fecha de Evaluacion\n";
    
    evaluationsData.forEach((evaluation: any) => {
      const evaluationDate = evaluation.creado_en ? 
        new Date(evaluation.creado_en).toLocaleDateString('es-ES') : 'N/A';
      
      csvContent += `${evaluation.id || 'N/A'},`;
      csvContent += `"${evaluation.projectName || 'N/A'}",`;
      csvContent += `"${evaluation.studentName || 'N/A'}",`;
      csvContent += `"${evaluation.evaluatorName || 'N/A'}",`;
      csvContent += `${evaluation.averageEvaluationScore || 0},`;
      csvContent += `${evaluationDate}\n`;
    });
    
    // 4. Agregar detalles de criterios individuales (si estan disponibles)
    csvContent += "\nDETALLES DE CRITERIOS POR EVALUACION\n";
    csvContent += "ID Evaluacion,Nombre del Proyecto,Criterio,Puntuacion,Comentario\n";
    
    evaluationsData.forEach((evaluation: any) => {
      if (evaluation.criterios && Array.isArray(evaluation.criterios)) {
        evaluation.criterios.forEach((criterio: any) => {
          csvContent += `${evaluation.id || 'N/A'},`;
          csvContent += `"${evaluation.projectName || 'N/A'}",`;
          csvContent += `"${criterio.nombre || criterio.criterio || 'N/A'}",`;
          csvContent += `${criterio.puntuacion || 0},`;
          csvContent += `"${criterio.comentario || ''}"\n`;
        });
      }
    });
    
    // Crear y descargar el archivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `evaluaciones_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleDownload}
      style={{
        backgroundColor: "#f0f2f5", // Color gris claro
        color: "#000", // Texto negro
        border: "none",
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "12px", // Bordes redondeados
        width:"100%"
      }}
    >
      Descargar CSV
    </button>
  );
};

export default DescargarCSV;
  
