import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const IngresarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Expresión regular para validar el formato 0000-YYYYMM-xxxxxx
  const codigoRegex = /^\d{4}-\d{6}-[a-z0-9]{6}$/;

  const validarCodigo = async () => {
    if (!codigoRegex.test(codigo.trim())) {
      await Swal.fire({
        icon: 'error',
        title: 'Código inválido',
        text: 'Debe tener el formato 0000-YYYYMM-xxxxxx.'
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://188.68.59.176:8000/anonymous-invitations/code/${codigo.trim()}`
      );
      if (!response.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Código no encontrado',
          text: 'El código ingresado no existe o es inválido.'
        });
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      if (data.respondido) {
        await Swal.fire({
          icon: 'warning',
          title: 'Código ya utilizado',
          text: 'Este código ya ha sido utilizado para responder la encuesta.'
        });
        setIsLoading(false);
        return;
      }
      // Guardar el código en localStorage para usarlo en ResponderEncuesta
      localStorage.setItem("codigoEncuestaAnonima", codigo.trim());
      // Redirigir a la página de responder encuesta con el id de la encuesta
      navigate(`/responderEncuesta/${data.encuesta_id}`);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al validar el código. Intenta de nuevo más tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundColor: "#f0ebf8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="form-container"
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "25px",
            color: "#333",
          }}
        >
          Ingresar Código de Encuesta
        </h2>

        {/* Input para código */}
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          maxLength={18}
          placeholder="Ingresa el código"
          className="code-input"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "18px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        {/* Botón de validación */}
        <button
          onClick={validarCodigo}
          className="submit-button"
          style={{
            backgroundColor: "#5e35b1",
            color: "#fff",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "18px",
            transition: "background-color 0.3s ease",
            opacity: isLoading ? 0.7 : 1,
          }}
          disabled={isLoading}
        >
          {isLoading ? "Validando..." : "Ir a la Encuesta"}
        </button>
      </div>
    </div>
  );
};

export default IngresarCodigo;
