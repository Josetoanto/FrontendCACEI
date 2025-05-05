import React, { useState } from 'react';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import Proyectos from '../organisms/Proyectos';

const encuestas = [
    {
      title: "Encuesta sobre satisfacción académica",
      createdAt: "8:15 a.m.",
    },
    {
      title: "Evaluación de nuevos cursos",
      createdAt: "2:30 p.m.",
    },
    {
      title: "Opinión sobre eventos universitarios",
      createdAt: "5:45 p.m.",
    }
  ];

const Home: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Encuestas");

    return (
        <div>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu activeOption={activeOption} setActiveOption={setActiveOption} />
            
            {activeOption === "Encuestas" && <EncuestaList title={'Encuestas'} encuestas={encuestas}></EncuestaList>}
            {activeOption === "Activas" && <div>Contenido para Activas</div>}
            {activeOption === "Cerradas" && <div>Contenido para Cerradas</div>}
            {activeOption === "Calendario" && <div>Contenido para Calendario</div>}
            {activeOption === "Proyectos" && <Proyectos></Proyectos>}
            </div>
        </div>
    );
};

export default Home;
