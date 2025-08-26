import RepeatTypeSelect from './RepeatTypeSelect';

import "./Edit_schedule.css";

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useEffect, useState } from "react";
import axios from "axios";


export default function EditSchedule({ selectedDate, onClose, editAssignment }) {
    const [assignmentId, setAssignmentId] = useState('');
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentSubject, setAssignmentSubject] = useState('');
    const [assignmentMemo, setAssignmentMemo] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');

    useEffect(() => {
        if(!editAssignment) return;

        // id에 대한 정보 set 해두기
        setAssignmentId(editAssignment.id);
        setAssignmentTitle(editAssignment.title);
        setAssignmentSubject(editAssignment.courseTitle);
        setAssignmentMemo(editAssignment.memo);

        const start = new Date(editAssignment.deadline);
        const newStart = formatDate3(start);
        setAssignmentDeadline(newStart);

        console.log("+++++++++++++++++++1: ", editAssignment.title, editAssignment.memo, editAssignment.repeat);
    }, [editAssignment]);


    // 해당 날짜를 min에 맞게 수정.
    const formatDate = (date) =>
        date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : null;

    const formatTime = (date) =>
        date ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}` : null;

    const formatDate2 = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;  // 유효하지 않은 날짜일 경우 처리
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    // Date로 감싸기
    const formatDate3 = (date) => {
        if(!date) return null;

        const d = new Date(date);
        // console.log("DDDDDDDDDDD" , date.getTime());
        if (isNaN(d.getTime())) {
            console.warn("⚠️ Invalid date passed to formatDate3:", date);
            return null;
        }

        // console.log("formatDate3: " + d);
        return d;
    }

    const formatDate3Plus1Hour = (date) => {
        if(!date) return null;

        const d = new Date(date);
        d.setTime(date.getTime() + 60 * 1000 * 60);

        // console.log("formatDate3Plus1Hour: " + d);
        return d;
    }

    // input type : datetime-local min 정할 때 필요한 포맷
    const formatDate4 = (date) => {
        if (!date) return null;

        const d = new Date(date);
        if (isNaN(d.getTime())) return null;

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    };

    const formatDate4Plus1Hour = (date) => {
        if (!date) return null;

        const d = new Date(date);
        d.setTime(d.getTime() + 60 * 1000 * 60); // 한 시간 더함

        // ⬇️ 이걸 추가해서 포맷까지 적용
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    };

    // input type : datetime-local min 정할 때 필요한 포맷
    const formatDate5 = (date) => {
        if (!date) return null;

        const d = new Date(date);
        if (isNaN(d.getTime())) return null;

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
    };


    // 일정 추가
    const doEditAssignment = async () => {
        try {
            const response =
                await api.put('/assignment', {
                    id: assignmentId,
                    title: assignmentTitle,
                    memo: assignmentMemo,
                    deadline: assignmentDeadline
                });

            console.log("assignment 수정 성공");
            onClose(true);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="Edit_schedule" style={{ border: "1px solid gray", padding: "10px", marginTop: "10px" }}>

            <div style={{ margin: "20px" }}>
                <button onClick={onClose}
                        style={{ float: "right",
                                 marginBottom: "15px"
                        }}
                >X</button>

                <div style={{float: "none"}} />
                <input type="text"
                       style={{ width: "98%",
                                padding: "10px 5px",
                                fontSize: "30px",
                                border: "none",
                                outline: "none"
                       }}
                       value={assignmentTitle}
                       onChange={(e) => setAssignmentTitle(e.target.value)}
                />

                <div style={{height: "20px"}} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "10px", textAlign: "left"}}>
                    <div>과목</div>
                    <div>{assignmentSubject}</div>
                    <div>마감일</div>
                    <div>
                        <input type="datetime-local"
                               value={formatDate4(assignmentDeadline)}
                               onChange={(e) => setAssignmentDeadline(formatDate3(e.target.value))}
                        />
                    </div>

                </div>

                <hr style={{margin: "30px auto"}} />


                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "10px", textAlign: "left"}}>
                    <div>메모</div>
                    <div>
                        <input type="text"
                               style={{ width: "100%", margin: 0 }}
                               value={assignmentMemo}
                               onChange={(e) => setAssignmentMemo(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            <br />
            <button style={{marginRight:"10px"}}
                    onClick={() => doEditAssignment()}
            >저장</button>
        </div>
    );
}
