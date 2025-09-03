import Palette from '../component/Palette';

import { TokenStore } from "../TokenStore";
import api from '../api';

import axios from "axios";
import {useState, useEffect, useMemo} from "react";

// 수정 전 정보 "HH:MM" or "HH:MM:SS" -> 분단위로 변환
const toMin = (s) => {
    if (!s) return null;
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
};

// m = 분단위 -> "HH:MM" 형식으로 변환
const format = (m) => {
    // 24:00 -> 00:00 , 25:00 -> 01:00 으로 정규화
    const norm = ((m % (24 * 60)) + (24 * 60)) % (24 * 60);
    const hh = String(Math.floor(norm / 60)).padStart(2, "0");
    const mm = String(norm % 60).padStart(2, "0");
    return `${hh}:${mm}`;
};

// time 입력받을 30분 단위 select option 생성
const buildOptions = (startMin, endMin, step = 30) => {
    const list = [];
    for(let m = startMin; m <= endMin; m += step)
        list.push(m);
    return list;
};

export default function UpdateTime ({ isOpen, closeModal, item, time, palette, fetchTable}) {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [day, setDay] = useState(time.weekday);
    const [loca, setLoca] = useState(time.location);
    const [title, setTitle] = useState(item.title);
    const [instructor, setInstructor] = useState(item.instructor);
    const [color, setColor] = useState(item.color);

    // 첫 랜더링 이후에도 item, time이 바뀔때마다(모달 열때마다) state 동기화 시키기
    useEffect(() => {
        console.log("수정 열림, item: ", item, "time: ", time );
        if (!isOpen || !item || !time) return;

        setTitle(item.title ?? '');
        setInstructor(item.instructor ?? '');
        setColor(item.color ?? "#0000FF");
        setLoca(time.location ?? '');
        setDay(time.weekday);

        const s = toMin(time.startTime) ?? 9*60;
        const e = toMin(time.endTime) ?? (s + 30);
        setStartMin(s);
        setEndMin(Math.max(e, s + 30));

    }, [isOpen, item, time])

    // startTime의 선택지는 09:00 ~ 24:00(00:00)
    const startOptions = useMemo(() => buildOptions(9 * 60, 24 * 60, 30), []);
    // 분 단위로 관리
    const [startMin, setStartMin] = useState(9*60);
    const [endMin, setEndMin] = useState(9 * 60 + 30);

    // 시작 시간 선택(변경)하면 종료 선택지는 항상 시작+30분 이상이 되도록 보정
    const handleStartChange = (e) => {
        const s = Number(e.target.value);
        const minEnd = s + 30; // 시작 + 30분 부터
        const maxEnd = 25 * 60; // 01:00(25:00) 까지
        setStartMin(s);
        // max(이전 값, 시작+30) => 이전 값이 시작+30보다 작으면 시작+30으로 보정,
        // min(25*60, ...) => 이전 값이 01:00보다 크면 01:00으로 줄여주기
        setEndMin((prev) => Math.min(maxEnd, Math.max(prev, minEnd)));
    };

    // endTime의 선택지는 startTime 선택에 따라 동적으로 생성
    const endOptions = useMemo(() => {
        const minEnd = startMin + 30;
        const maxEnd = 25 * 60;
        return buildOptions(minEnd, maxEnd, 30);
    }, [startMin]);

    const handleEndChange = (e) => {
        setEndMin(Number(e.target.value));
    };

    const handleSubmit = async () => {
        try {
            const response = await api.put('/timetable/detail', {
                tableDetailDto: {
                    timeTableDetailId: time.id,
                    weekday: day,
                    location: loca,
                    startTime: format(startMin),
                    endTime: format(endMin)
                },
                courseDto: {
                    courseId: item.courseId,
                    title: title,
                    instructor: instructor,
                    color: color
                }
            });
            if(response.data.success){
                console.log(response.data.message);
                fetchTable();
                alert('수정되었습니다.');
                closeModal();
            }
            else {
                console.log("수정 실패:", response.data.message);
            }
        } catch (error) {
            console.error("에러 발생:", error);
        }
    }
    return <div style={{ display:isOpen?"block":"none",
                         position: "fixed",
                         top: 0,
                         left: 0,
                         width: "100vw",
                         height: "100vh",
                         backgroundColor: "rgba(0,0,0,0.35)",
                         zIndex:"1000" }}>
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
                    <img src="images/close.png"
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
                <input type="text" value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       style={{ width: "100%" }}
                />
                <p>teacher : </p>
                <input type="text" value={instructor}
                       onChange={(e) => setInstructor(e.target.value)}
                       style={{ width: "100%" }}
                />

                <br /><br />

                color :&nbsp;&nbsp;&nbsp;
                <Palette paletteN={palette} setColor={setColor} />

                <br/><br/>

                <div style={{border:"solid black 1px",
                    padding: "10px",
                    borderRadius: "10px"}}>
                    <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
                        <option value="" disabled hidden>요일</option>
                        {dayLabels.map((d, idx) => (
                            <option key={d} value={idx}>{d}</option>
                        ))}
                    </select>
                    <select value={startMin} onChange={handleStartChange} >
                        {startOptions.map((m) => (
                            <option key={m} value={m}>
                                {format(m)}
                            </option>
                        ))}
                    </select>
                    ~
                    <select value={endMin} onChange={handleEndChange} >
                        {endOptions.map((m) => (
                            <option key={m} value={m}>
                                {format(m)}
                            </option>
                        ))}
                    </select>
                    <input type="text" value={loca}
                           onChange={(e) => setLoca(e.target.value)} placeholder="장소/메모"
                           style={{ width: "100%" }}
                    />

                </div>

                <br/>
                <button onClick={handleSubmit}>submit</button>
            </div>

        </div>
    </div>
}
