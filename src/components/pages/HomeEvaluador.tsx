import React, { useState, useEffect, useCallback } from 'react';
import Header from '../organisms/Header';
import HomeMenu from '../molecule/homeMenu';
import EncuestaList from '../organisms/EncuestaList';
import { useNavigate } from 'react-router-dom';
import ListaDeProyectosAEvaluar from '../organisms/ListaDeProyectosAEvaluar';



const HomeEvaluador: React.FC = () => {
    const [activeOption, setActiveOption] = useState("Activas");
    const [activeEncuestas, setActiveEncuestas] = useState<any[]>([]);
    const [futureEncuestas, setFutureEncuestas] = useState<any[]>([]);
    const [unEvaluatedProjects, setUnEvaluatedProjects] = useState<any[]>([]);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userType = userData.tipo; // Obtener el tipo de usuario
    const evaluadorId = userData.id; // Asumiendo que el ID del evaluador está en userData.id

    const fetchEncuestas = useCallback(async () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            navigate('/login');
            return;
        }

        try {
            const apiUrl = 'http://localhost:8000/surveys/';
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

            const egresadoEncuestas = data.filter((encuesta: any) => encuesta.tipo === 'empleador');

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

    const fetchAndFilterProjects = useCallback(async () => {
        const userToken = localStorage.getItem('userToken');
        if (!userToken || !evaluadorId) {
            navigate('/login');
            return;
        }

        try {
            // Obtener todos los proyectos
            const projectsApiUrl = 'http://localhost:8000/projects';
            const projectsResponse = await fetch(projectsApiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!projectsResponse.ok) {
                console.error('Error al obtener proyectos:', projectsResponse.status);
                alert('No se pudieron cargar los proyectos.');
                return;
            }
            const allProjects = await projectsResponse.json();

            // Obtener todas las evaluaciones
            const evaluationsApiUrl = 'http://localhost:8000/evaluations';
            const evaluationsResponse = await fetch(evaluationsApiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!evaluationsResponse.ok) {
                console.error('Error al obtener evaluaciones:', evaluationsResponse.status);
                alert('No se pudieron cargar las evaluaciones.');
                return;
            }
            const allEvaluations = await evaluationsResponse.json();

            // Obtener todos los usuarios para mapear egresado_id a nombre
            const egresadoIdsRaw = allProjects.map((p: any) => p.egresado_id);
            const uniqueEgresadoIds: number[] = [...new Set(egresadoIdsRaw as number[])];
            const userPromises = uniqueEgresadoIds.map(async (egresadoId: number) => {
              const userResponse = await fetch(`http://localhost:8000/users/${egresadoId}`, {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${userToken}`,
                      'Content-Type': 'application/json',
                  },
              });
              if (!userResponse.ok) {
                  console.error(`Error al obtener usuario ${egresadoId}:`, userResponse.status);
                  return null; // O manejar el error de otra forma
              }
              return userResponse.json();
            });

            const allUsersData = await Promise.all(userPromises);
            const userIdToNameMap = new Map();
            allUsersData.forEach((user: any) => {
                if (user) {
                    userIdToNameMap.set(user.id, `${user.nombre}`);
                }
            });

            // Identificar proyectos ya evaluados por el evaluador logeado
            const evaluatedProjectIds = new Set<number>();
            allEvaluations.forEach((evaluation: any) => {
                if (evaluation.evaluador_id === evaluadorId) {
                    evaluatedProjectIds.add(evaluation.proyecto_id);
                }
            });

            // Filtrar proyectos no evaluados
            const filteredProjects = allProjects.filter((proyecto: any) => 
                !evaluatedProjectIds.has(proyecto.id)
            ).map((proyecto: any) => ({
                id: proyecto.id,
                nombreProyecto: proyecto.titulo,
                estudiante: userIdToNameMap.get(proyecto.egresado_id) || 'Desconocido',
                fechaDeSubida: new Date(proyecto.creado_en).toLocaleDateString(),
            }));
            
            setUnEvaluatedProjects(filteredProjects);
            console.log("Proyectos mapeados y filtrados:", filteredProjects);

        } catch (error) {
            console.error('Error al obtener o filtrar proyectos:', error);
            alert('Error al cargar o filtrar proyectos.');
        }
    }, [navigate, evaluadorId]);

    useEffect(() => {
        fetchEncuestas();
        fetchAndFilterProjects();
    }, [fetchEncuestas, fetchAndFilterProjects]);

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
                <ListaDeProyectosAEvaluar proyectos={unEvaluatedProjects}></ListaDeProyectosAEvaluar>
            }
            </div>
        </div>
    );
};

export default HomeEvaluador;
