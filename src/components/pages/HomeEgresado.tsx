import React, { useState } from 'react';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import Proyectos from '../organisms/Proyectos';
import ListaDeProyectos from '../organisms/ListaDeProyectos';

const proyectosEjemplo = [
    { nombre: "Inclusión y diversidad en la empresa", fecha: "23 de jun. 2023" },
    { nombre: "Guía de orientación profesional", fecha: "02 de jun. 2023" },
    { nombre: "Tendencias en el mercado laboral", fecha: "29 de may. 2023" }
  ];

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

const HomeEgresado: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Encuestas");

    return (
        <div>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu  activeOption={activeOption} setActiveOption={setActiveOption} options={ ["Encuestas","Proyectos"]} />
            {activeOption === "Encuestas" && <EncuestaList title={'Encuestas'} encuestas={encuestas}></EncuestaList>}
            {activeOption === "Proyectos" && <ListaDeProyectos titulo="Mis proyectos" proyectos={proyectosEjemplo} />
        }
            </div>
        </div>
    );
};

export default HomeEgresado;
