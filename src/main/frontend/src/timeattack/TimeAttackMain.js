import "./TimeAttackMain.css";

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, {useEffect, useRef, useState} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

function StudyTimeInput({allTodos, onStart, todayDate}) {
    const [mode, setMode] = useState("normal");
    const [todo, setTodo] = useState(null); // [id, title]
    const [hour, setHour] = useState(1); // 기본 1시간
    const [minute, setMinute] = useState(0);
    const todoRef = useRef();

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
        onStart(totalMinutes, mode, todo); // 타이머 시작
    }

    return (
        <div style={{width: "40%", margin: "auto"}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                <div className="mode-div"><input type="radio" value="normal" checked={mode === "normal"} onChange={() => setMode("normal")}/>NORMAL MODE</div>
                <div className="mode-div"><input type="radio" value="hard" checked={mode === "hard"} onChange={() => setMode("hard")}/>HARD MODE</div>
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
                        width: "100%"
                    }}
                    onClick={handleSubmit}
            >ATTACK!</button>
        </div>
    );
}

function AddTime ({isOpen, isFinished, onInput, onAdd, closeModal}) {
    const [hour, setHour] = useState(1); // 기본 1시간
    const [minute, setMinute] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalMinutes = hour * 60 + minute;
        if(totalMinutes <= 0) {
            alert("0분 이상으로 설정해주세요.");
            return;
        }
        if(isFinished) { // complete상태에서 시간 추가하는경우
            onInput(totalMinutes);
        } else {
            onAdd(totalMinutes); // 타이머 진행중에 시간 추가하는 경우
        }
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
                <div style={{padding: "30px"}}>
                    <img style={{ border: "none",
                        cursor: "pointer",
                        width:"40px",
                        marginLeft: "580px"
                    }} src={"./close.png"} alt={"closeModal"} onClick={closeModal}></img>

                    <form className={"AT_form"} onSubmit={handleSubmit}>
                        <div>time: <span>
                            <input type="number" min="0" max="24" step="1" value={hour} onChange={(e) => setHour(Math.max(0, Math.min(24, Number(e.target.value))))} />
                            <input type="number" min="0" max="59" step="1" value={minute} onChange={(e) => {
                                let v = Math.max(0, Math.min(59, Number(e.target.value)));
                                // 24시간이면 분은 0으로 강제
                                if (hour === 24 && v > 0) v = 0;
                                setMinute(v);
                            }} />
                        </span></div>
                        <button className={"AT_submit"} type="submit" >추가</button>
                    </form>

                </div>

            </div>
        </div>
    );
}

function CheckTodo({isOpen, closeModal, selectedTodo, onCheck}) {
    return(
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
                    <h2 id="checkTodoTitle" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
                        타이머 완료
                    </h2>
                    <p style={{ marginBottom: 24 }}>
                        <strong>{selectedTodo?.title ?? "선택한 투두"}</strong>
                        을(를) 완료로 체크할까요?
                    </p>
                    <button className={"AT_button"} type="button" onClick={onCheck}>체크</button>
                    <button className={"AT_button"} type="button" onClick={closeModal}>닫기</button>

                </div>

            </div>
        </div>
    );
}

