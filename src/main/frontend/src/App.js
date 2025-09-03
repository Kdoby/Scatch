import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import TimeTablePage from './pages/TimeTablePage';
import RoutinePage from './pages/RoutinePage';
import AuthPage from './pages/AuthPage';
import TodoListPage from './pages/TodoListPage';
import StudyLogPage from './pages/StudyLogPage';
import UserPage from './pages/UserPage';
import Logout from './login/Logout';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import TimerView from "./timeattack/TimerView";

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const hideMenu = (location.pathname === "/login" || location.pathname === "/Login" || location.pathname === "/signup");

    return (
        <div className="App"
             style={{
                 display: "flex",
                 height: "100%"
             }}
        >
            {!hideMenu && (
                <div
                    className="menu"
                    style={{
                        width: "10%",
                        height: "100%",
                        padding: "20px",
                        flexShrink: 0,
                        overflowY: "auto",
                        position: "fixed",  // 왼쪽 메뉴 고정
                        top: 0,
                        left: 0,
                        bottom: 0
                    }}
                >
                    <div style={{margin:"20px 0"}}><Link to="/">HOME</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/user">USER</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/todolist">TODO</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/calendar">CALENDAR</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/timetable">TIMETABLE</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/routine">ROUTINE</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/studylog">STUDY LOG</Link></div>
                    <div><Logout /></div>
                </div>
            )}

            <div className="screen"
                 style={{
                     height: "100%",
                     flex: 1,
                     marginLeft: hideMenu ? 0 : "10%", // 메뉴만큼 오른쪽 밀기
                     overflowY: "auto"
                 }}
            >
                <Routes>
                    <Route path="/login" element={<AuthPage type="login" />} />
                    <Route path="/signup" element={<AuthPage type="signup" />} />

                    <Route path="/" element={<HomePage />} />
                        <Route path="/timerview" element={<TimerView />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/timetable" element={<TimeTablePage />} />
                    <Route path="/routine" element={<RoutinePage />} />
                    <Route path="/todolist" element={<TodoListPage />} />
                    <Route path="/studylog" element={<StudyLogPage />} />
                    <Route path="/user" element={<UserPage />} />
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
