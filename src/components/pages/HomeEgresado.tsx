import React, { useState, useEffect, useCallback } from 'react';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import ListaDeProyectos from '../organisms/ListaDeProyectos';
import { useNavigate } from 'react-router-dom';



const HomeEgresado: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Activas");
    const [activeEncuestas, setActiveEncuestas] = useState<any[]>([]);
    const [futureEncuestas, setFutureEncuestas] = useState<any[]>([]);
    const [userProjects, setUserProjects] = useState<any[]>([]);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userType = userData.tipo; // Obtener el tipo de usuario
    const egresadoId = userData.id; // Obtener el ID del egresado

    const fetchEncuestas = useCallback(async () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            navigate('/login');
            return;
        }

        try {
            const apiUrl = 'http://188.68.59.176:8000/surveys/';
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Error al obtener encuestas:', response.status);
                alert('No se pudieron cargar las encuestas.');
                return;
            }

            const data = await response.json();
            const now = new Date();

            const egresadoEncuestas = data.filter((encuesta: any) => encuesta.tipo === 'egresado');

            const mappedActiveEncuestas = egresadoEncuestas.filter((encuesta: any) => {
                const inicio = new Date(encuesta.inicio);
                const fin = new Date(encuesta.fin);
                return inicio <= now && fin >= now;
            }).map((encuesta: any) => ({
                id: encuesta.id,
                title: encuesta.titulo,
                createdAt: new Date(encuesta.creado_en).toLocaleDateString(),
                inicio: new Date(encuesta.inicio),
                fin: new Date(encuesta.fin),
            }));

            const mappedFutureEncuestas = egresadoEncuestas.filter((encuesta: any) => {
                const inicio = new Date(encuesta.inicio);
                return inicio > now;
            }).map((encuesta: any) => ({
                id: encuesta.id,
                title: encuesta.titulo,
                createdAt: new Date(encuesta.creado_en).toLocaleDateString(),
                inicio: new Date(encuesta.inicio),
                fin: new Date(encuesta.fin),
            }));

            setActiveEncuestas(mappedActiveEncuestas);
            setFutureEncuestas(mappedFutureEncuestas);

        } catch (error) {
            console.error('Error al obtener encuestas:', error);
            alert('Error al cargar encuestas.');
        }
    }, [navigate]);

    const fetchUserProjects = useCallback(async () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            navigate('/login');
            return;
        }

        try {
            const apiUrl = 'http://188.68.59.176:8000/projects';
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Error al obtener proyectos:', response.status);
                alert('No se pudieron cargar los proyectos.');
                return;
            }

            const data = await response.json();
            const filteredProjects = data.filter((proyecto: any) => proyecto.egresado_id === egresadoId);
            
            const mappedProjects = filteredProjects.map((proyecto: any) => ({
                id: proyecto.id,
                nombre: proyecto.titulo,
                fecha: new Date(proyecto.creado_en).toLocaleDateString(),
            }));
            setUserProjects(mappedProjects);

        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            alert('Error al cargar proyectos.');
        }
    }, [navigate, egresadoId]);

    useEffect(() => {
        fetchEncuestas();
        fetchUserProjects();
    }, [fetchEncuestas, fetchUserProjects]);

    return (
        <div>
            <Header></Header>
            <div style={{ width: '75%', margin: '0 auto'}}>
            <h2 style={{paddingLeft:"2px", fontSize:"32px"}}>Inicio</h2>
            <HomeMenu  activeOption={activeOption} setActiveOption={setActiveOption} options={ ["Activas","Futuras","Proyectos"]} />
            {activeOption === "Activas" && (activeEncuestas.length > 0 ? 
                <EncuestaList title={'Encuestas Activas'} encuestas={activeEncuestas} onRefreshEncuestas={fetchEncuestas} userType={userType}></EncuestaList>
                : <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No hay encuestas activas en este momento.</p>
            )}
            {activeOption === "Futuras" && (futureEncuestas.length > 0 ?
                <EncuestaList title={'Encuestas Futuras'} encuestas={futureEncuestas.map(e => ({ ...e, isFuture: true }))} onRefreshEncuestas={fetchEncuestas} userType={userType}></EncuestaList>
                : <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>No hay encuestas futuras en este momento.</p>
            )}
            {activeOption === "Proyectos" && 
                <ListaDeProyectos 
                    titulo="Mis proyectos" 
                    proyectos={userProjects} 
                    onDelete={fetchUserProjects} 
                />
            }
            </div>
        </div>
    );
};

export default HomeEgresado;
