import React, {useEffect, useState} from "react";

import api from '../api';

import Subject from "../timetable/Subject";

export default function TimeTablePage ({todayDate}) {
    const [table, setTable] = useState({id: "", name: "", isMain: ""});
    const [timeItem, setTimeItem] = useState([]);

    // 테이블 리스트 조회
    const fetchTimeTable = async () => {
        try {
            const response = await api.get('/timetable');
            const tables = response.data.data;
            console.log("테이블 리스트 조회: ", tables);

            // is_main이 true인 테이블을 찾아서 띄우기
            const mainTable = tables.find(t => t.isMain === true);
            if (mainTable) {
                setTable({id: mainTable.id, name: mainTable.name, isMain: mainTable.isMain});
            }

        } catch (e) {
            console.error("fail fetch: ", e);

            if (e.response) {
                console.log("Status:", e.response.status);
                console.log("Data:", e.response.data);
            }
        }
    };

    // 세부 시간표 리스트 조회
    const fetchTimeItem = async () => {
        if(!table) return;

        try {
            const timeItemRes = await api.get('/timetable/detail/' + table.id);

            setTimeItem(timeItemRes.data.data);
            console.log(timeItemRes.data.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    useEffect(() => {
        fetchTimeTable();
    }, [])

    useEffect(() => {
        console.log("fetchTimeItem");
        fetchTimeItem();
    }, [table])

    // 선택된 날짜의 요일 받아오기
    // (0=일, 1=월, ... 6=토 -> 0=월, ... 6=일 로 변환)
    const [todayIdx, setTodayIdx] = useState(null);
    useEffect(() => {
        const [y, m, d] = todayDate.split("-").map(Number);
        const localDate = new Date(y, m - 1, d);
        setTodayIdx((localDate.getDay() + 6) % 7);
    }, [todayDate])

    const fmt = (hhmmss) => (hhmmss ? hhmmss.slice(0,5) : '');

    return (
        <div style={{ width: "100%", height: "80%", border: "1px solid gray", borderRadius: "20px",
            display: "grid", gridTemplateRows:"50px"}}
        >
            <div style={{ padding: "15px 20px", fontSize: "20px", fontWeight: "bold" , borderBottom: "solid 1px gray"}}>
                TimeTable
            </div>
            <div style={{display: "flex", overflowY:"hidden"}}>
                <div style={{flex: 7}}>
                    {timeItem.map(s => {
                        const todaysDetails = s.details?.filter(d => d.weekday === todayIdx) ?? [];
                        if (todaysDetails.length === 0) return null; // 오늘 수업 없는 과목은 숨김
                        return (
                            <div key={s.courseId} style={{display: "flex", alignItems: "center"}}>
                                <Subject subject={s} />
                                {todaysDetails.map(d => (
                                    <span key={d.id}>
                                  {d.startTime.slice(0,5)} ~ {d.endTime.slice(0,5)}
                                </span>
                                ))}
                            </div>
                        );
                    })}

                </div>

            </div>


        </div>
    );
}