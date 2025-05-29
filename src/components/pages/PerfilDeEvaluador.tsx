import React, { useState } from "react";
import Header from "../organisms/Header";
import PerfilCard from "../organisms/PerfilCard";
import profileIcon from "../../assets/profileIcon.png";
import Educacion from "../molecule/Educacion";
import ListaDeHabilidades from "../molecule/ListaDeHabilidades";
import EditarHabilidades from "../molecule/EditarHabilidades";

const PerfilDeEvaluador: React.FC = () => {
    const [userData, setUserData] = useState({
      nombre: "Juan Perez",
      fotoPerfil: profileIcon,
      profesion: "Ingeniero",
      ubicacion: "Santiago, Chile",
      descripcion: "Soy diseñador de productos en Meta. He estado trabajando en la aplicación de Facebook durante 3 años, enfocándome en el Feed de Noticias y en los Grupos. Antes de Meta, trabajé en Google como diseñador de experiencia de usuario en Maps y Search. Tengo una licenciatura en Diseño de RISD."
    });


    const [educacionData, setEducacionData] = useState({
      institucion: "Universidad de Chile",
      fecha: "2015 - 2020"
    });

    const [habilidadesData, setHabilidadesData] = useState<string[]>(["Diseñador", "Programador", "React", "Java", "Python", "AWS"]);


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
      <div  >
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
        
        

        <Educacion educacion={educacionData} isEditing={isEditing} setEducacion={setEducacionData} toggleEditing={toggleEditing} />
        
        {isEditing ? (
          <EditarHabilidades habilidades={habilidadesData} setHabilidades={setHabilidadesData} />
        ) : (
          <ListaDeHabilidades habilidades={habilidadesData} isEditing={isEditing} setHabilidades={setHabilidadesData} />
        )}

        
        </div>
      </div>
    );
  };
  
  export default PerfilDeEvaluador;
  