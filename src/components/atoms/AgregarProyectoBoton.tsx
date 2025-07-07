import { Link } from 'react-router-dom';

const AgregarProyectoBoton: React.FC = () => {
    return (
      <Link to="/agregarProyecto" style={{ textDecoration: 'none' }}>
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
            fontWeight:"bold"
          }}
        >
          Agregar nuevo proyecto
        </button>
      </Link>
    );
  };
  
  export default AgregarProyectoBoton;
  
