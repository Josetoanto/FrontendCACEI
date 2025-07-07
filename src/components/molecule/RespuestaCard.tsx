import React, { useState, useEffect, useCallback } from 'react';

interface SurveyResponseDetail {
  respuesta_id: number;
  pregunta_id: number;
  valor_texto: string | null;
  valor_numero: number | null;
  creado_en: string;
  pregunta: {
    texto: string;
    tipo: 'abierta' | 'multiple' | 'likert';
  };
}

interface Option {
  id: number;
  pregunta_id: number;
  valor: string;
  etiqueta: string;
  peso: number;
}

interface Question {
  id: number;
  encuesta_id: number;
  tipo: 'abierta' | 'multiple' | 'likert';
  texto: string;
  orden: number;
  competencia_asociada: string;
  opciones: Option[];
  tempClientId?: number;
}

interface RespuestaDisplayProps {
  surveyId: number | null;
  questions: Question[];
}

const RespuestaDisplay: React.FC<RespuestaDisplayProps> = ({ surveyId, questions }) => {
  const [responsesData, setResponsesData] = useState<{[questionId: number]: SurveyResponseDetail[]}>({});
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponsesForQuestion = useCallback(async (questionId: number) => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      setError('No se encontró el token de usuario. Por favor, inicie sesión.');
      return [];
    }

    try {
      const response = await fetch(`https://egresados.it2id.cc/api/responses/question/${questionId}`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });

      if (!response.ok) {
        console.error(`Error al cargar respuestas para la pregunta ${questionId}: ${response.statusText}`);
        return [];
      }
      const data: SurveyResponseDetail[] = await response.json();
      return data;
    } catch (err: any) {
      console.error(`Error al obtener respuestas para la pregunta ${questionId}:`, err);
      setError(err.message || 'Error al cargar las respuestas.');
      return [];
    }
  }, []);

  // Funcion para descargar CSV
  const downloadCSV = useCallback(() => {
    if (!surveyId || questions.length === 0) {
      alert('No hay datos para descargar');
      return;
    }

    // Obtener todas las respuestas unicas (por respuesta_id)
    const allResponses: {[respuestaId: number]: {[questionId: number]: SurveyResponseDetail}} = {};
    
    Object.values(responsesData).forEach(questionResponses => {
      questionResponses.forEach(response => {
        if (!allResponses[response.respuesta_id]) {
          allResponses[response.respuesta_id] = {};
        }
        allResponses[response.respuesta_id][response.pregunta_id] = response;
      });
    });

    // Crear encabezados del CSV
    const headers = ['ID Respuesta', 'Fecha de Respuesta'];
    questions.forEach(question => {
      headers.push(`"${question.texto}"`);
    });

    // Crear filas de datos
    const csvRows = [headers.join(',')];
    
    Object.entries(allResponses).forEach(([respuestaId, questionResponses]) => {
      const row: string[] = [respuestaId];
      
      // Obtener la fecha de la primera respuesta (todas deberian tener la misma fecha)
      const firstResponse = Object.values(questionResponses)[0];
      const fecha = firstResponse ? new Date(firstResponse.creado_en).toLocaleDateString('es-ES') : '';
      row.push(fecha);
      
      // Agregar respuesta para cada pregunta
      questions.forEach(question => {
        const response = questionResponses[question.id];
        let valor = '';
        
        if (response) {
          if (response.valor_texto !== null && response.valor_texto !== undefined) {
            valor = response.valor_texto;
          } else if (response.valor_numero !== null && response.valor_numero !== undefined) {
            // Para preguntas de opcion multiple y likert, mostrar la etiqueta en lugar del numero
            if (question.tipo === 'multiple' && Array.isArray(question.opciones)) {
              const option = question.opciones.find(opt => opt.valor.toString() === response.valor_numero!.toString());
              valor = option ? option.etiqueta : response.valor_numero!.toString();
            } else if (question.tipo === 'likert' && Array.isArray(question.opciones)) {
              const likertLabels3 = ["Mal", "Medio", "Bien"];
              const likertLabels5 = ["Muy mal", "Mal", "Mas o menos", "Bien", "Muy Bien"];
              const numValue = response.valor_numero;
              if (question.opciones.length === 3 && numValue >= 1 && numValue <= 3) {
                valor = likertLabels3[numValue - 1];
              } else if (question.opciones.length === 5 && numValue >= 1 && numValue <= 5) {
                valor = likertLabels5[numValue - 1];
              } else {
                valor = response.valor_numero.toString();
              }
            } else {
              valor = response.valor_numero.toString();
            }
          }
        }
        
        // Escapar comillas y envolver en comillas si contiene comas
        valor = valor.replace(/"/g, '""');
        if (valor.includes(',') || valor.includes('"') || valor.includes('\n')) {
          valor = `"${valor}"`;
        }
        
        row.push(valor);
      });
      
      csvRows.push(row.join(','));
    });

    // Crear y descargar el archivo CSV
    const csvContent = csvRows.join('\n');
    // Agregar BOM para UTF-8 para que Excel reconozca correctamente los caracteres especiales
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `respuestas_encuesta_${surveyId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [surveyId, questions, responsesData]);

  useEffect(() => {
    const loadAllResponses = async () => {
      if (!surveyId || questions.length === 0) {
        setLoadingResponses(false);
        return;
      }

      setLoadingResponses(true);
      setError(null);
      const allResponses: {[questionId: number]: SurveyResponseDetail[]} = {};
      for (const question of questions) {
        if (question.id && question.id !== 0) { // Solo si la pregunta ya existe en la DB
          const responses = await fetchResponsesForQuestion(question.id);
          allResponses[question.id] = responses;
        }
      }
      setResponsesData(allResponses);
      setLoadingResponses(false);
    };

    loadAllResponses();
  }, [surveyId, questions, fetchResponsesForQuestion]);

  if (loadingResponses) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando respuestas...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Error: {error}</div>;
  }

  const hasAnyResponses = Object.values(responsesData).some(responses => responses.length > 0);

  if (!hasAnyResponses) {
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
            onClick={downloadCSV}
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
  }

  // Obtener el número total de respuestas basado en la primera pregunta con respuestas
  const firstQuestionWithResponses = questions.find(q => (responsesData[q.id]?.length || 0) > 0);
  const totalResponsesCount = firstQuestionWithResponses ? (responsesData[firstQuestionWithResponses.id]?.length || 0) : 0;

  return (
    <div style={{
      maxWidth: "800px",
      margin: "auto",
      textAlign: "left",
      marginTop: "24px",
      background: "#fafbfc",
      minHeight: "100vh",
      padding: "0 0 80px 0",
      backgroundColor: "#f0ebf8"
    }}>
      <div style={{backgroundColor:"#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px",  boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "20px",borderRadius: "12px"}}>
        <h2 style={{ fontSize: "16px", fontWeight:"bold"}}>{totalResponsesCount === 1 ? "1 respuesta" : `${totalResponsesCount} respuestas`}</h2>
        <button 
          onClick={downloadCSV}
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

      {questions.map(question => {
        const questionResponses = responsesData[question.id] || [];

        if (questionResponses.length === 0) return null; // No mostrar si no hay respuestas para esta pregunta

        return (
          <div key={question.id} style={{backgroundColor:"#ffffff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "20px", borderRadius: "12px", marginBottom: "24px"}}>
            <h3 style={{ fontSize: "18px", fontWeight:"bold", marginBottom: "16px" }}>{question.texto}</h3>
            
            {question.tipo === 'abierta' && (
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
                {questionResponses.map((response, index) => (
                  <p key={index} style={{ margin: '8px 0', padding: '8px', background: '#f9f9f9', borderRadius: '4px', borderBottom: '1px solid #eee', fontSize: '14px', textAlign: 'left' }}>
                    {response.valor_texto}
                  </p>
                ))}
              </div>
            )}

            {(question.tipo === 'multiple' || question.tipo === 'likert') && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                {(() => {
                  const valueCounts: {[key: string]: number} = {};
                  questionResponses.forEach(response => {
                    let value = response.valor_numero !== null && response.valor_numero !== undefined
                      ? response.valor_numero.toString()
                      : (response.valor_texto !== null && response.valor_texto !== undefined ? response.valor_texto : 'N/A');
                    valueCounts[value] = (valueCounts[value] || 0) + 1;
                  });

                  const totalResponses = questionResponses.length;
                  if (!totalResponses || totalResponses === 0) return null;

                  let currentAngle = 0;
                  const pieChartSegments = Object.entries(valueCounts).map(([_, count], index) => {
                    const angle = (count / totalResponses) * 360;
                    const color = `hsl(${index * 60}, 70%, 60%)`;
                    const segmentStyle = `
                      ${color} ${currentAngle}deg ${(currentAngle + angle)}deg
                    `;
                    currentAngle += angle;
                    return segmentStyle;
                  }).join(',');

                  const legendItems = Object.entries(valueCounts).map(([value, count], index) => {
                    const percentage = (count / totalResponses) * 100;
                    const color = `hsl(${index * 60}, 70%, 60%)`;
                    let displayLabel = value;
                    if (question.tipo === 'multiple' && Array.isArray(question.opciones)) {
                      // Buscar opción por valor, asegurando comparación de string
                      const option = question.opciones.find(opt => opt.valor.toString() === value.toString());
                      if (option) displayLabel = option.etiqueta;
                    } else if (question.tipo === 'likert' && Array.isArray(question.opciones)) {
                      const likertLabels3 = ["Mal", "Medio", "Bien"];
                      const likertLabels5 = ["Muy mal", "Mal", "Más o menos", "Bien", "Muy Bien"];
                      const numValue = parseInt(value);
                      if (question.opciones.length === 3 && numValue >= 1 && numValue <= 3) {
                        displayLabel = likertLabels3[numValue - 1];
                      } else if (question.opciones.length === 5 && numValue >= 1 && numValue <= 5) {
                        displayLabel = likertLabels5[numValue - 1];
                      } else {
                        displayLabel = `Valor ${value}`;
                      }
                    }
                    return (
                      <div key={value} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '2px', marginRight: '8px' }}></span>
                        <span style={{ fontSize: '14px', color: '#555' }}>{displayLabel}: {percentage.toFixed(1)}% ({count})</span>
                      </div>
                    );
                  });

                  return (
                    <>
                      <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: pieChartSegments ? `conic-gradient(${pieChartSegments})` : '#eee',
                        marginBottom: '20px',
                        border: '1px solid #ddd'
                      }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {legendItems}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RespuestaDisplay;
  
