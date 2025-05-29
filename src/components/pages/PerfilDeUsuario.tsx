import React, { useState } from "react";
import Header from "../organisms/Header";
import PerfilCard from "../organisms/PerfilCard";
import profileIcon from "../../assets/profileIcon.png";
import Experiencias from "../organisms/Experiencias";
import Educacion from "../molecule/Educacion";
import ListaDeHabilidades from "../molecule/ListaDeHabilidades";
import ListaDeCursos from "../molecule/ListaDeCursos";
import EditarExperiencias from "../molecule/EditarExperiencias";
import EditarHabilidades from "../molecule/EditarHabilidades";
import EditarCursos from "../molecule/EditarCursos";

const PerfilDeUsuario: React.FC = () => {
    const [userData, setUserData] = useState({
      nombre: "Juan Perez",
      fotoPerfil: profileIcon,
      profesion: "Ingeniero",
      ubicacion: "Santiago, Chile",
      descripcion: "Soy diseñador de productos en Meta. He estado trabajando en la aplicación de Facebook durante 3 años, enfocándome en el Feed de Noticias y en los Grupos. Antes de Meta, trabajé en Google como diseñador de experiencia de usuario en Maps y Search. Tengo una licenciatura en Diseño de RISD."
    });

    const [experienciasData, setExperienciasData] = useState([
      { titulo: "Diseñador de páginas web", ubicacion: "San Francisco", tiempo: "3 años" },
      { titulo: "Diseñador UX", ubicacion: "San Francisco", tiempo: "2 años" },
    ]);

    const [educacionData, setEducacionData] = useState({
      institucion: "Universidad de Chile",
      fecha: "2015 - 2020"
    });

    const [habilidadesData, setHabilidadesData] = useState<string[]>(["Diseñador", "Programador", "React", "Java", "Python", "AWS"]);

    const [cursosData, setCursosData] = useState([
      { nombre: "Animación UI Básica", fecha: "2020", url: "https://coursera.org/curso-animacion-ui" },
      { nombre: "Diseño con extracción de datos", fecha: "2019", url: "https://udemy.com/curso-diseno-datos" }
    ]);

    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };

    const handleSave = (newData: {
      nombre: string;
      profesion: string;
      ubicacion: string;
      descripcion: string;
    }) => {
      setUserData(prevData => ({ ...prevData, ...newData }));
      setIsEditing(false);
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

    return (
      <div style={{paddingBottom:"15px"}}>
        <Header></Header>
        <div style={{
            width: "1000px",
            margin: "auto",
            backgroundColor: "#fff",
            borderRadius: "10px",
        }}>
          <PerfilCard 
            userData={userData}
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        {isEditing ? null : <p style={{padding:"15px"}}>{userData.descripcion}</p>}
        
        {isEditing ? (
          <EditarExperiencias experiencias={experienciasData} setExperiencias={setExperienciasData} />
        ) : (
          <Experiencias experiencias={experienciasData} isEditing={isEditing} setExperiencias={setExperienciasData} />
        )}

        <Educacion educacion={educacionData} isEditing={isEditing} setEducacion={setEducacionData} toggleEditing={toggleEditing} />
        
        {isEditing ? (
          <EditarHabilidades habilidades={habilidadesData} setHabilidades={setHabilidadesData} />
        ) : (
          <ListaDeHabilidades habilidades={habilidadesData} isEditing={isEditing} setHabilidades={setHabilidadesData} />
        )}

        {isEditing ? (
          <EditarCursos cursos={cursosData} setCursos={setCursosData} />
        ) : (
          <ListaDeCursos cursos={cursosData} isEditing={isEditing} setCursos={setCursosData} />
        )}

        </div>
      </div>
    );
  };
  
  export default PerfilDeUsuario;
  