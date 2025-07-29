import WeeklyRoutine from "./WeeklyRoutine";
import './WeeklyRoutine.css';
import axios from "axios";
import {useEffect, useState} from "react";

export default function WeeklyView({list, showActive}) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // 렌더링할 루틴 필터링
    const displayedList = list.filter(routine => routine.isClosed !== showActive);

    return <div className={"WR_view_wrapper"}>
        <div>
            <div className={"WR_date_label_wrapper"}>
                {Array(7).fill().map((_,i) => (
                    <div className={"WR_date_label"} key={i}>{days.at(i)}</div>
                ))}
            </div>
            {displayedList.map((item) => (
                <WeeklyRoutine routine={item} key={item.id} />
                ))}

        </div>
    </div>;
}