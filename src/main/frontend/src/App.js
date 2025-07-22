import './App.css';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import TimeTablePage from './pages/TimeTablePage';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App"
                 style={{ display: "grid",
                          gridTemplateColumns:"1fr 10fr",
                          gap: "20px"
                 }}
            >
                <div className="menu">
                    <div style={{margin:"20px 0"}}><Link to="/">HOME</Link></div>
                    <div style={{margin:"20px 0"}}>USER</div>
                    <div style={{margin:"20px 0"}}>TODO</div>
                    <div style={{margin:"20px 0"}}><Link to="/calendar">CALENDAR</Link></div>
                    <div style={{margin:"20px 0"}}><Link to="/timetable">TIMETABLE</Link></div>
                    <div style={{margin:"20px 0"}}>ROUTINE</div>
                    <div style={{margin:"20px 0"}}>STUDY LOG</div>
                </div>

                <div>
                    <div className="screen">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/timetable" element={<TimeTablePage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}


export default App;