import { Link } from 'react-router-dom';

const EnviarReporte: React.FC = () => {
    return (
      <Link to="/evaluador" style={{ textDecoration: 'none' }}>
        <button 
          style={{
            backgroundColor: "#f0f2f5",
            borderRadius: "12px",
            border: "none",
            padding: "12px 20px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
            marginTop:"12px",
            fontWeight:"lighter",
            marginBottom:"25px"
          }}
        >
          Enviar reporte
        </button>
      </Link>
    );
  };
  
  export default EnviarReporte;
  
