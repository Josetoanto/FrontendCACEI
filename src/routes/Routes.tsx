import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import RevisionPage from '../components/pages/RevisionPage';
import HomeEgresado from '../components/pages/HomeEgresado';
import AgregarProyecto from '../components/pages/AgregarProyecto';
import HomeEvaluador from '../components/pages/HomeEvaluador';
import EvaluacionProyecto from '../components/pages/EvaluacionProyecto';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/egresado" element={<HomeEgresado />} />
                <Route path="/revision" element={<RevisionPage />} />
                <Route path="/agregarProyecto" element={<AgregarProyecto></AgregarProyecto>} />
                <Route path="/evaluador" element={<HomeEvaluador></HomeEvaluador>} />
                <Route path="/evaluar" element={<EvaluacionProyecto></EvaluacionProyecto>} />


            </Routes>
        </Router>
    );
};

export default AppRoutes;
