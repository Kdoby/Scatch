import {useRef, useState} from "react";
import axios from 'axios';
import "./RoutineList.css";

export default function UpdateRoutine ({routine, isOpen, onClose, onUpdate}) {
    const [routineName, setRoutineName] = useState(routine.name);
    const [startDate, setStartDate] = useState(routine.startDate);
    const [endDate, setEndDate] = useState(routine.endDate);
    const nameRef = useRef();
    const startRef = useRef();
    const endRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(new Date(endDate) <= new Date(startDate)) {
            alert("종료일은 시작일 이후로 선택해주세요.");
            endRef.current.focus();
            return;
        }
        try {
            const updatedData = {
                routineId: routine.id,
                name: routineName,
                startDate: startDate,
                endDate: endDate
            };
            const res = await axios.put('http://localhost:8080/routine', updatedData);
            if (res.data.success) {
                alert(res.data.message);
                onClose();
                onUpdate(updatedData);
            }
            else {
                console.log("루틴 수정 실패: ", res.data.message);
            }
        } catch (err) {
            if(err.response && err.response.message) {
                alert("루틴 수정 에러: ", err.response.message);
            }
            else {
                alert("루틴 수정 오류 발생")
            }
        }
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
                    }} src={"./close.png"} alt={"closeModal"} onClick={onClose}></img>

                    <form className={"AR_form"}>
                        <div>
                            <input type="text" ref={nameRef} className={"AR_routineName"} placeholder={"루틴 이름"} value={routineName} onChange={(e) => setRoutineName(e.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor="start-date" className={"AR_inputLabel"}>시작일 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                            <input type="date" ref={startRef} value={startDate} onChange={(e) => setStartDate(e.target.value)} id="start-date" name="start-date" required/>

                        </div>

                        <div>
                            <label htmlFor="end-date" className={"AR_inputLabel"}>종료일 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                            <input type="date" ref={endRef} value={endDate} onChange={(e) => setEndDate(e.target.value)} id="end-date" name="end-date" required/>
                        </div>

                        <button className={"AR_submit"} onClick={handleSubmit}>수정</button>
                    </form>

                </div>

            </div>
        </div>
    );
}