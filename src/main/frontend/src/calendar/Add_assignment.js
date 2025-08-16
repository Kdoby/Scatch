import RepeatTypeSelect from './RepeatTypeSelect';
import "./Add_schedule.css";
import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddAssignment({ selectedDate, onClose }) {
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentMemo, setAssignmentMemo] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');
    const [courseId, setCourseId] = useState('');
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        fetchSubject();
    }, [onClose])

    useEffect(() => {
        if (!selectedDate) return;
        // console.log("timeChecked: " + timeChecked + " / selectedDate: " + selectedDate);

        if(selectedDate){
            const tempDate1 = new Date(selectedDate);
            tempDate1.setHours(0, 0, 0, 0);
            // console.log("tempDate1: " + tempDate1);

            setAssignmentDeadline(tempDate1);
        }
        else{
            setAssignmentDeadline(formatDate3(selectedDate));
        }

    }, [selectedDate])

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

        console.log("formatDate3: " + d);
        return d;
    }

    const formatDate3Plus1Hour = (date) => {
        if(!date) return null;

        const d = new Date(date);
        d.setTime(d.getTime() + 60 * 1000 * 60);

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

    // 일정 추가
    const addAssignment = async () => {
        console.log("courseId: " + courseId + " " +  assignmentTitle  + " " + assignmentDeadline);

        try {
            const response = await api.post('/assignment', {
                courseId,
                title: assignmentTitle,
                deadline: assignmentDeadline,
                memo: assignmentMemo
            });

            alert(response.data);
            onClose(true);
        } catch (error) {
            alert(error.message);
        }
    }

    // 나의 과목을 가져오기
    const fetchSubject = async () => {
        try {
            const response = await api.get('/timetable/detail/course');

            setCourseList(response.data.data);
            console.log(response.data.data);

            if(response.data.success){
                alert(response.data.message);
            }else {
                alert("response error");
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="Add_schedule" style={{ border: "1px solid gray", padding: "10px", marginTop: "10px" }}>

            <div style={{ margin: "20px" }}>
                <button onClick={onClose}
                        style={{ float: "right",
                                 marginBottom: "15px"
                        }}
                >X</button>

                <div style={{float: "none"}} />
                <input type="text"
                       placeholder="과제 제목"
                       style={{ width: "98%",
                                padding: "10px 5px",
                                fontSize: "30px",
                                border: "none",
                                outline: "none"
                       }}
                       onChange={(e) => setAssignmentTitle(e.target.value)}
                />

                <div style={{height: "20px"}} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "10px", textAlign: "left"}}>
                    <div>과목</div>
                    <div>
                        <select
                            name="subject"
                            onChange={(e) => setCourseId(e.target.value)}
                        >
                            <option value="none" key="none">---not select---</option>
                            {Array.isArray(courseList) && courseList.map(course => (
                                <option value={course.courseId} key={course.courseId}>
                                {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>마감일</div>
                    <div>
                        <input type="datetime-local"
                               defaultValue={formatDate4(selectedDate)}
                               onChange={(e) => setAssignmentDeadline(formatDate3(e.target.value))}
                        />
                    </div>
                </div>

                <hr style={{margin: "30px auto"}} />


                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "10px", textAlign: "left"}}>
                    <div>메모</div>
                    <div>
                        <input type="text"
                               style={{ width: "100%", margin: "0px" }}
                               onChange={(e) => setAssignmentMemo(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            <br />
            <button style={{marginRight:"10px"}}
                    onClick={addAssignment}
            >저장</button>
        </div>
    );
}
