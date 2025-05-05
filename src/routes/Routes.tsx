import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../components/pages/Home';
import RevisionPage from '../components/pages/RevisionPage';
import HomeEgresado from '../components/pages/HomeEgresado';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/egresado" element={<HomeEgresado />} />

                <Route path="/revision" element={<RevisionPage />} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;
