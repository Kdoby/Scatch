import { TokenStore } from "../TokenStore";
import api from '../api';

import axios from "axios";
import {useEffect, useState} from "react";

export default function DailyRoutine({list, setList, date}){

    const handleCheckboxClick = async (e, id, isCompleted) => {
        e.preventDefault();

        try {
            const res = await api.post(`/routine/log`, {
                routineId: id,
                date: date.toISOString().slice(0,10),
                isCompleted: isCompleted
            });
            if (res.data.success){
                alert(res.data.message);
                setList((prev => ({
                    ...prev,
                    routines: prev.routines.map(routine =>
                        routine.id === id ? {...routine, isCompleted: isCompleted} : routine
                    )
                })));
            }
        } catch (err) {
            console.error('에러 발생: ', err);
        }
    }
    return(
        <div className={"DR_wrapper"}>
            <div className={"DR_header"} style={{display: "flex", justifyContent: "space-around", padding: "20px"}}>
                <h2 style={{display: "inline-block"}}>Routine</h2>
                <p style={{display: "inline-block"}}>{list.dailyStatistic}%</p>
                <div className={"DR_achieve"}></div>
            </div>
            <div className={"DR_List"} >
                {list.routines.map((routine) => (
                    <div key={routine.id} onClick={(e) => handleCheckboxClick(e, routine.id, !routine.isCompleted)}>
                        <input type="checkbox" checked={routine.isCompleted}/>
                        <p style={{display: "inline-block", marginLeft: "10px"}}>{routine.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}