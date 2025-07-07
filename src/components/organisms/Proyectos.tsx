import React, { useState, useEffect } from 'react';
import InformationCard from "../molecule/InformationCard";
import TrendChart from "../molecule/TrendChart";
import EvaluacionProyectosTabla from "./EvaluacionProyectosTabla";
import DescargarCSV from "../atoms/DescargarCSV";
import { useNavigate } from 'react-router-dom';

const Proyectos: React.FC = () => {
  const [totalEvaluations, setTotalEvaluations] = useState<number | string>('--');
  const [averageScore, setAverageScore] = useState<string>('--/100');
  const [evaluatedProjectsCount, setEvaluatedProjectsCount] = useState<number | string>('--');
  const [enrichedEvaluations, setEnrichedEvaluations] = useState<any[]>([]);
  const [dailyAverages, setDailyAverages] = useState<number[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluationData = async () => {
      const userToken = localStorage.getItem('userToken');

      if (!userToken) {
        
        // navigate('/login'); // Uncomment if you want to redirect
        return;
      }

      const apiUrlEvaluations = 'https://egresados.it2id.cc/api/evaluations';
      const apiUrlProjectsBase = 'https://egresados.it2id.cc/api/projects/';
      const apiUrlUsersBase = 'https://egresados.it2id.cc/api/users/'; // API de usuarios

      try {
        // 1. Fetch evaluations
        const evaluationsResponse = await fetch(apiUrlEvaluations, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!evaluationsResponse.ok) {
          console.error('Error fetching evaluations:', evaluationsResponse.status);
          setTotalEvaluations('Error');
          setAverageScore('Error/100');
          setEvaluatedProjectsCount('Error');
          setEnrichedEvaluations([]);
          return;
        }

        const evaluationsData = await evaluationsResponse.json();

        // Calculate statistics (using evaluationsData)
        const total = evaluationsData.length;
        setTotalEvaluations(total);

        const uniqueProjectIds = Array.from(new Set<number>(evaluationsData.map((evaluation: any) => evaluation.proyecto_id)));
        setEvaluatedProjectsCount(uniqueProjectIds.length);

        let totalCriterionScoreSum = 0;
        let totalCriterionCount = 0;
        evaluationsData.forEach((evaluation: any) => {
          if (evaluation.criterios && Array.isArray(evaluation.criterios)) {
            evaluation.criterios.forEach((criterio: any) => {
              if (typeof criterio.puntuacion === 'number') {
                totalCriterionScoreSum += criterio.puntuacion;
                totalCriterionCount++;
              }
            });
          }
        });

        const avg = totalCriterionCount > 0 ? (totalCriterionScoreSum / totalCriterionCount) : 0;
        setAverageScore(`${Math.round(avg)}/100`);

        // Calculate daily averages for the last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return date;
        });

        const averages = last7Days.map(day => {
          const evaluationsOnDay = evaluationsData.filter((evaluation: any) => {
            const evaluationDate = new Date(evaluation.creado_en);
            return evaluationDate.toDateString() === day.toDateString();
          });

          if (evaluationsOnDay.length === 0) {
            return 0;
          }

          let totalCriterionScoreSum = 0;
          let totalCriterionCount = 0;

          evaluationsOnDay.forEach((evaluation: any) => {
            if (evaluation.criterios && Array.isArray(evaluation.criterios)) {
              evaluation.criterios.forEach((criterio: any) => {
                if (typeof criterio.puntuacion === 'number') {
                  totalCriterionScoreSum += criterio.puntuacion;
                  totalCriterionCount++;
                }
              });
            }
          });

          return totalCriterionCount > 0 ? (totalCriterionScoreSum / totalCriterionCount) : 0;
        });

        setDailyAverages(averages);

        // 2. Fetch details for each unique evaluated project to get egresado_id
        const projectDetailsPromises = uniqueProjectIds.map(async (projectId) => {
          try {
            const projectResponse = await fetch(`${apiUrlProjectsBase}${projectId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (!projectResponse.ok) {
              console.error(`Error fetching project ${projectId} details:`, projectResponse.status);
              return null; // Return null or handle error as needed
            }

            const projectData = await projectResponse.json();
            return projectData; 

          } catch (error) {
            console.error(`Error fetching project ${projectId} details:`, error);
            return null;
          }
        });

        const fetchedProjectDetails = await Promise.all(projectDetailsPromises);
        const validProjectDetails = fetchedProjectDetails.filter(detail => detail !== null);
        // Map project details by ID for easy lookup
        const projectDetailsMap = new Map(validProjectDetails.map(project => [project.id, project]));

        // 3. Fetch details for unique evaluators and egresados
        const uniqueEvaluatorIds = Array.from(new Set<number>(evaluationsData.map((evaluation: any) => evaluation.evaluador_id)));
        const uniqueEgresadoIds = Array.from(new Set<number>(validProjectDetails.map(project => project.egresado_id)));
        const uniqueUserIds = Array.from(new Set([...uniqueEvaluatorIds, ...uniqueEgresadoIds]));

        const userDetailsPromises = uniqueUserIds.map(async (userId) => {
             if (userId === null || userId === undefined) return null; // Handle potential null/undefined IDs
             try {
               const userResponse = await fetch(`${apiUrlUsersBase}${userId}`, {
                 method: 'GET',
                 headers: {
                   'Authorization': `Bearer ${userToken}`,
                   'Content-Type': 'application/json',
                 },
               });

               if (!userResponse.ok) {
                 console.error(`Error fetching user ${userId} details:`, userResponse.status);
                 return null; 
               }

               const userData = await userResponse.json();
               return userData;

             } catch (error) {
               console.error(`Error fetching user ${userId} details:`, error);
               return null;
             }
           });

           const fetchedUserDetails = await Promise.all(userDetailsPromises);
           const validUserDetails = fetchedUserDetails.filter(user => user !== null);
           // Map user details by ID for easy lookup
           const userDetailsMap = new Map(validUserDetails.map(user => [user.id, user]));

        // 4. Combine data: enrich evaluations with project and user names
        const combinedEvaluations = evaluationsData.map((evaluation: any) => {
            const project = projectDetailsMap.get(evaluation.proyecto_id);
            const evaluator = userDetailsMap.get(evaluation.evaluador_id);
            const student = project ? userDetailsMap.get(project.egresado_id) : null;

            // Calculate average score for the current evaluation
            let evaluationCriterionScoreSum = 0;
            let evaluationCriterionCount = 0;
             if (evaluation.criterios && Array.isArray(evaluation.criterios)) {
               evaluation.criterios.forEach((criterio: any) => {
                 if (typeof criterio.puntuacion === 'number') {
                   evaluationCriterionScoreSum += criterio.puntuacion;
                   evaluationCriterionCount++;
                 }
               });
             }
             const evaluationAvgScore = evaluationCriterionCount > 0 ? (evaluationCriterionScoreSum / evaluationCriterionCount) : 0;

            return {
                ...evaluation, // Keep original evaluation data
                projectName: project ? project.titulo : 'N/A',
                studentName: student ? student.nombre : 'N/A',
                evaluatorName: evaluator ? evaluator.nombre : 'N/A',
                averageEvaluationScore: Math.round(evaluationAvgScore), // Add calculated avg score for this evaluation
            };
        });

        setEnrichedEvaluations(combinedEvaluations);

        // Calculate the average of the average scores for each evaluation
        let sumOfEvaluationAverages = 0;
        if (combinedEvaluations.length > 0) {
            combinedEvaluations.forEach((evaluation: any) => {
                sumOfEvaluationAverages += evaluation.averageEvaluationScore;
            });
            const overallAverage = sumOfEvaluationAverages / combinedEvaluations.length;
            setAverageScore(`${Math.round(overallAverage)}/100`); // Round and format
        } else {
             setAverageScore('--/100');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setTotalEvaluations('Error');
        setAverageScore('Error/100');
        setEvaluatedProjectsCount('Error');
        setEnrichedEvaluations([]);
      }
    };

    fetchEvaluationData();
  }, [navigate]); // Dependencia de navigate para evitar advertencia

  const handleModifyRubricaClick = () => {
    navigate('/modificar-rubrica');
  };

  const data = [
    { title: "Evaluaciones totales", value: totalEvaluations.toString() },
    { title: "Puntuación promedio", value: averageScore },
    { title: "Proyectos evaluados", value: evaluatedProjectsCount.toString() }
  ];

  return (
    <div style={{ width: "100%", margin: "auto", textAlign: "center" }}>
      {/* Título principal */}
      <h1 style={{textAlign:"left", fontSize: "24px", marginBottom: "10px" }}>Resumen de las evaluaciones</h1>
      <p style={{textAlign:"left", fontSize: "14px", color: "#666", marginBottom: "20px" }}>
        Explore los resultados de la evaluación integral de los proyectos de desarrollo de software.
      </p>

      {/* Tarjetas de información */}
      <div style={{marginLeft:"10px",maxWidth:"99%", display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center" }}>
        {data.map((item, index) => (
          <div style={{ flex: "0 0 33%" }} key={index}>
            <InformationCard title={item.title} value={item.value} />
          </div>
        ))}
      </div>
      <div style={{borderRadius:"12px",border:"2px solid #dbe0e5",height:"420px", marginTop:"20px",padding:"20px"}}>
      <TrendChart dailyAverages={dailyAverages}></TrendChart>
      </div>
      <EvaluacionProyectosTabla evaluationsData={enrichedEvaluations}></EvaluacionProyectosTabla>
      <DescargarCSV 
        evaluationsData={enrichedEvaluations}
        totalEvaluations={totalEvaluations}
        averageScore={averageScore}
        evaluatedProjectsCount={evaluatedProjectsCount}
        dailyAverages={dailyAverages}
      ></DescargarCSV>
      {/* Nuevo botón para modificar rúbrica */}
      <button
        style={{
          backgroundColor: "#f0f2f5", 
          color: "#000", 
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "12px", 
          width:"100%",
          marginTop: "10px" 
        }}
        onClick={handleModifyRubricaClick}
      >
        Modificar Rúbrica
      </button>
    </div>
  );
};

export default Proyectos;
