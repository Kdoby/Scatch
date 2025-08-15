import { TokenStore } from "../TokenStore";
import api from '../api';

import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function UpdateStudyLog ({userId, selectedDate, log, onUpdate, isOpen, onClose}) {
    const [startTime, setStartTime] = useState(log.startTime.slice(11,));
    const [endTime, setEndTime] = useState(log.endTime.slice(11,));
    const startRef = useRef();
    const endRef = useRef();

    // time 정보에서 시간만 추출
    const parseTimeHour = (timeStr) => {
        const hour = parseInt(timeStr.split(':')[0], 10);
        return hour;
    };

    // 하루를 넘어가는 기록인지 확인(1시~5시59분)
    const shouldAddOneDay = (timeStr) => {
        const hour = parseTimeHour(timeStr);
        return hour >= 1 && hour <=5;
    };

    // 하루를 더하는 함수
    const addOneDay = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (startTime === log.startTime.slice(11,) && endTime === log.endTime.slice(11,)){
            alert("수정된 내용이 없습니다.");
            return;
        }
        try {
            const startDate = shouldAddOneDay(startTime) ? addOneDay(selectedDate) : selectedDate;
            const endDate = shouldAddOneDay(endTime) ? addOneDay(selectedDate) : selectedDate;
            console.log( `${startDate.toISOString().slice(0,10)}T${startTime}`);

            const res = await api.put('/todo/log/' + log.id, {
                logDate: startDate.toISOString().slice(0,10),
                start: `${startDate.toISOString().slice(0,10)}T${startTime}`,
                end: `${endDate.toISOString().slice(0,10)}T${endTime}`
            });
            if(res.data.success) {
                alert(res.data.message);
                onUpdate();
            }
            else {
                console.log("루틴 수정 실패: ", res.data.message);
            }
        } catch (err) {
            alert("루틴 수정 에러: ", err);
        }
    };

    return (
        <div style={{display:isOpen?"block": "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.35)"}}>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "677px",
                height: "498px",
                backgroundColor: "white",
                borderRadius: "20px",
                border: "solid 1px"
            }}>
                <div style={{padding: "30px"}}>
                    <img style={{ border: "none",
                        cursor: "pointer",
                        width:"40px",
                        marginLeft: "580px"
                    }} src={"./close.png"} alt={"closeModal"} onClick={onClose}></img>

                    <form className={"AS_form"}>
                        <div>
                            <h2>공부 기록 수정</h2>
                        </div>
                        <div>
                            <span className={"AS_inputLabel"}>TODO &nbsp;&nbsp;| &nbsp;&nbsp;</span>
                            <span>{log.todoTitle}</span>
                        </div>
                        <div>
                            <label htmlFor="start-time" className={"AS_inputLabel"}>시작시간 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                            <input type="time" ref={startRef} value={startTime} onChange={(e) => setStartTime(e.target.value)} id="start-time" name="start-time" required/>

                        </div>

                        <div>
                            <label htmlFor="end-time" className={"AS_inputLabel"}>종료시간 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                            <input type="time" ref={endRef} value={endTime} onChange={(e) => setEndTime(e.target.value)} id="end-time" name="end-time" required/>
                        </div>
                        <button className={"AS_submit"} onClick={handleSubmit}>추가</button>
                    </form>

                </div>

            </div>
        </div>
    );
}