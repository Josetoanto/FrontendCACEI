import { Dispatch, SetStateAction } from "react";
import upLogo from "../../assets/upLogo.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface HeaderEncuestaProps {
  activo: string;
  setActivo: Dispatch<SetStateAction<string>>;
  surveyTitle: string;
  isEditMode: boolean;
  onSave: () => Promise<void>;
}

const HeaderEncuesta: React.FC<HeaderEncuestaProps> = ({ activo, setActivo, surveyTitle, isEditMode, onSave }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Perderás todos los cambios no guardados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, seguir editando"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/home');
      }
    });
  };

  return (
    <div style={{
      padding: "16px",
      paddingBottom:"0px",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* Sección superior */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Izquierda: Imagen + Nombre Encuesta */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={upLogo} alt="Encuesta" style={{  marginRight: "12px", height: "auto", width: "36px" }} />
          <h2 style={{ margin: 0, fontSize:"18px" }}>{surveyTitle}</h2>
        </div>

        {/* Derecha: Botón Publicar + Imagen Perfil */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onSave} style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}>{isEditMode ? "Guardar" : "Publicar"}</button>
          <button onClick={handleCancel} style={{
            backgroundColor: "#dc3545", // Color rojo para cancelar
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}>Cancelar</button>
        </div>
      </div>

      {/* Menú de navegación */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "12px",
        borderBottom: "2px solid #ddd"
      }}>
        {["Preguntas", "Respuestas", "Configuración"].map((item) => (
          <div 
            key={item} 
            onClick={() => setActivo(item)}
            style={{
                fontSize:"14px",
              padding: "10px 20px",
              cursor: "pointer",
              color: activo === item ? "#007bff" : "#333",
              fontWeight: activo === item ? "bold" : "normal",
              borderBottom: activo === item ? "2px solid #007bff" : "none"
            }}
          >
            {item}
          </div>
        ))}
      </div>

    </div>
  );
};

export default HeaderEncuesta;
