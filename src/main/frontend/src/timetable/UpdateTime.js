import { TokenStore } from "../TokenStore";
import api from '../api';

import axios from "axios";
import {useState, useEffect} from "react";

export default function UpdateTime ({isOpen, closeModal, item: i, time: t, onUpdated}) {
    const [item, setItem] = useState(i);
    const [time, setTime] = useState(t);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {setItem(i);}, [i]);
    useEffect(() => {setTime(t);}, [t]);

    const handleSubmit = () => {
        const fetchTime = async () => {
            try {
                const response = await api.put('/timetable/detail', {
                    tableDetailDto: {
                        timeTableDetailId: time.id,
                        weekday: time.weekday,
                        location: time.location,
                        startTime: time.startTime,
                        endTime: time.endTime
                    },
                    courseDto: {
                        courseId: item.courseId,
                        title: item.title,
                        instructor: item.instructor,
                        color: item.color
                    }
                });
                if(response.data.success){
                    console.log(response.data.message);
                    onUpdated(item, time);
                    alert('수정되었습니다.');
                    closeModal();
                }
                else {
                    console.log("수정 실패:", response.data.message);
                }
            } catch (error) {
                console.error("에러 발생:", error);
            }
        };
        fetchTime();
    }
    return <div style={{ display:isOpen?"block":"none",
                         position: "fixed",
                         top: 0,
                         left: 0,
                         width: "100vw",
                         height: "100vh",
                         backgroundColor: "rgba(0,0,0,0.35)",
                         zIndex:"100" }}>
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "463px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: "solid 1px"
        }}>
            <div style={{padding: "50px"}}>
                <div>
                    <h2 style={{display: "inline"}}>과목수정</h2>
                    <img src="/close.png"
                         onClick={closeModal}
                         style={{ float: "right",
                                  border: "none",
                                  outline: "none",
                                  backgroundColor: "inherit",
                                  cursor: "pointer",
                                  fontSize: "x-large",
                                  marginRight: "0px",
                                  height: "20px"}}
                    />
                </div>
                <hr/>
                <p>subject : </p>
                <input type="text" value={item.title}
                       onChange={(e) => setItem({ ...item, title: e.target.value})}
                       style={{ width: "100%" }}
                />
                <p>teacher : </p>
                <input type="text" value={item.instructor}
                       onChange={(e) => setItem({ ...item, instructor: e.target.value})}
                       style={{ width: "100%" }}
                />
                <br /><br />
                color :&nbsp;&nbsp;&nbsp;
                <input type="color" value={item.color} onChange={(e) => setItem({...item, color: e.target.value})} />
                <br/><br/>

                <div style={{border:"solid black 1px",
                    padding: "10px",
                    borderRadius: "10px"}}>
                    <select value={time.weekday} onChange={(e) => {
                        const dayIndex = days.indexOf(e.target.value);
                        setTime({...time, weekday: dayIndex});
                        console.log(time.weekday);
                    }}>
                        <option value="" selected disabled hidden>요일</option>
                        {days.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <input type="time" value={time.startTime}
                           onChange={(e) => setTime({...time, startTime: e.target.value})} />
                    ~
                    <input type="time" value={time.endTime}
                           onChange={(e) => setTime({...time, endTime: e.target.value})} />
                    <input type="text" value={time.location}
                           onChange={(e) => setTime({...time, location: e.target.value})} placeholder="장소/메모"
                           style={{ width: "100%" }}
                    />

                </div>

                <br/>
                <button onClick={handleSubmit}>submit</button>
            </div>

        </div>
    </div>
}
