import TodoList from "../todolist/TodoList";

import React, { useState, useEffect, useRef } from "react";

export default function CalendarPage(){
    const [todayDate, setDate] = useState('');  // 투두 전체적인 것에 대한 날짜


    // 오늘 날짜 fetch
    const fetchTodayDate = async () => {
        const today = new Date();
        const formatted = today
            .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/\. /g, '-')
            .replace('.', '');

        setDate(formatted);
    }
    // YYYY-MM-DD -> Date
    const parseYMD = (str) => {
        const [y, m, d] = str.split("-").map(Number);
        // 월은 0-based
        return new Date(y, m - 1, d);
    };
    // 날짜 이동 함수
    const handlePrev = () => {
        setDate(prev => {
            const newDate = parseYMD(prev);
            newDate.setDate(newDate.getDate() - 1);
            return newDate
                .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                .replace(/\. /g, '-')
                .replace('.', '');;
        });
    };
    const handleNext = () => {
        setDate(prev => {
            const newDate = parseYMD(prev);
            newDate.setDate(newDate.getDate() + 1);
            return newDate
                .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                .replace(/\. /g, '-')
                .replace('.', '');
        });
    };

    useEffect(() => {
        // 오늘 날짜 fetch
        fetchTodayDate();
    }, []);

    return (
        <div style={{ padding:"40px", height:"100%" }}>
            <TodoList todayDate={todayDate} fetchTodayDate={fetchTodayDate} setDate={setDate} handlePrev={handlePrev} handleNext={handleNext}/>
        </div>
    );
}