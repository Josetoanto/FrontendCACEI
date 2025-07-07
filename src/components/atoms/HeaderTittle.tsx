import upLogo from '../../assets/upLogo.png';

interface HeaderTittleProps {
    onClick?: () => void;
}

const HeaderTittle: React.FC<HeaderTittleProps> = ({ onClick }) => {
    return (
        <div 
            style={{ display: 'flex', alignItems: 'center', paddingLeft:"10px", cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
        >
            <img 
                src={upLogo}
                alt="Logo de UP" 
                style={{ width: '36px', height: 'auto', marginRight: '8px' }}
            />
            <h1 style={{ fontSize: '18px', paddingLeft: '10px' }}>Sistema de evaluación de egresados</h1>
        </div>
    );
  };
  
  export default HeaderTittle;
  
