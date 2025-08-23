import Palette from '../component/Palette';

import { TokenStore } from "../TokenStore";
import api from '../api';

import {useMemo, useState, useEffect} from "react";

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

export default function AddTimeTable ({isOpen, closeModal, onAdd}) {
    const [form, setForm] = useState({subject: "", instructor: "", times: [], color: "#0000FF"});
    const [day, setDay] = useState("");
    const [loca, setLoca] = useState("");
    const [palette, setPalette] = useState(1);

    // 팔레트 조회
    const fetchPalette = async () => {
        try {
            const res = await api.get('/member/palette');

            //alert(res.data.message + res.data.data);
            setPalette(res.data.data);
            console.log("fetchPalette 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

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

    const addTimeToForm = () => {
        if(!day || startMin == null || endMin == null) return;
        console.log(`${format(startMin)} ~ ${format(endMin)}`)

        const newTime = {
            day,
            loca,
            startTime: format(startMin),
            endTime: format(endMin)
        };

        setForm(prev => ({
            ...prev,
            times: [...prev.times, newTime]
        }));

        setDay("");
        setLoca("");
        setStartMin(9 * 60);
        setEndMin(9 * 60 + 30);
    }

    const handleSubmit = (event) => {
        if(!form.subject) return;

        const newItem = {
            subject: form.subject,
            instructor: form.instructor,
            times: form.times,
            color: form.color
        }

        onAdd(newItem);
        setForm({subject: "", instructor: "", times: [], color: "#0000FF"});
        setDay("");
        setLoca("");
        setStartMin(9 * 60);
        setEndMin(9 * 60 + 30);
    }

    useEffect(() => {
        fetchPalette();
    }, []);

    return (
        <div style={{display:isOpen?"block": "none",
                     position: "fixed",
                     top: 0,
                     left: 0,
                     width: "100vw",
                     height: "100vh",
                     backgroundColor: "rgba(0,0,0,0.35)",
                     zIndex:"100"}}>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "463px",
                backgroundColor: "white",
                borderRadius: "20px",
                border: "solid 1px",
                zIndex: 10
            }}>
                <div style={{padding: "50px"}}>
                    <div>
                        <h2 style={{display: "inline"}}>과목추가</h2>
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
                    <input type="text" value={form.subject}
                           onChange={(e) => setForm({ ...form, subject: e.target.value})}
                           style={{ width: "100%" }}
                    />
                    <p>teacher : </p>
                    <input type="text" value={form.instructor}
                           onChange={(e) => setForm({ ...form, instructor: e.target.value})}
                           style={{ width: "100%" }}
                    />
                    <br /><br />
                    color :&nbsp;&nbsp;&nbsp;
                    <Palette paletteN={palette} setColor={(color) => setForm({ ...form, color })}  />

                    <div>
                        <ul style={{listStyle: "none", padding:0}}>
                            {form.times.map((time, index) => (
                                <li key={index} style={{backgroundColor: "lightgray"}}>
                                    {time.day} {time.startTime} ~ {time.endTime} {time.loca}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ border:"solid black 1px",
                                  padding: "10px",
                                  borderRadius: "10px"
                               }}
                    >
                        <select value={day} onChange={(e) => setDay(e.target.value)}>
                                <option value="" disabled hidden>요일</option>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                                    <option key={d} value={d}>{d}</option>
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

                        <button onClick={addTimeToForm}>ADD</button>
                    </div>

                     <br/>
                     <button onClick={handleSubmit}>submit</button>
                </div>

            </div>
        </div>
    );
}