function StudyTimer ({targetTime, mode, onStop, onPause, onResume, onContinue, onDone, getCurrentLocalDateTime}) {
    const [remainingSeconds, setRemainingSeconds] = useState(targetTime * 60);
    const [isPaused, setIsPaused] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const [CompletedTime, setCompletedTime] = useState(null);
    useEffect(() => {
        if(isPaused || isFinished) return;

        const timer = setInterval(() => {
           setRemainingSeconds((prev) => {
               if (prev <= 1) {
                   clearInterval(timer);
                   setCompletedTime(getCurrentLocalDateTime());
                   setIsFinished(true);
                   return 0;
               }
               return prev - 1;
           });
        }, 1000); // 1초마다 실행

        return () => clearInterval(timer);
    }, [isPaused, isFinished]);

    // targetTime 변경시 감지 (실행중일때만)
    const prevTargetTimeRef = useRef(targetTime);
    useEffect(() => {
        const prev = prevTargetTimeRef.current;
        if(!isFinished && targetTime > prev) {
            const addedSeconds = (targetTime - prev) * 60;
            setRemainingSeconds((prevSec) => prevSec + addedSeconds);
        }
        prevTargetTimeRef.current = targetTime; // 업데이트
    }, [targetTime, isFinished]);

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    if (isFinished) {
        return (
            <div>
                <h2>COMPLETE!</h2>
                <div>
                    <button onClick={() => onContinue(isFinished)}>Continue</button>
                    <button onClick={() => onDone(CompletedTime)}>Done</button>
                </div>
            </div>
        );
    }

    return(
        <div>
            <h2>{mode === "normal" ? "Normal Mode" : "🔥Hard Mode🔥"}</h2>
            <h2>{String(hours).padStart(2, "0")} : {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}</h2>
            {mode === "normal" ? (
                <>
                    <p onClick={() => onContinue(isFinished)} style={{textDecoration: "underline", cursor:"pointer"}}>continue</p>
                    <div>
                        <button onClick={() => {
                            if (!isPaused) {
                                // 일시정지
                                onPause?.();
                            } else {
                                // 재개
                                onResume?.();
                            }
                            setIsPaused(!isPaused);
                        }}>
                            {isPaused ? "RESTART" : "PAUSE"}
                        </button>
                        <button onClick={onStop} >
                            STOP
                        </button>
                    </div>
                </>
            ) : (
                <p style={{color: "gray", marginTop: "10px"}}>하드모드는 일시정지/종료할 수 없습니다.</p>
            )}
        </div>
    );
}

