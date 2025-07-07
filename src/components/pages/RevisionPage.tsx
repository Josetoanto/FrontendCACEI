import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InformationCard from "../molecule/InformationCard";
import DetallesDelProyecto from "../organisms/DetallesDelProyecto";
import EstadoDeProyecto from "../organisms/EstadoDeProyecto";
import Header from "../organisms/Header";
import Rubrica from "../organisms/Rubrica";

const Revision: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { evaluationId } = useParams<{ evaluationId: string }>();
    const [projectDetails, setProjectDetails] = useState<any>(null);
    const [studentName, setStudentName] = useState<string | null>(null);
    const [projectEvaluations, setProjectEvaluations] = useState<any[]>([]);
    const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
    const [evidenceData, setEvidenceData] = useState<any[]>([]);
    const [evaluatorName, setEvaluatorName] = useState<string | null>(null);
    const [evaluatorId, setEvaluatorId] = useState<string | null>(null);
    const [, setAllCriteria] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const userToken = localStorage.getItem('userToken');

            if (!userToken || !projectId || !evaluationId) {
                console.log('No user token, project ID, or evaluation ID found.');
                return;
            }

            const apiUrlEvaluations = 'http://188.68.59.176:8000/evaluations';
            const apiUrlEvaluationSpecific = `http://188.68.59.176:8000/evaluations/${evaluationId}`;
            const apiUrlProjectsBase = 'http://188.68.59.176:8000/projects/';
            const apiUrlUsersBase = 'http://188.68.59.176:8000/users/';
            const apiUrlEvidencesBase = 'http://188.68.59.176:8000/evidences/project/';
            const apiUrlCriteria = 'http://188.68.59.176:8000/criteria';

            try {
                const specificEvaluationResponse = await fetch(apiUrlEvaluationSpecific, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!specificEvaluationResponse.ok) {
                    console.error(`Error fetching specific evaluation ${evaluationId} details:`, specificEvaluationResponse.status);
                    setCurrentEvaluation(null);
                    return;
                }
                const specificEvaluationData = await specificEvaluationResponse.json();

                // Obtener todos los criterios
                const criteriaResponse = await fetch(apiUrlCriteria, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!criteriaResponse.ok) {
                    console.error('Error fetching criteria:', criteriaResponse.status);
                    setAllCriteria([]);
                    return;
                }
                const criteriaData = await criteriaResponse.json();
                setAllCriteria(criteriaData);

                // Mapear los nombres de los criterios a la evaluación específica
                const enrichedCriterios = specificEvaluationData.criterios.map((criterioEvaluado: any) => {
                    const matchingCriterion = criteriaData.find((criterio: any) => criterio.id === criterioEvaluado.criterio_id);
                    return {
                        ...criterioEvaluado,
                        nombre: matchingCriterion ? matchingCriterion.nombre : 'Criterio desconocido',
                    };
                });

                setCurrentEvaluation({
                    ...specificEvaluationData,
                    criterios: enrichedCriterios,
                });

                // Obtener el nombre del evaluador
                const evaluatorId = specificEvaluationData.evaluador_id;
                if (evaluatorId) {
                    const evaluatorResponse = await fetch(`${apiUrlUsersBase}${evaluatorId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (evaluatorResponse.ok) {
                        const evaluatorData = await evaluatorResponse.json();
                        setEvaluatorName(evaluatorData.nombre);
                        setEvaluatorId(evaluatorId);
                    } else {
                        console.error(`Error fetching evaluator ${evaluatorId} details:`, evaluatorResponse.status);
                        setEvaluatorName('N/A');
                        setEvaluatorId(null);
                    }
                } else {
                    setEvaluatorName('N/A');
                    setEvaluatorId(null);
                }

                const projectResponse = await fetch(`${apiUrlProjectsBase}${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!projectResponse.ok) {
                    console.error(`Error fetching project ${projectId} details:`, projectResponse.status);
                    setProjectDetails(null);
                    setStudentName('Error');
                    setProjectEvaluations([]);
                    setEvidenceData([]);
                    return;
                }

                const projectData = await projectResponse.json();
                setProjectDetails(projectData);

                const egresadoId = projectData.egresado_id;
                if (!egresadoId) {
                    console.error('Egresado ID not found in project data.');
                    setStudentName('N/A');
                }

                const userResponse = await fetch(`${apiUrlUsersBase}${egresadoId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!userResponse.ok) {
                    console.error(`Error fetching user ${egresadoId} details:`, userResponse.status);
                    setStudentName('N/A');
                }

                const userData = await userResponse.json();
                setStudentName(userData.nombre);

                const evaluationsResponse = await fetch(apiUrlEvaluations, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!evaluationsResponse.ok) {
                    console.error('Error fetching all evaluations:', evaluationsResponse.status);
                    setProjectEvaluations([]);
                    return;
                }

                const allEvaluationsData = await evaluationsResponse.json();
                const projectEvaluationsFiltered = allEvaluationsData.filter((evalItem: any) => evalItem.proyecto_id.toString() === projectId);
                setProjectEvaluations(projectEvaluationsFiltered);

                const evidencesResponse = await fetch(`${apiUrlEvidencesBase}${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!evidencesResponse.ok) {
                    console.error(`Error fetching evidences for project ${projectId}:`, evidencesResponse.status);
                    setEvidenceData([]);
                    return;
                }

                const evidencesData = await evidencesResponse.json();
                setEvidenceData(evidencesData);

            } catch (error) {
                console.error('Error fetching data:', error);
                setProjectDetails(null);
                setStudentName('Error');
                setProjectEvaluations([]);
                setCurrentEvaluation(null);
                setEvidenceData([]);
                setEvaluatorName('Error');
                setEvaluatorId(null);
            }
        };

        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    const formattedCreationDate = projectDetails?.creado_en ? new Date(projectDetails.creado_en).toLocaleDateString() : 'Cargando...';
    
    let formattedProjectStatus = 'Cargando...';
    let projectStatusDescription = 'Estado actual del proyecto';

    if (projectDetails?.estado) {
        switch (projectDetails.estado) {
            case 'en_revision':
                formattedProjectStatus = evaluatorName ? `Revisado por ${evaluatorName}` : 'En revisión';
                projectStatusDescription = evaluatorName ? "Persona que ha realizado la evaluación" : "Estado actual del proyecto";
                break;
            case 'evaluado':
                formattedProjectStatus = 'Evaluado';
                break;
            case 'archivado':
                formattedProjectStatus = 'Archivado';
                break;
            default:
                formattedProjectStatus = projectDetails.estado;
        }
    }

    let averageEvaluationScore = '--';
    if(currentEvaluation && currentEvaluation.criterios && Array.isArray(currentEvaluation.criterios)){
        let totalCriterionScoreSum = 0;
        let totalCriterionCount = 0;
        currentEvaluation.criterios.forEach((criterio: any) => {
            if(typeof criterio.puntuacion === 'number'){
                totalCriterionScoreSum += criterio.puntuacion;
                totalCriterionCount++;
            }
        });
        averageEvaluationScore = totalCriterionCount > 0 ? Math.round(totalCriterionScoreSum / totalCriterionCount).toString() : '--';
    }

    let projectLatestComment = 'Sin comentario';
    if(currentEvaluation && currentEvaluation.criterios && Array.isArray(currentEvaluation.criterios) && currentEvaluation.criterios.length > 0) {
        const lastCriterionWithComment = [...currentEvaluation.criterios].reverse().find((criterio: any) => criterio.comentario);
        if(lastCriterionWithComment){
            projectLatestComment = lastCriterionWithComment.comentario;
        }
    }

    return (
        <div>
            <Header></Header>
            <div style={{ display: "flex", width: "100%", height: "100vh", boxSizing: "border-box" }}>
                {/* Columna izquierda (70%) */}
                <div style={{ flex: "70%", padding: "20px", backgroundColor: "transparent", borderRadius: "8px" }}>
                    <h2 style={{ fontSize: "24px" }}>Revisión de la presentación de proyectos</h2>
                    <p style={{ fontSize: "16px" }}>Revise la presentación del proyecto y la puntuación en función de la rúbrica proporcionada.</p>
                    <DetallesDelProyecto
                        titulo={projectDetails?.titulo || 'Cargando...'}
                        descripcion={projectDetails?.descripcion || 'Cargando...'}
                        evidencia={projectDetails?.evidencia || []}
                        evidenceFiles={evidenceData}
                        ultimoComentario={projectLatestComment}
                    />
                    <EstadoDeProyecto
                        evidenciasCount={evidenceData.length}
                        evaluationsCount={projectEvaluations.length}
                        uploadDate={formattedCreationDate}
                        projectStatus={formattedProjectStatus}
                        projectStatusDescription={projectStatusDescription}
                        evaluatorId={evaluatorId}
                    />
                    <h3 style={{ fontSize: "14px", color: "#61788A" }}>Subido por <Link to={`/perfil/${projectDetails?.egresado_id}`}>{studentName || 'Cargando...'}</Link> el {formattedCreationDate}</h3>
                </div>

                {/* Columna derecha (30%) */}
                <div style={{ flex: "30%", padding: "20px", backgroundColor: "transparent", borderRadius: "8px" }}>
                    <h3>Puntuacion general</h3>
                    <InformationCard title={"Puntos totales"} value={`${averageEvaluationScore}/100`} ></InformationCard>
                    <Rubrica evaluationDetails={currentEvaluation}></Rubrica>
                </div>
            </div>
        </div>
    );
};

export default Revision;
  
