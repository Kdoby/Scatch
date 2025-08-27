import AddSchedule from "./Add_schedule";
import EditSchedule from "./Edit_schedule";
import AddAssignment from "./Add_assignment";
import EditAssignment from "./Edit_assignment";

import "./Calendar_detail.css";

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
    const [palette, setPalette] = useState(1);

    // 팔레트 조회
    const fetchPalette = async () => {
        try {
            const res = await api.get('/member/palette');

            // alert(res.data.message + res.data.data);
            setPalette(res.data.data);
            console.log("fetchPalette 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }


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

    useEffect(() => {
        fetchPalette();
    }, [])

    return (
        <div>
        { ( !selectedDate || !isSameYearMonth(date, selectedDate) ) ? (
            <div></div>
        ) : (
            <div className="cd_calendar-day-detail">
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

                    <div className="cd_calendar-day-detail-group" style={{ overflowX: "hidden", overflowY: "scroll" }}>

                    {selectedDateEvents.map((e) => (
                        <div key={e.id}
                             style={{ display: "grid",
                                      width: "100%",
                                      gridTemplateColumns: "20px 2fr 6fr 30px",
                                      gap: "5px",
                                      textAlign: "left",
                                      marginBottom: "10px", // 구분용
                             }}
                        >
                            <div className="cd_item"
                                 style={{ width: "20px",
                                          height: "60px",
                                          backgroundColor: e.color
                                 }}
                            >
                            </div>
                            <div className="cd_item" style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "35px" }}>{e.title}</div>
                            <div className="cd_item" style={{ color: "gray", lineHeight: "35px" }}>{formatDateTime(e.startDateTime)} ~ {formatDateTime(e.endDateTime)}</div>
                            <div className="cd_item cd_setting-wrapper" style={{ color: "gray", fontSize:"10px" }}>
                                <img src="images/menu.png" style={{ height:"15px" }}/>
                                <ul className="cd_setting">
                                    <li onClick={() => { setShowEditSchedule(true);
                                                         setEditEvent(e);
                                    }}>edit</li>
                                    <li onClick={() => deleteEvent(e.id)}>delete</li>
                                </ul>
                            </div>

                            <div className="cd_item" style={{ color: "gray" }}>{e.memo}</div>
                        </div>
                    ))}


                    {selectedDateAssignments.map((e) => (
                        <div key={e.id}
                             style={{ display: "grid",
                                      width: "100%",
                                      gridTemplateColumns: "20px 2fr 6fr 30px",
                                      gap: "5px",
                                      textAlign: "left",
                                      marginBottom: "10px", // 구분용
                             }}
                        >
                            <div className="cd_item"
                                 style={{ width: "20px",
                                          height: "60px",
                                          border: `2px solid ${e.color}`,

                                 }}
                            >
                            </div>
                            <div className="cd_item" style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "35px" }}>{e.title}</div>
                            <div className="cd_item" style={{ color: "gray", lineHeight: "35px" }}>~ {formatDateTime(e.deadline)}</div>
                            <div className="cd_item cd_setting-wrapper" style={{ color: "gray", fontSize:"10px" }}>
                                <img src="images/menu.png" style={{ height:"15px" }}/>
                                <ul className="cd_setting">
                                    <li onClick={() => { setShowEditAssignment(true);
                                                         setEditAssignment(e);
                                    }}>edit</li>
                                    <li onClick={() => deleteAssignment(e.id)}>delete</li>
                                </ul>
                            </div>

                            <div className="cd_item" style={{ color: "gray" }}>{e.memo}</div>
                        </div>
                    ))}
                    </div>


                    <div style={{ float: "right", fontSize: "30px", cursor: "pointer" }}>
                        <div className="cd_item cd_setting-wrapper" style={{ color: "gray" }}>
                            <span>+</span>
                            <ul className="cd_setting"
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
                                     palette={palette}
                        />
                    )}


                    {/* 조건부 렌더링 */}
                    {showEditSchedule && (
                        <EditSchedule
                            selectedDate={selectedDate}
                            onClose={() => setShowEditSchedule(false)}
                            editEvent={editEvent}
                            palette={palette}
                        />
                    )}


                    {/* 조건부 렌더링 */}
                    {showAddAssignment && (
                        <AddAssignment
                            selectedDate={selectedDate}
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
