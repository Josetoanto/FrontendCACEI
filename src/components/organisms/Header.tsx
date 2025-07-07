import HeaderTittle from "../atoms/HeaderTittle";
import Notifications from "../atoms/Notifications";
import Configuracion from "../atoms/Configuracion";
import ProfilePicture from "../atoms/ProfilePicture";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = userData.tipo;

  const handleLogoClick = () => {
    switch (userType) {
      case 'Administrador':
        navigate('/home');
        break;
      case 'Egresado':
        navigate('/egresado');
        break;
      case 'Empleador':
        navigate('/evaluador');
        break;
      default:
        navigate('/');
    }
  };

  const handleProfileClick = () => {
    if (userType === 'Egresado' && userData.id) {
      navigate(`/perfil/${userData.id}`);
    } else if (userType === 'Empleador') {
      navigate(`/perfil/${userData.id}`);
    }
  };

  return (
    <>
      <header style={{  height: "50px" ,display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#ffffff" }}>
        <HeaderTittle onClick={handleLogoClick} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingRight:"10px" }}>
          {userType === 'Administrador' ? (
            <Configuracion />
          ) : (
            <Notifications />
          )}
          {userType !== 'Administrador' && (
            <ProfilePicture src= '' onClick={handleProfileClick} />
          )}
        </div>
      </header>
      <div style={{ height: "2px", backgroundColor: "#e5e8eb", margin: "0" }}></div>
    </>
  );
};

export default Header;
