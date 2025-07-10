import { useState, useEffect, useRef } from "react";

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
  tipo: 'abierta' | 'multiple' | 'likert' | 'checkbox';
  texto: string;
  orden: number;
  competencia_asociada: string;
  campo_educacional_numero?: number;
  opciones: Option[];
  tempClientId?: number;
}

type PreguntaProps = {
  onEliminarPregunta?: () => void;
  editable?: boolean;
  id: number;
  initialQuestion?: Question;
  surveyId: number;
  onQuestionChange?: (updatedQuestion: Question) => void;
  onAnswerChange?: (questionId: number, value: string | number) => void;
  initialAnswer?: string | number;
  camposEducacionales?: Array<{id: number, numero: number, nombre: string, descripcion: string}>;
};

const Pregunta: React.FC<PreguntaProps> = ({ onEliminarPregunta, editable = true, id, initialQuestion, surveyId, onQuestionChange, onAnswerChange, initialAnswer, camposEducacionales = [] }) => {
  // Log de depuración
  console.log('Pregunta ID:', id, 'Tipo de pregunta:', initialQuestion?.tipo, 'Editable:', editable, 'InitialAnswer:', initialAnswer);
  
  const [titulo, setTitulo] = useState(initialQuestion?.texto || "Pregunta sin título");
  const [tipoPregunta, setTipoPregunta] = useState(
    initialQuestion?.tipo === 'abierta' ? "Pregunta Abierta" : 
    initialQuestion?.tipo === 'multiple' ? "Opción Múltiple" : 
    initialQuestion?.tipo === 'likert' ? "Escala Likert" : 
    initialQuestion?.tipo === 'checkbox' ? "Checkbox" : "Opción Múltiple"
  );
  const [opciones, setOpciones] = useState(initialQuestion?.opciones && initialQuestion.opciones.length > 0 ? initialQuestion.opciones.map(opt => opt.etiqueta) : ["Opción 1", "Opción 2"]);
  const [numEstrellas, setNumEstrellas] = useState(initialQuestion?.tipo === 'likert' && initialQuestion.opciones.length > 0 ? initialQuestion.opciones.length : 5);
  const [selectedRating, setSelectedRating] = useState(0);
  const [openAnswer, setOpenAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [campoEducacional, setCampoEducacional] = useState(initialQuestion?.campo_educacional_numero || 0);
  const [tituloError, setTituloError] = useState(false);
  const [opcionesErrors, setOpcionesErrors] = useState<boolean[]>([]);
  const tituloRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (initialQuestion) {
      setTitulo(initialQuestion.texto);
      setTipoPregunta(
        initialQuestion.tipo === 'abierta' ? "Pregunta Abierta" : 
        initialQuestion.tipo === 'multiple' ? "Opción Múltiple" : 
        initialQuestion.tipo === 'likert' ? "Escala Likert" : 
        initialQuestion.tipo === 'checkbox' ? "Checkbox" : "Opción Múltiple"
      );
      setOpciones(initialQuestion.opciones && initialQuestion.opciones.length > 0 ? initialQuestion.opciones.map(opt => opt.etiqueta) : ["Opción 1", "Opción 2"]);
      setNumEstrellas(initialQuestion.tipo === 'likert' && initialQuestion.opciones.length > 0 ? initialQuestion.opciones.length : 5);
      setCampoEducacional(initialQuestion.campo_educacional_numero || 0);
      
      if (!editable && initialAnswer !== undefined) {
        if (typeof initialAnswer === 'number') {
          setSelectedRating(initialAnswer);
        } else if (typeof initialAnswer === 'string') {
          // Usar el tipo real de la pregunta en lugar del estado tipoPregunta
          const questionType = initialQuestion?.tipo;
          console.log('Procesando respuesta inicial. Tipo:', questionType, 'Respuesta:', initialAnswer);
          if (questionType === 'abierta') {
            setOpenAnswer(initialAnswer);
          } else if (questionType === 'multiple') {
            setSelectedOption(initialAnswer);
          } else if (questionType === 'checkbox') {
            // Para checkbox, el valor puede venir como string separado por comas
            const checkboxValues = typeof initialAnswer === 'string' 
              ? initialAnswer.split(',').filter(item => item.trim() !== '')
              : [];
            console.log('Valores de checkbox procesados:', checkboxValues);
            setSelectedCheckboxes(checkboxValues);
          }
        }
      } else {
        setSelectedRating(0);
        setOpenAnswer("");
        setSelectedOption(null);
        setSelectedCheckboxes([]);
      }
    }
  }, [initialQuestion, initialAnswer, editable, tipoPregunta]);

  useEffect(() => {
    if (tituloRef.current) {
      tituloRef.current.style.height = 'auto';
      tituloRef.current.style.height = `${tituloRef.current.scrollHeight}px`;
    }
  }, [titulo]);

  // Log cuando se renderiza checkbox
  useEffect(() => {
    if (!editable && initialQuestion?.tipo === 'checkbox') {
      console.log('Renderizando checkbox para pregunta ID:', id, 'Tipo real:', initialQuestion?.tipo, 'Editable:', editable);
    }
  }, [editable, initialQuestion?.tipo, id]);

  // Validar título y opciones cuando cambien
  useEffect(() => {
    const isEmpty = !titulo || titulo.trim() === '';
    setTituloError(isEmpty);
  }, [titulo]);

  useEffect(() => {
    const errors = opciones.map(opcion => !opcion || opcion.trim() === '');
    setOpcionesErrors(errors);
  }, [opciones]);

  const updateQuestionState = (newTitulo: string, newTipo: string, newOpciones: string[], newNumEstrellas: number, newCampoEducacional: number) => {
    if (!onQuestionChange) return;

    const questionTypeApi = newTipo === 'Opción Múltiple' ? 'multiple' : 
                           newTipo === 'Escala Likert' ? 'likert' : 
                           newTipo === 'Checkbox' ? 'checkbox' : 'abierta';

    let optionsPayload: Option[] = [];
    if (questionTypeApi === 'multiple' || questionTypeApi === 'checkbox') {
      optionsPayload = newOpciones.map((opt, index) => ({
        pregunta_id: id,
        valor: (index + 1).toString(),
        etiqueta: opt,
        peso: index + 1,
        id: initialQuestion?.opciones[index]?.id || 0,
      }));
    } else if (questionTypeApi === 'likert') {
      optionsPayload = Array.from({ length: newNumEstrellas }, (_, i) => ({
        pregunta_id: id,
        valor: (i + 1).toString(),
        etiqueta: (i + 1).toString(),
        peso: i + 1,
        id: initialQuestion?.opciones[i]?.id || 0,
      }));
    }

    onQuestionChange({
      id: id,
      encuesta_id: surveyId,
      tipo: questionTypeApi,
      texto: newTitulo,
      orden: initialQuestion?.orden || 0,
      competencia_asociada: initialQuestion?.competencia_asociada || "",
      campo_educacional_numero: newCampoEducacional,
      opciones: optionsPayload,
      tempClientId: initialQuestion?.tempClientId,
    });
  };

  const handleTituloChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitulo = e.target.value;
    setTitulo(newTitulo);
    updateQuestionState(newTitulo, tipoPregunta, opciones, numEstrellas, campoEducacional);
  };

  const handleTipoPreguntaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setTipoPregunta(newType);

    let newOpciones = opciones;
    let newNumEstrellas = numEstrellas;

    if (newType === "Opción Múltiple") {
      newOpciones = ["Opción 1", "Opción 2"];
    } else if (newType === "Escala Likert") {
      newOpciones = [];
      newNumEstrellas = 5;
    }
    setOpciones(newOpciones);
    setNumEstrellas(newNumEstrellas);
    updateQuestionState(titulo, newType, newOpciones, newNumEstrellas, campoEducacional);
  };

  const handleOpcionChange = (index: number, nuevoValor: string) => {
    const newOpciones = opciones.map((op, i) => i === index ? nuevoValor : op);
    setOpciones(newOpciones);
    updateQuestionState(titulo, tipoPregunta, newOpciones, numEstrellas, campoEducacional);
  };

  const handleNumEstrellasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNumEstrellas = Number(e.target.value);
    setNumEstrellas(newNumEstrellas);
    updateQuestionState(titulo, tipoPregunta, opciones, newNumEstrellas, campoEducacional);
  };

  const agregarOpcion = () => {
    const newOpciones = [...opciones, `Opción ${opciones.length + 1}`];
    setOpciones(newOpciones);
    updateQuestionState(titulo, tipoPregunta, newOpciones, numEstrellas, campoEducacional);
  };

  const eliminarOpcion = (index: number) => {
    if (opciones.length > 2) {
      const newOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(newOpciones);
      updateQuestionState(titulo, tipoPregunta, newOpciones, numEstrellas, campoEducacional);
    }
  };

  return (
    <div style={{
      padding: "20px",
      backgroundColor: editable ? "#fff" : "#ffffff",
      borderRadius: "10px",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
    }}>
      
      {/* Título de la pregunta y selector de tipo en la misma línea */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px", width: "100%" }}>
        {editable ? (
          <div style={{ flexGrow: 1 }}>
            <textarea
              ref={tituloRef}
              value={titulo}
              onChange={editable ? (e => { setTitulo(e.target.value); handleTituloChange(e); }) : undefined}
              placeholder="Ponga su pregunta aquí..."
              style={{
                width: "100%",
                fontFamily: "'Public Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                fontSize: "16px",
                fontWeight: "normal",
                color: "#222",
                border: tituloError ? "2px solid #dc3545" : "none",
                borderBottom: tituloError ? "2px solid #dc3545" : "2px solid #cfd8dc",
                outline: "none",
                background: "transparent",
                padding: "18px 16px 10px 16px",
                borderRadius: tituloError ? "4px" : "4px 4px 0 0",
                resize: "none",
                minHeight: "38px",
                maxWidth: "100%",
                overflow: "hidden",
                boxSizing: "border-box",
                wordBreak: "break-word"
              }}
              rows={1}
            />
            {tituloError && (
              <div style={{
                color: "#dc3545",
                fontSize: "12px",
                marginTop: "4px",
                marginLeft: "4px"
              }}>
                El título de la pregunta es obligatorio
              </div>
            )}
          </div>
        ) : (
          <textarea
            ref={tituloRef}
            value={titulo}
            readOnly
            style={{
              flexGrow: 1,
              fontFamily: "'Public Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
              fontSize: "16px",
              fontWeight: "normal",
              color: "#222",
              border: "none",
              borderBottom: "2px solid #cfd8dc",
              outline: "none",
              background: "#fff",
              padding: "18px 16px 10px 16px",
              borderRadius: "4px 4px 0 0",
              resize: "none",
              minHeight: "38px",
              maxWidth: "100%",
              overflow: "hidden",
              boxSizing: "border-box",
              wordBreak: "break-word"
            }}
            rows={1}
          />
        )}
        {editable && (
          <select 
            value={tipoPregunta}
            onChange={editable ? handleTipoPreguntaChange : undefined}
            style={{
              width: "160px",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              height:"50px",
              flexShrink: 0
            }}
            disabled={!editable}
          >
            <option value="Opción Múltiple">Opción Múltiple</option>
            <option value="Checkbox">Checkbox</option>
            <option value="Escala Likert">Escala Likert</option>
            <option value="Pregunta Abierta">Pregunta Abierta</option>
          </select>
        )}
      </div>

      

      {/* Renderizar dependiendo del tipo de pregunta */}
      <div style={{ marginTop: "25px" }}>
        {/* Opción Múltiple */}
        {(editable ? tipoPregunta === "Opción Múltiple" : initialQuestion?.tipo === "multiple") && (
          <div>
            {opciones.map((opcion, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "8px" }}>
                <input 
                  type="radio" 
                  name={`pregunta-${id}`} 
                  value={opcion}
                  checked={selectedOption === opcion}
                  onChange={(e) => {
                    if (!editable) {
                      setSelectedOption(e.target.value);
                      onAnswerChange?.(id, e.target.value);
                    }
                  }}
                  style={{ accentColor: "#4285f4" , height:"16px", width:"14px"}}
                  disabled={editable}
                />
                <div style={{ flexGrow: 1 }}>
                  <input
                    type="text"
                    value={opcion}
                    onChange={e => editable && handleOpcionChange(index, e.target.value)}
                    style={{
                      width: "100%",
                      margin: 0,
                      border: opcionesErrors[index] ? "2px solid #dc3545" : "none",
                      background: "transparent",
                      fontSize: "16px",
                      color: "#222",
                      outline: "none",
                      padding:"4px",
                      paddingTop:"10px",
                      borderRadius: opcionesErrors[index] ? "4px" : "0"
                    }}
                    readOnly={!editable}
                  />
                  {editable && opcionesErrors[index] && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "11px",
                      marginTop: "2px",
                      marginLeft: "4px"
                    }}>
                      La opción no puede estar vacía
                    </div>
                  )}
                </div>
                {editable && opciones.length > 2 && index > 1 && (
                  <button
                    onClick={() => eliminarOpcion(index)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                      marginLeft: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Eliminar opción"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#70757a" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {/* Línea divisoria debajo de las opciones */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "24px 0 0 0" }} />
            {editable && (
              <button 
                onClick={agregarOpcion}
                style={{
                  backgroundColor: "transparent",
                  color: "#70757a",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  opacity: 1
                }}
              >
                Agregar opción
              </button>
            )}
          </div>
        )}

        {/* Checkbox */}
        {(editable ? tipoPregunta === "Checkbox" : initialQuestion?.tipo === "checkbox") && (
          <div>
            {opciones.map((opcion, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "8px" }}>
                <input 
                  type="checkbox" 
                  name={`pregunta-${id}`} 
                  value={opcion}
                  checked={selectedCheckboxes.includes(opcion)}
                  onChange={(e) => {
                    if (!editable) {
                      const newSelectedCheckboxes = e.target.checked
                        ? [...selectedCheckboxes, opcion]
                        : selectedCheckboxes.filter(item => item !== opcion);
                      setSelectedCheckboxes(newSelectedCheckboxes);
                      onAnswerChange?.(id, newSelectedCheckboxes.join(','));
                    }
                  }}
                  style={{ accentColor: "#4285f4" , height:"16px", width:"14px"}}
                  disabled={editable}
                />
                <div style={{ flexGrow: 1 }}>
                  <input
                    type="text"
                    value={opcion}
                    onChange={e => editable && handleOpcionChange(index, e.target.value)}
                    style={{
                      width: "100%",
                      margin: 0,
                      border: opcionesErrors[index] ? "2px solid #dc3545" : "none",
                      background: "transparent",
                      fontSize: "16px",
                      color: "#222",
                      outline: "none",
                      padding:"4px",
                      paddingTop:"10px",
                      borderRadius: opcionesErrors[index] ? "4px" : "0"
                    }}
                    readOnly={!editable}
                  />
                  {editable && opcionesErrors[index] && (
                    <div style={{
                      color: "#dc3545",
                      fontSize: "11px",
                      marginTop: "2px",
                      marginLeft: "4px"
                    }}>
                      La opción no puede estar vacía
                    </div>
                  )}
                </div>
                {editable && opciones.length > 2 && index > 1 && (
                  <button
                    onClick={() => eliminarOpcion(index)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: 0,
                      marginLeft: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Eliminar opción"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#70757a" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {/* Línea divisoria debajo de las opciones */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "24px 0 0 0" }} />
            {editable && (
              <button 
                onClick={agregarOpcion}
                style={{
                  backgroundColor: "transparent",
                  color: "#70757a",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  opacity: 1
                }}
              >
                Agregar opción
              </button>
            )}
          </div>
        )}
        
        {/* Escala Likert */}
        {(editable ? tipoPregunta === "Escala Likert" : initialQuestion?.tipo === "likert") && (
          <div style={{ marginTop: "24px" }}>
            {/* Selector de número de estrellas */}
            {editable && (
              <select
                value={numEstrellas}
                onChange={handleNumEstrellasChange}
                style={{
                  width: "70px",
                  fontSize: "14px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  marginBottom: "32px",
                  marginTop: "8px",
                  display: "block"
                }}
                disabled={!editable}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            )}
            {/* Números debajo de las estrellas */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px", marginBottom: "8px" }}>
              {Array.from({ length: numEstrellas }, (_, i) => (
                <span key={i} style={{ fontSize: "18px", color: "#222", width: "32px", textAlign: "center" }}>{i + 1}</span>
              ))}
            </div>
            {/* Estrellas */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px" }}>
              {Array.from({ length: numEstrellas }, (_, i) => (
                <svg 
                  key={i} 
                  width="36" 
                  height="36" 
                  viewBox="0 0 24 24" 
                  fill={i < selectedRating ? "#fbc02d" : "none"} 
                  stroke={i < selectedRating ? "#fbc02d" : "#222"} 
                  strokeWidth="2"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  onClick={() => {
                    if (!editable) {
                      setSelectedRating(i + 1);
                      onAnswerChange?.(id, i + 1);
                    }
                  }}
                  style={{ cursor: editable ? "default" : "pointer" }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            {/* Línea divisoria debajo de las estrellas */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "24px 0 0 0" }} />
          </div>
        )}

        {/* Pregunta Abierta */}
        {(editable ? tipoPregunta === "Pregunta Abierta" : initialQuestion?.tipo === "abierta") && (
          <div style={{ marginTop: "32px" }}>
            
            <div>
              <input
                type="text"
                value={openAnswer}
                onChange={(e) => {
                  setOpenAnswer(e.target.value);
                  onAnswerChange?.(id, e.target.value);
                }}
                readOnly={editable}
                placeholder="Respuesta"
                style={{
                  display: "block",
                  marginTop: "8px",
                  border: "none",
                  borderBottom: "2px solid #b0bec5",
                  background: "transparent",
                  fontSize: "14px",
                  color: "#222",
                  width: "240px",
                }}
              />
            </div>
            {/* Línea divisoria debajo de la respuesta */}
            <div style={{ borderBottom: "1px solid #e0e0e0", margin: "32px 0 0 0" }} />
          </div>
        )}
      </div>

      {/* Mostrar selector de campo educativo abajo a la izquierda en vez del texto */}
      {editable && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '12px', marginLeft: '4px' }}>
          <select
            value={campoEducacional}
            onChange={(e) => {
              const newCampoEducacional = Number(e.target.value);
              setCampoEducacional(newCampoEducacional);
              updateQuestionState(titulo, tipoPregunta, opciones, numEstrellas, newCampoEducacional);
            }}
            style={{
              width: "220px",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              height: "36px",
              fontSize: '14px',
              color: '#444',
              background: '#f9f9f9',
              marginRight: '12px'
            }}
          >
            {camposEducacionales.map((campo) => (
              <option key={campo.id} value={campo.numero}>
                {campo.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controles adicionales */}
      {editable && onEliminarPregunta && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "24px", borderTop: "none" }}>
          {/* Botón de eliminar pregunta */}
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
              marginRight: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Eliminar pregunta"
            onClick={onEliminarPregunta}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#222" viewBox="0 0 24 24">
              <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
            </svg>
          </button>
        </div>
      )}

    </div>
  );
};

export default Pregunta;
