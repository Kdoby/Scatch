import "./TimeAttackMain.css";

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, {useEffect, useRef, useState} from "react";
import { Link } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import StudyTimer from "./StudyTimer";

function StudyTimeInput({allTodos, todayDate}) {
    const [mode, setMode] = useState("normal");
    const [todo, setTodo] = useState(null); // [id, title]
    const [hour, setHour] = useState(1); // 기본 1시간
    const [minute, setMinute] = useState(0);
    const todoRef = useRef();

    const navigate = useNavigate();

    const handleSubmit = () => {
        const totalMinutes = hour * 60 + minute;
        if(!todo || Array.isArray(todo) && !todo[0]) {
            alert("todo를 선택해주세요");
            todoRef.current?.focus();
            return;
        }
        if(totalMinutes <= 0) {
            alert("0분 이상으로 설정해주세요.");
            return;
        }
        navigate("/timerview", {state: {totalMinutes, mode, todo, todayDate}});
    }

    return (
        <div style={{width: "40%", margin: "auto"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                <div className="mode-div" onClick={() => setMode("normal")}><input type="radio" value="normal" checked={mode === "normal"} onChange={() => setMode("normal")}/>NORMAL MODE</div>
                <div className="mode-div" onClick={() => setMode("hard")}><input type="radio" value="hard" checked={mode === "hard"} onChange={() => setMode("hard")}/>HARD MODE</div>
            </div>

            <div style={{ height: "20px" }} />

            <div style={{ border:"1px solid black",
                borderRadius: "20px",
                height: "100px",
                padding: "30px"
            }}>
                <div>todo: <span>
                                <select name="todoSelect" ref={todoRef} value={todo?.[0] ?? ""} onChange={(e) => {
                                    const id = Number(e.target.value);
                                    if (!id) {
                                        setTodo(null);
                                        return;
                                    }
                                    const selectedOpt = e.target.selectedOptions[0];
                                    const title = selectedOpt?.dataset?.title ?? "";
                                    setTodo([id, title]);
                                }} required>
                                    <option value="">-- not select --</option>
                                    {Array.isArray(allTodos) &&
                                        allTodos.flatMap((category) =>
                                            category.todos.map((t) => (
                                                <option key={t.id} value={t.id} data-title={t.title}>{category.categoryName} - {t.title}</option>
                                            ))
                                        )}
                                </select>
                            </span>
                </div>
                <div>time: <span>
                    <input type="number" min="0" max="24" step="1" value={hour} onChange={(e) => setHour(Math.max(0, Math.min(24, Number(e.target.value))))} />
                    <input type="number" min="0" max="59" step="1" value={minute} onChange={(e) => {
                        let v = Math.max(0, Math.min(59, Number(e.target.value)));
                        // 24시간이면 분은 0으로 강제
                        if (hour === 24 && v > 0) v = 0;
                        setMinute(v);
                    }} />
                </span></div>
            </div>

            <div style={{ height: "20px" }} />

            <button className = "attackBtn"
                    style={{ borderRadius: "20px",
                        border: "1px solid black",
                        padding: "20px 0px",
                        textAlign: "center",
                        width: "100%",
                        height: "100px",
                        backgroundColor: "tomato"
                    }}
                    onClick={handleSubmit}
            ><p className="text" data-content="ATTACK!">ATTACK!</p></button>
        </div>
    );
}

export default function TimeAttackMain({todayDate}) {
    // 특정 일자 todo fetch
    const [allTodos, setAllTodos] = useState([]);
    const fetchTodos = async () => {
        // console.log("todayDate: " + todayDate);

        if(todayDate) {
            try {
                const response = await api.get('/todo/list/' + todayDate);

                setAllTodos(response.data.data);
                console.log(allTodos);
            } catch (e) {
                console.error("fail fetch: ", e);
            }
        }

    };

    useEffect(() => {
        if(!todayDate) {
            return;
        }
        fetchTodos();
    }, [todayDate]);

    return (
        <div>
            <StudyTimeInput allTodos={allTodos} todayDate={todayDate} />
        </div>
    );
}