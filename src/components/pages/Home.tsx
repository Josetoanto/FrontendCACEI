import React from 'react';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import Search from '../molecule/Search';

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
    return (
        <div>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu></HomeMenu>
            <Search></Search>
            <EncuestaList title={'Encuestas'} encuestas={encuestas}></EncuestaList>
            </div>
        </div>
    );
};

export default Home;