export default function TimeAttackMain({todayDate}) {
    const [targetTime, setTargetTime] = useState(null); // 분 단위
    const [selectedMode, setSelectedMode] = useState("normal");
    const [selectedTodo, setSelectedTodo] = useState(null); // [id, title]
    const [startTime, setStartTime] = useState(null);

    const [isAddOpen, setIsAddOpen] = useState(false);

    // 처음 시작 / COMPLETE -> Continue에만 타이머 리마운트 하기위한 키
    const [timerRunId, setTimerRunId] = useState(0);
    const CompleteResetTimer = () => setTimerRunId(v => v + 1);

    // 현재 LocalDateTime 받아오기
    function getCurrentLocalDateTime() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`+
            `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

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

    // 처음 타이머 시작할때 입력받은 정보 저장, 첫 시작 시간 저장
    // todo는 [id, title]
    const handleStart = (minutes, mode, todo) => {
        setSelectedTodo(todo);
        setSelectedMode(mode);
        setTargetTime(minutes);
        setStartTime(getCurrentLocalDateTime());
        CompleteResetTimer();
    }

    // CheckTodo (중지 / complete 후 todo 체크리스트를 체크할 건지 선택받기
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const handleCheck = async () => {
        if (!selectedTodo[0]) return;
        console.log("check todo 클릭됨");
        try {
            const response = await api.put('/todo/' + selectedTodo[0], {
                title: selectedTodo[1],
                isDone: true
            });

            if(response.data.success) {
                alert(response.data.message);
                setIsCheckOpen(false);
                setSelectedTodo(null);
                setSelectedMode("normal");
                setTargetTime(null);
            } else {
                alert("todo check 실패");
            }
        } catch (error) {
            alert(error);
        }
    };

    // 중지시 첫 시작시간, 중지시간 API 저장 요청
    // (중지 후 처리 필요)
    const handleStop = async () => {
        const endTime = getCurrentLocalDateTime();
        if (!startTime) {
            setSelectedTodo(null);
            setSelectedMode("normal");
            setTargetTime(null);
            return;
        }
        try {
            const res = await api.post('/todo/log', {
                todoId: selectedTodo[0],
                startTime: startTime,
                endTime: endTime,
                isManual: false
            });
            if (res.data.success) {
                alert(res.data.message);
                setIsCheckOpen(true);
                // SelectedTodo, SelectedMode, TargetTime 초기화는 CheckTodo에서
            }
            else {
                console.log("타이머 기록 등록 실패");
            }
        } catch (err) {
            alert(`타이머 기록 등록 에러 발생: ${err?.response?.data?.message ?? err.message}`);
        }
    };

    // 일시정지 후 재개 -> 시작시간 새로 저장
    const handleResume = () => {
        setStartTime(getCurrentLocalDateTime());
    };

    // 일시정지 -> 시작시간, 일시정지 시간 API 저장 요청
    const handlePause = async () => {
        const endTime = getCurrentLocalDateTime();
        try {
            const res = await api.post('/todo/log', {
                todoId: selectedTodo[0],
                startTime: startTime,
                endTime: endTime,
                isManual: false
            });
            if (res.data.success) {
                alert(res.data.message);
                setStartTime(null);
            }
            else {
                console.log("타이머 기록 등록 실패");
            }
        } catch (err) {
            alert(`타이머 기록 등록 에러 발생: ${err?.response?.data?.message ?? err.message}`);
        }
    };

    const handleDone = async (endTime) => {
        try {
            const res = await api.post('/todo/log', {
                todoId:selectedTodo[0],
                startTime: startTime,
                endTime: endTime,
                isManual: false
            });
            if (res.data.success) {
                alert(res.data.message);
                setIsCheckOpen(true);
                // SelectedTodo, SelectedMode, TargetTime 초기화는 CheckTodo에서
            }
            else {
                console.log("타이머 기록 등록 실패");
            }
        } catch (err) {
            alert(`타이머 기록 등록 에러 발생: ${err?.response?.data?.message ?? err.message}`);
        }
    }

    // 시간 추가시 처리방법 구분용 (true -> addTimeAndRestart / false -> addTimeInProgress)
    const [isFinished, setIsFinished] = useState(false);
    // COMPLETE 화면에서 Continue 누르면 시간 추가 모달 열기
    const openAddTime = (f) => {
        setIsFinished(f);
        setIsAddOpen(true);
    };

    // COMPLETE -> Continue -> 추가 시간 입력 처리 => 재시작
    const addTimeAndRestart = (minutes) => {
      setTargetTime(minutes); // 목표시간 새로 설정
      setStartTime(getCurrentLocalDateTime()); // 시작 시각 갱신
      CompleteResetTimer();
      setIsAddOpen(false);
    };

    // timer 실행중에 추가 시간 입력 처리
    const addTimeInProgress = (minutes) => {
        setTargetTime(prev => (prev ?? 0) + minutes);
        setIsAddOpen(false);
        console.log("targetTime: ", targetTime);
    }

    return (
        <div>
            {targetTime === null ? (
                <StudyTimeInput allTodos={allTodos} todayDate={todayDate} onStart={handleStart} />
            ) : (
                <>
                    <StudyTimer key={timerRunId} targetTime={targetTime} mode={selectedMode} todo={selectedTodo} onStop={handleStop} onPause={handlePause} onResume={handleResume} onContinue={openAddTime} onDone={handleDone} getCurrentLocalDateTime={getCurrentLocalDateTime} />
                    <AddTime isOpen={isAddOpen} isFinished={isFinished} onInput={addTimeAndRestart} onAdd={addTimeInProgress} closeModal={()=>setIsAddOpen(false)} />
                    <CheckTodo isOpen={isCheckOpen} onCheck={handleCheck} selectedTodo={selectedTodo} closeModal={() => {
                        setIsCheckOpen(false);
                        setSelectedTodo(null);
                        setSelectedMode("normal");
                        setTargetTime(null);
                    }} />
                </>
            )}
        </div>
    );
}