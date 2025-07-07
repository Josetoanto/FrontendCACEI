import { useNavigate } from "react-router-dom";

interface ConfiguracionProps {
  onClick?: () => void;
}

const Configuracion: React.FC<ConfiguracionProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/configuracion');
    }
  };

  return (
    <button 
      aria-label="Configuración" 
      style={{ 
        backgroundColor: 'transparent', 
        border: 'none', 
        cursor: 'pointer', 
        outline: 'none',
        position: 'relative'
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} 
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onClick={handleClick}
    >
      <i className="fas fa-cog" style={{ fontSize: '2em' }}></i>
    </button>
  );
};

export default Configuracion; 
