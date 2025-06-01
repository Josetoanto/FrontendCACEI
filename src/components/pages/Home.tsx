import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import Proyectos from '../organisms/Proyectos';

// Eliminar el mock de encuestas ya que obtendremos datos de la API
// const encuestas = [
//     {
//       title: "Encuesta sobre satisfacción académica",
//       createdAt: "8:15 a.m.",
//     },
//     {
//       title: "Evaluación de nuevos cursos",
//       createdAt: "2:30 p.m.",
//     },
//     {
//       title: "Opinión sobre eventos universitarios",
//       createdAt: "5:45 p.m.",
//     }
//   ];

const Home: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Encuestas");
    const [encuestas, setEncuestas] = useState<any[]>([]); // Estado para almacenar encuestas de la API
    const navigate = useNavigate();

    const fetchEncuestas = useCallback(async () => {
        const userToken = localStorage.getItem('userToken');
        const userDataString = localStorage.getItem('userData');
        
        if (!userToken || !userDataString) {
            // Redirigir si no hay token o datos de usuario
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(userDataString);
            
            // Verificar si el usuario es Administrador
            if (userData.tipo === 'Administrador') {
                const apiUrl = 'https://gcl58kpp-8000.use2.devtunnels.ms/surveys/';

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    // Manejar respuestas no exitosas
                    console.error('Error al obtener encuestas:', response.status);
                    // Opcional: mostrar un mensaje al usuario
                     alert('No se pudieron cargar las encuestas.');
                    return;
                }

                const data = await response.json();
                // Mapear los datos de la API al formato esperado por EncuestaList/EncuestaCard
                const mappedEncuestas = data.map((encuesta: any) => ({
                    id: encuesta.id,
                    title: encuesta.titulo,
                    createdAt: new Date(encuesta.creado_en).toLocaleDateString(), // Puedes ajustar el formato si es necesario
                    inicio: new Date(encuesta.inicio),
                    fin: new Date(encuesta.fin),
                    // Si necesitas la descripción u otros campos en el futuro, añádelos aquí
                }));
                setEncuestas(mappedEncuestas);
            }

        } catch (error) {
            console.error('Error al obtener encuestas:', error);
             alert('Error al cargar encuestas.');
        }
    }, [navigate]);

    useEffect(() => {
        fetchEncuestas();
    }, [fetchEncuestas]); // Ahora fetchEncuestas es una dependencia

    const now = new Date();

    const activeEncuestas = encuestas.filter(encuesta =>
        encuesta.inicio <= now && encuesta.fin >= now
    );

    const closedEncuestas = encuestas.filter(encuesta =>
        encuesta.fin < now
    );

    return (
        <div style={{paddingBottom:"24px"}}>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu activeOption={activeOption} setActiveOption={setActiveOption} options={ ["Encuestas", "Activas", "Cerradas", "Proyectos"]} />
            {/* Mostrar EncuestaList basado en la opción activa y el tipo de usuario */}
            {activeOption === "Encuestas" && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') || '{}').tipo === 'Administrador' && encuestas.length > 0 && <EncuestaList title={'Todas las Encuestas'} encuestas={encuestas} onRefreshEncuestas={fetchEncuestas}></EncuestaList>}
            {activeOption === "Activas" && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') || '{}').tipo === 'Administrador' && activeEncuestas.length > 0 && <EncuestaList title={'Encuestas Activas'} encuestas={activeEncuestas} onRefreshEncuestas={fetchEncuestas}></EncuestaList>}
            {activeOption === "Cerradas" && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') || '{}').tipo === 'Administrador' && (
                closedEncuestas.length > 0 ? (
                    <EncuestaList title={'Encuestas Cerradas'} encuestas={closedEncuestas} onRefreshEncuestas={fetchEncuestas}></EncuestaList>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No hay encuestas cerradas en este momento.</p>
                )
            )}
            {/* Eliminar el placeholder de Calendario */}
            {/* {activeOption === "Calendario" && <div>Contenido para Calendario</div>} */}
            {activeOption === "Proyectos" && <Proyectos></Proyectos>}
            {/* Botón para crear encuesta solo si activeOption es "Encuestas" y el usuario es Administrador */}
            {activeOption === "Encuestas" && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData') || '{}').tipo === 'Administrador' && (
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
