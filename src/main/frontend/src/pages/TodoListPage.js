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

        document.getElementById("inputDate 1").value = formatted;
        setDate(formatted);
    }

    useEffect(() => {
        // 오늘 날짜 fetch
        fetchTodayDate();
    }, []);

    return (
        <div style={{ padding:"40px", height:"100%" }}>
            <TodoList todayDate={todayDate} fetchTodayDate={fetchTodayDate} setDate={setDate}/>
        </div>
    );
}