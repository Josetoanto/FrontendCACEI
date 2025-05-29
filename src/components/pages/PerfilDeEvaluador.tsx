import Header from "../organisms/Header";
import PerfilCard from "../organisms/PerfilCard";
import profileIcon from "../../assets/profileIcon.png";
import Educacion from "../molecule/Educacion";
import ListaDeHabilidades from "../molecule/ListaDeHabilidades";

const PerfilDeUsuario: React.FC = () => {
    return (
      <div  >
        <Header></Header>
        <div style={{
            width: "1000px",
            margin: "auto",
            backgroundColor: "#fff",
            borderRadius: "10px",
        }}>
          <PerfilCard userData={{
              nombre: "Juan Perez",
              fotoPerfil: profileIcon,
              profesion: "Maestro",
              ubicacion: "Santiago, Chile"
            }}></PerfilCard>
        <p style={{padding:"15px"}}>Soy diseñador de productos en Meta. He estado trabajando en la aplicación de Facebook durante 3 años, enfocándome en el Feed de Noticias y en los Grupos. Antes de Meta, trabajé en Google como diseñador de experiencia de usuario en Maps y Search. Tengo una licenciatura en Diseño de RISD.</p>
        <Educacion institucion="Universidad de Chile" fecha="2015 - 2020"></Educacion>
        <ListaDeHabilidades></ListaDeHabilidades>
        </div>
      </div>
    );
  };
  
  export default PerfilDeUsuario;
  