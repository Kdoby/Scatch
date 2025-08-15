import TodoList from './TodoList';
import TimeAttackMain from './TimeAttackMain';

import React, { useState, useEffect, useRef } from "react";


export default function Test(){
    const timeAttackRef = useRef(null);
    const todoListRef = useRef(null);
    const [userName, setUserName] = useState('test1');
    const [scrollLocation, setScrollLocation] = useState('down');
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

        // 페이지가 처음 렌더링되면 Component 2로 스크롤
        const timer = setTimeout(() => {
            todoListRef.current?.scrollIntoView({ behavior: "instant" });
        }, 10); // 혹은 10ms 정도

        // 스크롤 막기
        const preventScroll = (e) => {
            e.preventDefault();
        };

        window.addEventListener("wheel", preventScroll, { passive: false });

        return () => window.removeEventListener("wheel", preventScroll);
    }, []);

    // 위, 아래 이동 버튼 누르면 움직이게 하는 함수
    const handleClick = () => {
        if (scrollLocation === 'down') {
            timeAttackRef.current.scrollIntoView({ behavior: "smooth" });
            setScrollLocation('up');
        } else if (scrollLocation === 'up') {
            todoListRef.current.scrollIntoView({ behavior: "smooth" });
            setScrollLocation('down');
        }
    };



    return (
        <div className="h-screen overflow-hidden">
            <div ref={timeAttackRef} className="h-screen flex items-center justify-center bg-blue-300">
                <h1 className="text-4xl text-white">Component 1</h1>
                <button onClick={handleClick}
                        className="px-6 py-2 bg-yellow-400 text-black rounded-xl shadow-xl hover:bg-yellow-500 transition"
                >
                   아래로 스르륵 이동!
                </button>

                <TimeAttackMain userName={userName} todayDate={todayDate}/>
            </div>

            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

            <div ref={todoListRef} className="h-screen flex flex-col items-center justify-center bg-gray-800">
                <h1 className="text-4xl text-white mb-4">Component 2</h1>
                <button onClick={handleClick}
                        className="px-6 py-2 bg-yellow-400 text-black rounded-xl shadow-xl hover:bg-yellow-500 transition"
                >
                  위로 스르륵 이동!
                </button>

                <div>
                    UserName : <input type="text"
                                      defaultValue= {userName}
                                      onChange={(e) => setUserName(e.target.value)}
                               />
                </div>

                <TodoList userName={userName} todayDate={todayDate} fetchTodayDate={fetchTodayDate} setDate={setDate}/>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>

    );
}

