import api from '../api';
import {useEffect, useState} from "react";

export default function RoutinePart({todayDate}) {
    // Daily - 리스트, 통계 받아오기
    const [dailyList, setDailyList] = useState({dailyStatistic: 0, routines: []}); // { double dailyStatistic, List<RoutineResponse> routines }

    const fetchDailyStats = async () => {
        try{
            const res = await api.get(`/routine/daily/${todayDate}`);
            setDailyList(res.data);
            console.log("일간 통계 받아오기: ", res.data);
        } catch (e){
            console.error("fail fetch: ", e);
        }
    }
    useEffect(()=>{
        if(!todayDate)  return;

        fetchDailyStats();
    }, [todayDate]);

    const handleCheckboxClick = async (e, id, isCompleted) => {
        e.preventDefault();

        try {
            const res = await api.post(`/routine/log`, {
                routineId: id,
                date: todayDate,
                isCompleted: isCompleted
            });
            if (res.data.success){
                alert(res.data.message);
                fetchDailyStats();
            }
        } catch (err) {
            console.error('에러 발생: ', err);
        }
    }

    return (
        <div style={{ width: "100%", border: "1px solid black", borderRadius: "20px",
            display: "grid", gridTemplateRows:"50px"
        }}
        >
            <div style={{display: "flex", alignItems: "center", borderBottom: "solid 1px"}}>
                <span style={{ padding: "15px 20px", fontSize: "20px", fontWeight: "bold" }}>
                    Routine
                </span>
                <p style={{display: "inline-block", padding: "15px 20px", marginLeft: "150px"}}>{dailyList.dailyStatistic}%</p>
                <div style={{width: "50%", position: "relative", marginBottom: "20px"}}>
                    <div className={"DR_achieve"}></div>
                    <div className={"DR_achievestat"} style={{width: `${dailyList.dailyStatistic}%`}}></div>
                </div>
            </div>

            <div className={"DR_List"} >
                {dailyList.routines.map((routine) => (
                    <div key={routine.id} onClick={(e) => handleCheckboxClick(e, routine.id, !routine.isCompleted)}>
                        <input type="checkbox" checked={routine.isCompleted}/>
                        <p style={{display: "inline-block", marginLeft: "10px"}}>{routine.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}