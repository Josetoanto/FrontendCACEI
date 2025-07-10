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
import Configuracion from '../components/pages/Configuracion';
import GestionUsuarios from '../components/pages/GestionUsuarios';
import GestionCamposEducacionales from '../components/pages/GestionCamposEducacionales';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ingresar-codigo" element={<IngresarCodigo />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/egresado" element={<ProtectedRoute><HomeEgresado /></ProtectedRoute>} />
                <Route path="/revision/proyecto/:projectId/evaluacion/:evaluationId" element={<ProtectedRoute><RevisionPage /></ProtectedRoute>} />
                <Route path="/agregarProyecto" element={<ProtectedRoute><AgregarProyecto /></ProtectedRoute>} />
                <Route path="/evaluador" element={<ProtectedRoute><HomeEvaluador /></ProtectedRoute>} />
                <Route path="/evaluar/:evaluationId" element={<ProtectedRoute><EvaluacionProyecto /></ProtectedRoute>} />
                <Route path="/perfil/:userId" element={<ProtectedRoute><PerfilDeUsuario /></ProtectedRoute>} />
                <Route path="/perfilEvaluador" element={<ProtectedRoute><PerfilDeEvaluador /></ProtectedRoute>} />
                <Route path="/crearEncuesta/:id?" element={<ProtectedRoute><CrearEncuesta /></ProtectedRoute>} />
                <Route path="/responderEncuesta/:id" element={<ResponderEncuesta />} />
                <Route path="/modificar-rubrica" element={<ProtectedRoute><ModificarRubrica /></ProtectedRoute>} />
                <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
                <Route path="/gestion-usuarios" element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} />
                <Route path="/gestion-campos-educacionales" element={<ProtectedRoute><GestionCamposEducacionales /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
