import "./StudyLog.css";

import { TokenStore } from "../TokenStore";
import api from '../api';

import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function AddStudyLog ({ selectedDate, onAdd, isOpen, closeModal }) {
    const [todoList, setTodoList] = useState([]);
    const [todo, setTodo] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const todoRef = useRef();
    const startRef = useRef();
    const endRef = useRef();

    // 특정 날짜의 todo 목록 조회 (category + todos + lesson)
    const fetchTodoList = async () => {
      try {
          const response = await api.get('/todo/list/' + ( selectedDate.toISOString().slice(0,10) ));
          setTodoList(response.data.data);
          console.log("투두 리스트 받아오기: ", response.data);
      } catch(e) {
          console.error("fail fetch: ", e);
      }
    };
    useEffect(() => {
        if(!selectedDate) {
            return;
        }
        fetchTodoList();
    }, [selectedDate]);

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
        if(!todo) {
            alert("todo를 선택해주세요.");
            todoRef.current.focus();
            return;
        }
        if (!startTime) {
            alert("시작시간을 선택해주세요.");
            startRef.current.focus();
            return;
        }
        if (!endTime) {
            alert("종료시간을 선택해주세요.");
            endRef.current.focus();
            return;
        }
        try {
            const startDate = shouldAddOneDay(startTime) ? addOneDay(selectedDate) : selectedDate;
            const endDate = shouldAddOneDay(endTime) ? addOneDay(selectedDate) : selectedDate;

            // 공부 기록 등록
            const res = await api.post('/todo/log', {
                todoId: todo,
                startTime: `${startDate.toISOString().slice(0,10)}T${startTime}:00`,
                endTime: `${endDate.toISOString().slice(0,10)}T${endTime}:00`,
                isManual: true
            });
            if (res.data.success) {
                alert(res.data.message);
                onAdd();
                setTodo('');
                setStartTime('');
                setEndTime('');
            }
            else {
                console.log("공부 기록 등록 실패");
            }
        } catch (err) {
            alert("공부 기록 등록 에러 발생: ", err.response.data.message);
        }
    };

    // 모달 닫기
    const handleClose = () => {
      setTodo('');
      setStartTime('');
      setEndTime('');
      closeModal();
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
                <div style={{padding: "30px", zIndex: 100, position: "relative"}}>
                    <img style={{ border: "none",
                        cursor: "pointer",
                        width:"40px",
                        marginLeft: "580px"
                    }} src={"./close.png"} alt={"closeModal"} onClick={handleClose}></img>

                    <form className={"AS_form"}>
                        <div>
                            <h2>공부 기록 추가</h2>
                        </div>
                        <div>
                            <span className={"AS_inputLabel"}>TODO &nbsp;&nbsp;| &nbsp;&nbsp;</span>
                            <select ref={todoRef} value={todo} onChange={(e) => setTodo(e.target.value)} required>
                                <option value="">기록할 todo를 선택해주세요</option>
                                {todoList.map((category) => (
                                    category.todos.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.title}
                                        </option>
                                    ))
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="start-time" className={"AS_inputLabel"}>시작시간 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                            <input type="time" ref={startRef} value={startTime}
                                   onChange={(e) => setStartTime(e.target.value)}
                                   id="start-time"
                                   name="start-time" required
                            />
                        </div>

                        <div>
                            <label htmlFor="end-time" className={"AS_inputLabel"}>종료시간 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                            <input type="time" ref={endRef} value={endTime}
                                   onChange={(e) => setEndTime(e.target.value)}
                                   id="end-time"
                                   name="end-time" required
                            />
                        </div>
                        <button className={"AS_submit"} onClick={handleSubmit}>추가</button>
                    </form>

                </div>

            </div>
        </div>
    );
}