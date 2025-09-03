import RoutineList from "./RoutineList";
import MonthlyView from "./MonthlyView";
import WeeklyView from "./WeeklyView";
import DailyRoutine from "./DailyRoutine";

import './RoutinePage.css';

import { TokenStore } from "../TokenStore";
import api from '../api';

import {useEffect, useState, useRef} from "react";
import axios from "axios";


function RoutinePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedView, setSelectedView] = useState(0); // 0: Monthly / 1: Weekly / 2: Daily
    const dateInputRef = useRef(null);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // 0 = 1월, 1 = 2월, ...
    const date = selectedDate.getDate();

    // 날짜 이동 함수
    const handlePrev = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            if (selectedView === 0) {
                newDate.setMonth(newDate.getMonth() - 1);
            }
            else if (selectedView === 1) {
                newDate.setDate(newDate.getDate() - 7);
            }
            else if (selectedView === 2) {
                newDate.setDate(newDate.getDate() - 1);
            }
            return newDate;
        });
    };
    const handleNext = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            if (selectedView === 0) {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            else if (selectedView === 1) {
                newDate.setDate(newDate.getDate() + 7);
            }
            else if (selectedView === 2) {
                newDate.setDate(newDate.getDate() + 1);
            }
            return newDate;
        });
    };

    // monthly - 리스트, 통계 받아오기
    const [monthlyList, setMonthlyList] = useState([]);

    // 루틴 목록 + 루틴별 월간 통계
    const fetchMonthlyStats = async () => {
        try {
            const res = await api.get(`/routine/monthly/${year}/${month}`);
            setMonthlyList(res.data);
            console.log("월간 통계 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    useEffect(() => {
        if(selectedView !== 0) return;
        fetchMonthlyStats();
    }, [year, month, selectedView]);

    // weekly - 리스트, 통계 받아오기
    const [weeklyList, setWeeklyList] = useState([]);

    // 특정 날짜가 그 달의 몇번째 주인지 계산하기
    const firstdayOfWeek = new Date(year, month-1, 1).getDay(); // 1일의 요일
    const weekInMonth = Math.ceil((date + firstdayOfWeek) / 7); // 몇번째 주

    const fetchWeeklyStats = async () => {
        try {
            const res = await api.get(`/routine/weekly/${year}/${month}/${weekInMonth}`);
            setWeeklyList(res.data);
            console.log("주간 통계 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };
    useEffect(() => {
        if (!year || !month || !date) {
            return;
        }
        if (selectedView !== 1){
            return;
        }

        fetchWeeklyStats();
    }, [year, month, weekInMonth, selectedView]);

    // Daily - 리스트, 통계 받아오기
    const [dailyList, setDailyList] = useState({dailyStatistic: 0, routines: []}); // { double dailyStatistic, List<RoutineResponse> routines }

    const fetchDailyStats = async () => {
        try{
            const res = await api.get(`/routine/daily/${selectedDate.toISOString().slice(0,10)}`);
            setDailyList(res.data);
            console.log("일간 통계 받아오기: ", res.data);
        } catch (e){
            console.error("fail fetch: ", e);
        }
    }
    useEffect(()=>{
        if(!date)  return;
        if(selectedView !== 2){
            return;
        }

        fetchDailyStats();
    }, [selectedDate, selectedView]);

    // 날짜 형식
    const formatDateLabel = () => {
        if (selectedView === 0) return `${year}-${month}`;
        if (selectedView === 1) return `${year}-${month} ${weekInMonth}주차`;
        if (selectedView === 2) return selectedDate.toLocaleDateString("ko-KR");
    }

    // add 후 화면 반영
    const handleAdd = (monthlyRoutine, weeklyRoutine) => {
        setMonthlyList(prev => [...prev, monthlyRoutine]);
        setWeeklyList(prev => [...prev, weeklyRoutine]);
    }
    // delete 후 화면 반영
    const handleDelete = (id) => {
        setMonthlyList(prev => prev.filter(r => r.id !== id));
        setWeeklyList(prev => prev.filter(r => r.id !== id));
        setDailyList(prev => ({
            ...prev,
            routines: prev.routines.filter(routine =>
                routine.id !== id
            )
        }));
    }
    // close 후 화면 반영
    const handleClose = (id) => {
        setMonthlyList(prev =>
            prev.map(item =>
                item.id === id ? {...item, isClosed: false} : item
            )
        );
        setWeeklyList(prev =>
            prev.map(item =>
                item.id === id ? {...item, isClosed: false} : item
            )
        );
    }
    // update 후 화면 반영
    const handleUpdate = (updatedData) => {
        setMonthlyList(prev =>
            prev.map(item =>
                item.id === updatedData.routineId ? {...item, name: updatedData.name, startDate: updatedData.startDate, endDate: updatedData.endDate} : item
            )
        );
        setWeeklyList(prev =>
            prev.map(item =>
                item.id === updatedData.routineId ? {...item, name: updatedData.name, startDate: updatedData.startDate, endDate: updatedData.endDate} : item
            )
        );
    }

    // 활성 루틴 보기 상태 (true: 활성 루틴 출력, false: 종료 루틴 출력)
    const [showActive, setShowActive] = useState(true);

    return (
        <div style={{display: "flex", width: "100%", height: "100%"}}>
            <RoutineList list={selectedView === 0 ? monthlyList : selectedView === 1 ? weeklyList : dailyList.routines} onAdd={handleAdd} onDelete={handleDelete} onClose={handleClose} onUpdate={handleUpdate} showActive={showActive} setShowActive={setShowActive} />
            <div style={{display: "flex", flexDirection: "column", width:"100%"}}>
                <div className={"RoutineHeader"}>
                    <button className={"CurrentDate"} onClick={() => setSelectedDate(new Date())}>현재 날짜로 이동</button>
                    <div className={"DateNavigator"} >
                        <button className={"DateNavButton"} onClick={handlePrev}><img className={"DateNavImg"} src={"images/left.png"} alt={"leftButton"}/></button>
                        <div>
                            <h2 className={"DateNavLabel"} onClick={() => {
                                if (dateInputRef.current?.showPicker) { // showPicker 지원하는 브라우저인 경우
                                    dateInputRef.current.showPicker();
                                }
                                else {
                                    dateInputRef.current?.click();
                                }
                            }}>{formatDateLabel()}</h2>
                            <input ref={dateInputRef} type="date" id="hiddenDateInput" value={selectedDate.toISOString().slice(0, 10)} onChange={(e) => {
                                setSelectedDate(new Date(e.target.value));
                            }} style={{opacity: 0, width: 0, height: 0, pointerEvents: "none"}}/>
                        </div>
                        <button className={"DateNavButton"} onClick={handleNext}><img className={"DateNavImg"} src={"images/right.png"} alt={"rightButton"}/></button>
                    </div>
                </div>
                <div className={"RoutineNavigator"} >
                    <div className={"ViewButton"} onClick={() => {
                        if (selectedView !== 0) {
                            setSelectedView(0);
                        }
                    }}><p className={"ViewMonthly"} style={{color: selectedView === 0 ? 'black' : 'lightgray'}}>월간</p></div>
                    <div className={"ViewButton"} onClick={() => {
                        if (selectedView !== 1) {
                            setSelectedView(1);
                        }
                    }}><p className={"ViewWeekly"} style={{color: selectedView === 1 ? 'black' : 'lightgray'}}>주간</p></div>
                </div>
                {selectedView === 0 && <MonthlyView list={monthlyList} year={year} month={month} showActive={showActive}/>}
                {selectedView === 1 && <WeeklyView list={weeklyList} showActive={showActive} />}
            </div>

        </div>
    );
}

export default RoutinePage;