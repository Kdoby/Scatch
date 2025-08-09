import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import TimeTablePage from './pages/TimeTablePage';
import RoutinePage from './pages/RoutinePage';
import AuthPage from './pages/AuthPage';

import axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const hideMenu = (location.pathname === "/login" || location.pathname === "/Login" || location.pathname === "/signup");

    return (
        <div className="App"
             style={{
                 display: "grid",
                 gridTemplateColumns: hideMenu ? "1fr" : "1fr 10fr",
                 gap: "20px",
                 height: "100%"
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

            <div className="screen" style={{}}>
                <Routes>
                    <Route path="/login" element={<AuthPage type="login" />} />
                    <Route path="/signup" element={<AuthPage type="signup" />} />

                    {/* 보호된 라우트 */}
                    <Route path="/" element={ <HomePage /> } />
                    <Route path="/calendar" element={
                        <CalendarPage/>
                    } />
                    <Route path="/timetable" element={ <TimeTablePage /> } />
                    <Route path="/routine" element={ <RoutinePage /> } />
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
