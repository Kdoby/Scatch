import StudyTimer from "./StudyTimer";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import api from "../api";
import axios from "axios";
import {TokenStore} from "../TokenStore";

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
                    }} src={"images/close.png"} alt={"closeModal"} onClick={closeModal}></img>

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
                        <strong>{selectedTodo?.[1] ?? "선택한 투두"}</strong>
                        을(를) 완료로 체크할까요?
                    </p>
                    <button className={"AT_button"} type="button" onClick={onCheck}>체크</button>
                    <button className={"AT_button"} type="button" onClick={closeModal}>닫기</button>

                </div>

            </div>
        </div>
    );
}

export default function TimerView({ targetTime: propTargetTime, mode: propMode, todo: propTodo, todayDate: propTodayDate }) {
    // 라우터 state 받기
    const {state} = useLocation(); // state: {totalMinutes, mode, todo, todayDate}
    const time = propTargetTime ?? state?.totalMinutes ?? null;
    const mode = propMode ?? state?.mode ?? "normal";
    const todo = propTodo ?? state?.todo ?? null; // [id, title]
    const todayDate = propTodayDate ?? state?.todayDate ?? null;

    const [targetTime, setTargetTime] = useState(time); // 분 단위
    const [selectedMode, setSelectedMode] = useState(mode ?? "normal");
    const [selectedTodo, setSelectedTodo] = useState(todo); // [id, title]
    const [startTime, setStartTime] = useState(null);

    const navigate = useNavigate();

    // 처음 타이머 시작할때 입력받은 정보 저장, 첫 시작 시간 저장
    // todo는 [id, title]
    useEffect(() => {
        setTargetTime(time ?? null);
        console.log("input 받아짐: ", targetTime);
        setSelectedMode(mode ?? "normal");
        console.log("input 받아짐: ", selectedMode);
        setSelectedTodo(todo ?? null);
        console.log("input 받아짐: ", selectedTodo);
        setStartTime(getCurrentLocalDateTime());
        CompleteResetTimer();
    }, [time, mode, todo]);


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
                navigate("/");
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
        if (!startTime) { // pause후 재시작 하지 않고 stop을 누른거니까 아무 저장없이 checkTodo 물어보고 끝내기 (상태 초기화는 checkTodo 창 이후에 일어남)
            setIsCheckOpen(true);
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
        console.log("재시작, 시작시간 새로 설정됨: ", startTime);
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

    // lesson 불러오기
    const [adv, setAdv] = useState('');

    const initialAdvSetting = async () => {
        if(!todayDate) { return; }

        console.log(TokenStore.getToken());

        try{
            const response = await api.get(`/todo/lesson/${todayDate}`);

            console.log(response.data);

            if (!response.data.id) {
                newAdvice();
            } else{
                setAdv(response.data);
            }
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    // 새 lesson 랜덤으로
    const newAdvice = async () => {
        try {
            const response = await axios.get('https://korean-advice-open-api.vercel.app/api/advice');
            setAdv({
                content: response.data.message,
                contentWriter: response.data.author
            });
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    useEffect(() => {
        console.log("todayDate: " + todayDate);

        initialAdvSetting();
    }, [todayDate]);

    return (
        <div>
            <StudyTimer adv={adv} key={timerRunId} targetTime={targetTime} mode={selectedMode} todo={selectedTodo} onStop={handleStop} onPause={handlePause} onResume={handleResume} onContinue={openAddTime} onDone={handleDone} getCurrentLocalDateTime={getCurrentLocalDateTime} />
            <AddTime isOpen={isAddOpen} isFinished={isFinished} onInput={addTimeAndRestart} onAdd={addTimeInProgress} closeModal={()=>setIsAddOpen(false)} />
            <CheckTodo isOpen={isCheckOpen} onCheck={handleCheck} selectedTodo={selectedTodo} closeModal={() => {
                setIsCheckOpen(false);
                setSelectedTodo(null);
                setSelectedMode("normal");
                setTargetTime(null);
                navigate("/");
            }} />
        </div>
    );
}