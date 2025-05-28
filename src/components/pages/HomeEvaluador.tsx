import React, { useState } from 'react';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import ListaDeProyectosAEvaluar from '../organisms/ListaDeProyectosAEvaluar';



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

const HomeEvaluador: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Encuestas");

    return (
        <div>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu  activeOption={activeOption} setActiveOption={setActiveOption} options={ ["Encuestas","Proyectos"]} />
            {activeOption === "Encuestas" && <EncuestaList title={'Encuestas'} encuestas={encuestas}></EncuestaList>}
            {activeOption === "Proyectos" && <ListaDeProyectosAEvaluar></ListaDeProyectosAEvaluar>
        }
            </div>
        </div>
    );
};

export default HomeEvaluador;
