import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import TimeTablePage from './pages/TimeTablePage';
import RoutinePage from './pages/RoutinePage';
import Login from './login/Login';
import Signup from './login/Signup';

import ProtectedRoute from './login/ProtectedRoute';

import './App.css';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

function AppContent() {
    const location = useLocation();
    const hideMenu = (location.pathname === "/login" || location.pathname === "/Login" || location.pathname === "/signup");

    return (
        <div className="App"
             style={{
                 display: "grid",
                 gridTemplateColumns: hideMenu ? "1fr" : "1fr 10fr",
                 gap: "20px"
             }}
        >
            {!hideMenu && (
                <div className="menu">
                    <div style={{margin:"20px 0"}}><Link to="/">HOME</Link></div>
                    <div style={{margin:"20px 0"}}>USER</div>
                    <div style={{margin:"20px 0"}}>TODO</div>
                    <div style={{margin:"20px 0"}}><Link to="/calendar">CALENDAR</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/timetable">TIMETABLE</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/routine">ROUTINE</Link></div>
                    <div style={{margin:"20px 0"}}>STUDY LOG</div>
                </div>
            )}

            <div className="screen">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* 보호된 라우트 */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/calendar" element={
                        <ProtectedRoute>
                            <CalendarPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/timetable" element={
                        <ProtectedRoute>
                            <TimeTablePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/routine" element={
                        <ProtectedRoute>
                            <RoutinePage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
