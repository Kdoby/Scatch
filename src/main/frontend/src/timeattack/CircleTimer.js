import React from "react";

export default function CircleStudyTimer ({}) {
    return (<div>
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
    </div>);
}