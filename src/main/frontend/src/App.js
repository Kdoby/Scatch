import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import TimeTablePage from './pages/TimeTablePage';
import RoutinePage from './pages/RoutinePage';
import AuthPage from './pages/AuthPage';

import ProtectedRoute from './login/ProtectedRoute';

import axios from "axios";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

function AppContent() {
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const location = useLocation();
    const hideMenu = (location.pathname === "/login" || location.pathname === "/Login" || location.pathname === "/signup");
    const [userId, setUserId] = useState('');

    const fetchUserInfo = async() => {
        if(!token) { return; }
        try {
            const response = await axios.get('/api/auth/me' + userId, {
                headers:{ Authorization: `Bearer ${token}` }
            });
            setUserId(response.data.username);
            console.log(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    useEffect(() => {
        console.log("new\ntoken: ", token);
        if (token) {
            navigate('/', { replace: true }); // 로그인 상태면 홈으로
        }
    }, [token]);

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
                    <Route path="/" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/calendar" element={
                        <ProtectedRoute>
                            <CalendarPage userId={userId} setUserId={setUserId} fetchUserInfo={fetchUserInfo} />
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
