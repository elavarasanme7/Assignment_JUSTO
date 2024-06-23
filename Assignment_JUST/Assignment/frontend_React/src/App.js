import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import OneTimeLink from './components/OnetimeLogin';
import ValidateToken from './components/ValidateToken';
import Home from './pages/Home';
import Protected from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/oneTime" element={<OneTimeLink />} />
                    <Route path="/dashboard" element={<Dashboard/> } />
                    <Route path="/protected" element={<Protected/> } />
                    <Route path="/validate" element={<ValidateToken/> } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;


