import axios from "axios";
import {useEffect, useState} from "react";

export default function DailyRoutine({list, setList, date}){

    const handleCheckboxClick = async (e, id, isCompleted) => {
        e.preventDefault();

        try {
            const res = await axios.post(`http://localhost:8080/routine/log`, {
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
            <div className={"DR_header"}>
                <h2>Routine</h2>
                <p>{list.dailyStatistic}%</p>
                <div className={"DR_achieve"}></div>
            </div>
            <div className={"DR_List"}>
                {list.routines.map((routine) => (
                    <div key={routine.id} onClick={(e) => handleCheckboxClick(e, routine.id, !routine.isCompleted)}>
                        <input type="checkbox" checked={routine.isCompleted}/>
                        <p>{routine.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}