import { useState } from "react";


const IngresarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState("");

  const validarCodigo = () => {
    if (codigo.trim().length === 6) {
      alert(`Redirigiendo a la encuesta con código: ${codigo}`);
      // Aquí puedes implementar la navegación real a la encuesta
    } else {
      alert("Código inválido. Debe contener exactamente 6 dígitos.");
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
          maxLength={6}
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
            cursor: "pointer",
            fontSize: "18px",
            transition: "background-color 0.3s ease",
          }}
        >
          Ir a la Encuesta
        </button>
      </div>
    </div>
  );
};

export default IngresarCodigo;
