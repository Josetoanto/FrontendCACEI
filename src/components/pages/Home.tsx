import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import Proyectos from '../organisms/Proyectos';
import Swal from 'sweetalert2';



const Home: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Encuestas");
    const [encuestas, setEncuestas] = useState<any[]>([]); // Estado para almacenar encuestas de la API
    const navigate = useNavigate();
    const [userType, setUserType] = useState<string | undefined>(undefined); // Estado para el tipo de usuario

    const fetchEncuestas = useCallback(async () => {
        const userToken = localStorage.getItem('userToken');
        const userDataString = localStorage.getItem('userData');
        
        if (!userToken || !userDataString) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(userDataString);
            setUserType(userData.tipo); // Guardar el tipo de usuario en el estado
            
            // Verificar si el usuario es Administrador
            if (userData.tipo === 'Administrador') {
                const apiUrl = 'http://188.68.59.176:8000/surveys/';

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
                     Swal.fire('Error', 'No se pudieron cargar las encuestas.', 'error');
                    return;
                }

                const data = await response.json();
                console.log("Datos crudos de la API:", data);
                
                // Mapear los datos de la API al formato esperado por EncuestaList/EncuestaCard
                const mappedEncuestas = data.map((encuesta: any) => {
                    const inicioDate = new Date(encuesta.inicio);
                    const finDate = new Date(encuesta.fin);
                    const creadoDate = new Date(encuesta.creado_en);
                    
                    console.log(`Encuesta ${encuesta.id}:`, {
                        titulo: encuesta.titulo,
                        inicio: encuesta.inicio,
                        fin: encuesta.fin,
                        creado_en: encuesta.creado_en,
                        inicioDate,
                        finDate,
                        creadoDate
                    });
                    
                    return {
                        id: encuesta.id,
                        title: encuesta.titulo,
                        createdAt: creadoDate.toLocaleDateString(),
                        inicio: inicioDate,
                        fin: finDate,
                    };
                });
                setEncuestas(mappedEncuestas);
                console.log("Todas las encuestas mapeadas:", mappedEncuestas);
            }

        } catch (error) {
            console.error('Error al obtener encuestas:', error);
             Swal.fire('Error', 'Error al cargar encuestas.', 'error');
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

    // Agregar logs para depuración
    console.log("Fecha actual:", now);
    console.log("Todas las encuestas:", encuestas);
    console.log("Encuestas activas:", activeEncuestas);
    console.log("Encuestas cerradas:", closedEncuestas);

   

    return (
        <div style={{paddingBottom:"24px"}}>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu activeOption={activeOption} setActiveOption={setActiveOption} options={ ["Encuestas", "Activas", "Cerradas", "Proyectos"]} />
            {/* Mostrar EncuestaList basado en la opción activa y el tipo de usuario */}
            {activeOption === "Encuestas" && userType === 'Administrador' && (
                encuestas.length > 0 ? (
                    <EncuestaList title={'Todas las Encuestas'} encuestas={encuestas} onRefreshEncuestas={fetchEncuestas} userType={userType}></EncuestaList>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No hay encuestas disponibles.</p>
                )
            )}
            {activeOption === "Activas" && userType === 'Administrador' && (
                activeEncuestas.length > 0 ? (
                    <EncuestaList title={'Encuestas Activas'} encuestas={activeEncuestas} onRefreshEncuestas={fetchEncuestas} userType={userType}></EncuestaList>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No hay encuestas activas en este momento.</p>
                )
            )}
            {activeOption === "Cerradas" && userType === 'Administrador' && (
                closedEncuestas.length > 0 ? (
                    <EncuestaList title={'Encuestas Cerradas'} encuestas={closedEncuestas} onRefreshEncuestas={fetchEncuestas} userType={userType}></EncuestaList>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No hay encuestas cerradas en este momento.</p>
                )
            )}
            {activeOption === "Proyectos" && <Proyectos></Proyectos>}
            {/* Botón para crear encuesta solo si activeOption es "Encuestas" y el usuario es Administrador */}
            {activeOption === "Encuestas" && userType === 'Administrador' && (
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
