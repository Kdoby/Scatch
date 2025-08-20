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
                <div style={{ width: "100%", height:"100%", padding:"70px 0 40px",
                              display:"grid", gridTemplateRows:"1fr 7fr" }}
                >
                    <div style={{ width: "100%", border:"1px solid black",
                                  display: "grid", gridTemplateColumns: "2fr 1fr",
                                  marginBottom:"20px"
                                }}
                    >
                        <div style={{ width:"100%", height:"100%",
                                      display:"grid", gridTemplateColumns:"1fr 8fr", gridTemplateRows:"3fr 2fr", gap:"5px 10px",
                                      gridTemplateAreas: `
                                            "one two"
                                            "one three"
                                      `,
                                      border:"1px solid black" }}
                        >
                            <div className="one" style={{ border:"1px solid black" }}>
                                <div style={{ width: "100px", height: "100px",
                                              borderRadius: "50%", backgroundColor: "skyblue" }}
                                >
                                프로필
                                </div>
                            </div>
                            <div className="two" style={{ border:"1px solid black" }}>
                                User
                            </div>
                            <div className="three" style={{ border:"1px solid black" }}>
                                자리소개
                            </div>
                        </div>
                        <div style={{ border:"1px solid black" }}>
                            날짜 정보
                        </div>
                    </div>

                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"35fr 65fr", gap: "20px 30px" }}>
                        <div style={{ width: "100%", border:"1px solid black" }}>
                            plan
                        </div>
                        <div style={{ width: "100%", border:"1px solid black" }}>
                            routine
                        </div>
                        <div style={{ width: "100%", border:"1px solid black" }}>
                            time-table
                        </div>
                        <div style={{ width: "100%", border:"1px solid black" }}>
                            todolist
                        </div>
                    </div>
                </div>

                {/* 버튼을 중앙 상단에 고정 */}
                <button
                    onClick={handleClick}
                    style={{ position: "absolute", top: "1.5rem", left: "50%",
                             padding: "0.5rem 1.5rem",
                             backgroundColor: "#facc15", color: "black",
                             borderRadius: "0.75rem",
                             boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                             transition: "background-color 0.3s",
                             transform: "translateX(-50%)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f59e0b"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#facc15"}
                >
                    위로 이동!
                </button>
            </div>
        </div>

    );
}

