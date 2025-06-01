import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import RevisionPage from '../components/pages/RevisionPage';
import HomeEgresado from '../components/pages/HomeEgresado';
import AgregarProyecto from '../components/pages/AgregarProyecto';
import HomeEvaluador from '../components/pages/HomeEvaluador';
import EvaluacionProyecto from '../components/pages/EvaluacionProyecto';
import PerfilDeUsuario from '../components/pages/PerfilDeUsuario';
import PerfilDeEvaluador from '../components/pages/PerfilDeEvaluador';
import CrearEncuesta from '../components/pages/CrearEncuesta';
import ResponderEncuesta from '../components/pages/ResponderEncuesta';
import Login from '../components/pages/Login';
import IngresarCodigo from '../components/pages/IngresarCodigo';
import ModificarRubrica from '../components/pages/ModificarRubrica';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/egresado" element={<HomeEgresado />} />
                <Route path="/revision/proyecto/:projectId/evaluacion/:evaluationId" element={<RevisionPage />} />
                <Route path="/agregarProyecto" element={<AgregarProyecto></AgregarProyecto>} />
                <Route path="/evaluador" element={<HomeEvaluador></HomeEvaluador>} />
                <Route path="/evaluar/:evaluationId" element={<EvaluacionProyecto></EvaluacionProyecto>} />
                <Route path="/perfil/:userId" element={<PerfilDeUsuario></PerfilDeUsuario>} />
                <Route path="/perfilEvaluador" element={<PerfilDeEvaluador />} />
                <Route path="/crearEncuesta/:id?" element={<CrearEncuesta />} />
                <Route path="/responderEncuesta" element={<ResponderEncuesta />} />
                <Route path="/ingresar-codigo" element={<IngresarCodigo />} />
                <Route path="/modificar-rubrica" element={<ModificarRubrica />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
