import "./Calendar_detail.css";
import AddSchedule from "./Add_schedule"; // add_schedule.js 컴포넌트 import
import EditSchedule from "./Edit_schedule"; // add_schedule.js 컴포넌트 import
import AddAssignment from "./Add_assignment"; // add_schedule.js 컴포넌트 import
import EditAssignment from "./Edit_assignment"; // add_schedule.js 컴포넌트 import

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function Calendar_detail({ selectedDate, changeMonth, fetchEvent, date }) {
    const [showAddSchedule, setShowAddSchedule] = useState(false); // 상태 추가
    const [showEditSchedule, setShowEditSchedule] = useState(false); // 상태 추가
    const [showAddAssignment, setShowAddAssignment] = useState(false); // 상태 추가
    const [showEditAssignment, setShowEditAssignment] = useState(false); // 상태 추가
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [selectedDateAssignments, setSelectedDateAssignments] = useState([]);
    const [editEvent, setEditEvent] = useState('');
    const [editAssignment, setEditAssignment] = useState('');


    const formatDate = (date) =>
            date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : null;

    // 특정 날짜의 일정 조회
    const fetchOneDayEventDetail = async () => {
        if (!selectedDate) return;

        try {
            const response = await api.get('/calendar/event', {
                params: { date: formatDate(selectedDate) }
            });

            console.log(response.data);
            setSelectedDateEvents(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    // 특정 날짜의 일정 조회
    const fetchOneDayAssignmentDetail = async () => {
        if (!selectedDate) return;

        try {
            const response = await api.get('/assignment/daily/' + formatDate(selectedDate));

            console.log(response.data);
            setSelectedDateAssignments(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    const deleteEvent = async (eventId) => {
        if (!selectedDate) return;

        try {
            const response = await api.delete('/calendar/' + eventId);

            fetchOneDayEventDetail();
            fetchEvent();
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    const deleteAssignment = async (assignmentId) => {
        if (!selectedDate) return;

        try {
            const response = await api.delete('/assignment/' + assignmentId);

            fetchOneDayEventDetail();
            fetchEvent();
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    function formatDateTime(dateStr) {
        const date = new Date(dateStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');

        return `${y}-${m}-${d} ${h}:${min}`;
    }

    function isSameYearMonth(d1, d2) {
        if (!d1 || !d2) return false; // null/undefined 방지
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth()
        );
    }


    useEffect (() => {
        fetchOneDayEventDetail();
        fetchEvent();
        fetchOneDayAssignmentDetail();
    }, [selectedDate, showAddSchedule, showEditSchedule, showAddAssignment, showEditAssignment]);


    return (
        <div>
        { ( !selectedDate || !isSameYearMonth(date, selectedDate) ) ? (
            <div></div>
        ) : (
            <div className="calendar-day-detail">
                <div style={{ width: "90%", margin: "auto" }}>
                    <h3 style={{ float: "left", margin: "10px 0px"  }}>
                        {selectedDate.getFullYear()} - {selectedDate.getMonth() + 1} - {selectedDate.getDate()}
                    </h3>
                    <img src="images/close.png"
                         style={{ float: "right", verticalAlign: "middle", margin: "10px 0px" }}
                         onClick={() => changeMonth(0)}
                    />

                    <div style={{ clear: "both" }} />

                    <hr style={{margin: "0 0 15px 0px"}} />

                    <div className="calendar-day-detail-group" style={{ overflowX: "hidden" }}>
                    {selectedDateEvents.map((e) => (
                        <div key={e.id}
                             style={{ display: "grid",
                                      width: "100%",
                                      gridTemplateColumns: "20px 2fr 6fr 20px",
                                      gap: "5px",
                                      textAlign: "left",
                                      marginBottom: "10px", // 구분용
                             }}
                        >
                            <div className="item"
                                 style={{ width: "20px",
                                          height: "60px",
                                          backgroundColor: e.color
                                 }}
                            >
                            </div>
                            <div className="item" style={{ fontWeight: "bold" }}>{e.title}</div>
                            <div className="item" style={{ color: "gray" }}>{formatDateTime(e.startDateTime)} ~ {formatDateTime(e.endDateTime)}</div>
                            <div className="item setting-wrapper" style={{ color: "gray" }}>
                                <img src="images/menu.png" style={{ height:"15px" }}/>
                                <ul className="setting">
                                    <li onClick={() => { setShowEditSchedule(true);
                                                         setEditEvent(e);
                                    }}>edit</li>
                                    <li onClick={() => deleteEvent(e.id)}>delete</li>
                                </ul>
                            </div>

                            <div className="item" style={{ color: "gray" }}>{e.memo}</div>
                        </div>
                    ))}


                    {selectedDateAssignments.map((e) => (
                        <div key={e.id}
                             style={{ display: "grid",
                                      gridTemplateColumns: "20px 2fr 6fr 20px",
                                      gap: "5px",
                                      textAlign: "left",
                                      marginBottom: "10px", // 구분용
                             }}
                        >
                            <div className="item"
                                 style={{ width: "20px",
                                          height: "60px",
                                          backgroundColor: e.color
                                 }}
                            >
                            </div>
                            <div className="item" style={{ fontWeight: "bold" }}>{e.title}</div>
                            <div className="item" style={{ color: "gray" }}>~ {formatDateTime(e.deadline)}</div>
                            <div className="item setting-wrapper" style={{ color: "gray" }}>
                                <img src="images/menu.png" style={{ height:"15px" }}/>
                                <ul className="setting">
                                    <li onClick={() => { setShowEditAssignment(true);
                                                         setEditAssignment(e);
                                    }}>edit</li>
                                    <li onClick={() => deleteAssignment(e.id)}>delete</li>
                                </ul>
                            </div>

                            <div className="item" style={{ color: "gray" }}>{e.memo}</div>
                        </div>
                    ))}
                    </div>


                    <div style={{ float: "right", fontSize: "30px", cursor: "pointer" }}>
                        <div className="item setting-wrapper" style={{ color: "gray" }}>
                            <span>+</span>
                            <ul className="setting"
                                style={{ color: "gray",
                                         fontSize: "15px",
                                         top: "-170%",
                                         right: "-250%"
                                      }}
                            >
                                <li onClick={()=>setShowAddSchedule(true)}>event</li>
                                <li onClick={()=>setShowAddAssignment(true)}>assignment</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ clear: "both" }} />

                    {/* 조건부 렌더링 */}
                    {showAddSchedule && (
                        <AddSchedule selectedDate={selectedDate}
                                     onClose={() => setShowAddSchedule(false)}
                        />
                    )}


                    {/* 조건부 렌더링 */}
                    {showEditSchedule && (
                        <EditSchedule
                            selectedDate={selectedDate}
                            onClose={() => setShowEditSchedule(false)}
                            editEvent={editEvent}
                        />
                    )}


                    {/* 조건부 렌더링 */}
                    {showAddAssignment && (
                        <AddAssignment selectedDate={selectedDate}
                                     onClose={() => setShowAddAssignment(false)}
                        />
                    )}



                    {/* 조건부 렌더링 */}
                    {showEditAssignment && (
                        <EditAssignment
                            selectedDate={selectedDate}
                            onClose={() => setShowEditAssignment(false)}
                            editAssignment={editAssignment}
                        />
                    )}
                </div>

            </div>
        )}
        </div>
    );
}
