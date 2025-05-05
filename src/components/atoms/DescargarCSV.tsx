const DescargarCSV: React.FC = () => {
    const handleDownload = () => {
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
  