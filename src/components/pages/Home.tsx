import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

    return (
        <div style={{paddingBottom:"24px"}}>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu activeOption={activeOption} setActiveOption={setActiveOption} options={ ["Encuestas", "Activas", "Calendario", "Cerradas", "Proyectos"]} />
            {activeOption === "Encuestas" && <EncuestaList title={'Encuestas'} encuestas={encuestas}></EncuestaList>}
            {activeOption === "Activas" && <div>Contenido para Activas</div>}
            {activeOption === "Cerradas" && <div>Contenido para Cerradas</div>}
            {activeOption === "Calendario" && <div>Contenido para Calendario</div>}
            {activeOption === "Proyectos" && <Proyectos></Proyectos>}
            {activeOption === "Encuestas" && (
                <button
                    onClick={() => navigate('/crearEncuesta')}
                    style={{
                        position: "fixed",
                        bottom: "32px",
                        right: "32px",
                        background: "#6c63ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "60px",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 16px 0 #ece6f6",
                        fontSize: "32px",
                        cursor: "pointer",
                        zIndex: 1000
                    }}
                    title="Crear nueva encuesta"
                >
                    +
                </button>
            )}
            </div>
        </div>
    );
};

export default Home;
