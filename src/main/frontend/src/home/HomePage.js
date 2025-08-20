import TimeAttackMain from '../timeattack/TimeAttackMain';

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useState, useEffect, useRef } from "react";


export default function HomePage(){
    const timeAttackRef = useRef(null);
    const todoListRef = useRef(null);
    const [scrollLocation, setScrollLocation] = useState('down');
    const [todayDate, setDate] = useState('');  // 투두 전체적인 것에 대한 날짜

    // 오늘 날짜 fetch
    const fetchTodayDate = async () => {
        const today = new Date();
        const formatted = today
            .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/\. /g, '-')
            .replace('.', '');

        console.log(formatted);
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
            <div ref={timeAttackRef}
                 style={{
                     height: "100vh",
                     position: "relative",
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "center",
                 }}
            >
                <TimeAttackMain todayDate={todayDate}/>

                {/* 버튼을 화면 중앙 하단에 고정 */}
                <button
                    onClick={handleClick}
                    style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#facc15",
                        color: "black",
                        borderRadius: "0.75rem",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                        transition: "background-color 0.3s",
                      }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f59e0b"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#facc15"}
                >
                    아래로 이동!
                </button>
            </div>

            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

            <div ref={todoListRef}
                 style={{
                    height: "100vh",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                 }}
            >
                <h1>Component 2</h1>

                {/* 버튼을 중앙 상단에 고정 */}
                <button
                    onClick={handleClick}
                    style={{
                        position: "absolute",
                        top: "1.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#facc15",
                        color: "black",
                        borderRadius: "0.75rem",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                        transition: "background-color 0.3s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f59e0b"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#facc15"}
                >
                    위로 이동!
                </button>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>

    );
}

