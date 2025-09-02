import RepeatTypeSelect from './RepeatTypeSelect';
import Palette from '../component/Palette';

import "./Edit_schedule.css";

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useEffect, useState } from "react";
import axios from "axios";


export default function EditSchedule({ selectedDate, onClose, editEvent, palette }) {
    const [timeChecked, setTimeChecked] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventColor, setEventColor] = useState("#0000FF");
    const [eventMemo, setEventMemo] = useState('');
    const [eventStartDateTime, setEventStartDateTime] = useState('');
    const [eventEndDateTime, setEventEndDateTime] = useState('');
    const [eventRepeat, setEventRepeat] = useState('none');
    const [eventRepeatEndDateTime, setEventRepeatEndDateTime] = useState('');

    useEffect(() => {
        if(!editEvent) return;

        // console.log("timeChecked: " + timeChecked);
        // console.log("editEvent: ", editEvent);

        // id에 대한 정보 set 해두기
        setEventTitle(editEvent.title);
        setEventColor(editEvent.color);
        setEventMemo(editEvent.memo);
        setEventRepeat(editEvent.repeat);
    }, [editEvent]);

    useEffect(() => {
        const start = new Date(editEvent.startDateTime);
        const end = new Date(editEvent.endDateTime);
        const rEnd = new Date(editEvent.repeatEndDateTime);

        const newStart = formatDate3(start);
        const newEnd = formatDate3(end);
        const newREnd = formatDate3(rEnd);

        setEventStartDateTime(newStart);
        setEventEndDateTime(newEnd);
        setEventRepeatEndDateTime(newREnd);

        const isSameDate = !(
            start.getFullYear() === end.getFullYear() &&
            start.getMonth() === end.getMonth() &&
            start.getDate() === end.getDate() &&
            start.getHours() === 0 && start.getMinutes() === 0 && start.getSeconds() === 0 &&
            end.getHours() === 23 && end.getMinutes() === 59 && end.getSeconds() === 59
        );
        // console.log("isSameDate: " + isSameDate)
        setTimeChecked(isSameDate);

    }, [editEvent]);


    useEffect(() => {
        if (!selectedDate) return;
        if (!eventTitle) return;

        if(!timeChecked){
            const tempDate1 = new Date(selectedDate);
            tempDate1.setHours(0, 0, 0, 0);
            // console.log("tempDate1: " + tempDate1);

            const tempDate2 = new Date(selectedDate);
            tempDate2.setHours(23, 59, 59, 999);
            // console.log("tempDate2: " + tempDate2);


            setEventStartDateTime(tempDate1);
            setEventEndDateTime(tempDate2);
        }
        else{
            // setEventStartDateTime(formatDate3(selectedDate));
            // setEventEndDateTime(formatDate3Plus1Hour(selectedDate));
        }

    }, [timeChecked, selectedDate])

    // 해당 날짜를 min에 맞게 수정.
    const formatDate = (date) =>
        date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : null;

    const formatTime = (date) =>
        date ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}` : null;

    const formatDate2 = (date) => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;  // 유효하지 않은 날짜일 경우 처리
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    // Date로 감싸기
    const formatDate3 = (date) => {
        if(!date) return null;

        const d = new Date(date);
        if (isNaN(d.getTime())) {
            console.warn("⚠️ Invalid date passed to formatDate3:", date);
            return null;
        }

        // console.log("formatDate3: " + d);
        return d;
    }

    const formatDate3Plus1Hour = (date) => {
        if(!date) return null;

        const d = new Date(date);
        d.setTime(date.getTime() + 60 * 1000 * 60);

        // console.log("formatDate3Plus1Hour: " + d);
        return d;
    }

    // input type : datetime-local min 정할 때 필요한 포맷
    const formatDate4 = (date) => {
        if (!date) return null;

        const d = new Date(date);
        if (isNaN(d.getTime())) return null;

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    };

    const formatDate4Plus1Hour = (date) => {
        if (!date) return null;

        const d = new Date(date);
        d.setTime(d.getTime() + 60 * 1000 * 60); // 한 시간 더함

        // ⬇️ 이걸 추가해서 포맷까지 적용
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    };

    // input type : datetime-local min 정할 때 필요한 포맷
    const formatDate5 = (date) => {
        if (!date) return null;

        const d = new Date(date);
        if (isNaN(d.getTime())) return null;

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}`;
    };

    // 해당 날짜를 반복 했을 때 max date를 구하기
    const RepeatEndDateRange = (date) => {
        if (!date) return undefined;

        const tempDate = new Date(date);

        if(eventRepeat === "daily"){
            tempDate.setDate(tempDate.getDate() + 31);
        }
        else if(eventRepeat === "weekly"){
            tempDate.setDate(tempDate.getDate() + (31 * 3));
        }
        else if(eventRepeat === "monthly"){
            tempDate.setDate(tempDate.getDate() + (31 * 12));
        }
        else if(eventRepeat === "yearly"){
            tempDate.setDate(tempDate.getDate() + (31 * 12 * 3));
        }

        return tempDate;
    }

    // 일정 추가
    const doEditEvent = async (id) => {
        console.log("editEvent: "  + " " +  timeChecked  + " " + eventStartDateTime + " "
                + eventEndDateTime+ " " + eventTitle + " " + eventRepeat + " " + eventRepeatEndDateTime + " " + eventMemo);
        try {
            const payload = {
                title: eventTitle,
                color: eventColor,
                memo: eventMemo,
                startDate: formatDate(eventStartDateTime),
                startTime: formatTime(eventStartDateTime),
                endDate: formatDate(eventEndDateTime),
                endTime: formatTime(eventEndDateTime),
                repeat: eventRepeat,
                repeatEndDate: formatDate(eventRepeatEndDateTime),
                repeatEndTime: formatTime(eventRepeatEndDateTime),
            };

            const response = await api.put('/calendar/' + id, payload);

            onClose(true);
            if(response.data.success){
                alert(response.data.message);
                console.log(response.data.message);
            }else {
                alert("response error");
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="Edit_schedule" style={{ border: "1px solid gray", padding: "10px", marginTop: "10px" }}>

            <div style={{ margin: "20px" }}>
                <button onClick={onClose}
                        style={{ float: "right",
                                 marginBottom: "15px"
                        }}
                >X</button>

                <div style={{float: "none"}} />
                <input type="text"
                       style={{ width: "98%",
                                padding: "10px 5px",
                                fontSize: "30px",
                                border: "none",
                                outline: "none"
                       }}
                       value={eventTitle}
                       onChange={(e) => setEventTitle(e.target.value)}
                />

                <div style={{height: "20px"}} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "10px", textAlign: "left"}}>
                    <div>태그 컬러</div>
                    <div>
                        <Palette paletteN={palette} setColor={setEventColor}/>
                    </div>
                    <div>기간 설정</div>
                    <div>
                        <input id="todoCheck" type="checkbox"
                               style={{width:"20px", height:"20px"}}
                               onChange={(e) => setTimeChecked(e.target.checked)}
                               checked={timeChecked}
                        />
                        <label htmlFor="todoCheck" style={{ margin:0 }}></label>
                    </div>

                    {timeChecked && (
                        <>
                            <div />
                            <div>
                                <input key={formatDate4(eventStartDateTime)}
                                       type="datetime-local"
                                       value={formatDate4(eventStartDateTime)}
                                       onChange={(e) => setEventStartDateTime(formatDate3(e.target.value))}
                                />
                                <br />~<br />
                                <input key={formatDate4(eventEndDateTime)}
                                       type="datetime-local"
                                       value={formatDate4(eventEndDateTime)}
                                       min={formatDate4(eventStartDateTime)}
                                       onChange={(e) => setEventEndDateTime(formatDate3(e.target.value))}
                                />
                            </div>
                        </>
                    )}
                </div>

                <hr style={{margin: "30px auto"}} />


                <div style={{ display: "grid", gridTemplateColumns: "1fr 5fr", gap: "10px", textAlign: "left"}}>
                    <div>반복</div>
                    <div>
                        <RepeatTypeSelect eventStartDateTime={eventStartDateTime} eventEndDateTime={eventEndDateTime}
                                          eventRepeat={eventRepeat} setEventRepeat={setEventRepeat}
                        />
                    </div>


                    <div>반복 end</div>
                    <div>
                        <input id="repeatEndDateInput"
                               type="date"
                               min={formatDate2(eventEndDateTime)}
                               max={formatDate2(RepeatEndDateRange(eventStartDateTime))}
                               disabled={eventRepeat === "none"}

                               value={formatDate5(eventRepeatEndDateTime)}
                               onChange={(e) => setEventRepeatEndDateTime(formatDate3(e.target.value))}
                        />
                    </div>


                    <div>메모</div>
                    <div>
                        <input type="text"
                               style={{ width: "100%", margin: 0 }}
                               value={eventMemo}
                               onChange={(e) => setEventMemo(e.target.value)}
                        />
                    </div>
                </div>

            </div>

            <br />
            <button style={{marginRight:"10px"}}
                    onClick={() => doEditEvent(editEvent.id)}
            >저장</button>
        </div>
    );
}
