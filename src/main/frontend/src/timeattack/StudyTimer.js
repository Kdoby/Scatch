import React, {useEffect, useRef, useState} from "react";
import api from "../api";
import {TokenStore} from "../TokenStore";
import axios from "axios";
import {Navigate, useLocation} from "react-router-dom";

export default function StudyTimer ({adv, targetTime, mode, onStop, onPause, onResume, onContinue, onSaveByEndTime, getCurrentLocalDateTime, setIsCheckOpen}) {
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
                    <button onClick={() => {
                        onSaveByEndTime(CompletedTime);
                        onContinue(isFinished);
                    }}>Continue</button>
                    <button onClick={() => {
                        onSaveByEndTime(CompletedTime);
                        setIsCheckOpen(true);
                        // SelectedTodo, SelectedMode, TargetTime 초기화는 CheckTodo에서
                    }}>Done</button>
                </div>
            </div>
        );
    }

    return(
        <div>
            <h2 style={{margin: "20px", color: "#5d5d5d"}}>{mode === "normal" ? "Normal Mode" : "🔥Hard Mode🔥"}</h2>
            <h2 className={"ST_remainingTime"}>{String(hours).padStart(2, "0")} : {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}</h2>
            <div style={{ fontSize:"25px", textAlign:"center", margin:"20px"}}
                 key={adv.id}
            >
                <span>{adv.content}</span>
                <br />
                <span style={{fontSize:"15px"}}>-{adv.contentWriter}</span>
            </div>
            {mode === "normal" ? (
                <>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <p onClick={() => onContinue(isFinished)} style={{textDecoration: "underline", cursor:"pointer", width: "fit-content", marginBottom: "20px"}}>continue</p>
                    </div>
                    <div>
                        <button className={"ST_button"} onClick={() => {
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
                        <button className={"ST_button"} onClick={onStop} >
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