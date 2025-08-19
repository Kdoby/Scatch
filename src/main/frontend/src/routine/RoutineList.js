import Routine from "./Routine.js";
import './RoutineList.css';
import AddRoutine from "./AddRoutine";
import {useState} from "react";

export default function RoutineList({list, onAdd, onDelete, onClose, onUpdate, showActive, setShowActive}) {
    // 루틴 추가 창 출력 여부
    const [isAddOpen, setIsAddOpen] = useState(false);

    // 렌더링할 루틴 필터링
    const displayedList = list.filter(routine => routine.isClosed !== showActive);


    return (
        <div className={"R_leftList"}>
            <button onClick={() => setShowActive(true)}>진행중인 루틴</button>
            <button onClick={() => setShowActive(false)}>종료된 루틴</button>
            <h2>Routine</h2>
            <hr />
            {displayedList.map((item) => (
                <Routine routine={item} key={item.id} onDelete={onDelete} onClose={onClose} onUpdate={onUpdate}/>
            ))}
            <button className={"AddRoutineButton"} onClick={() => setIsAddOpen(true)}>+</button>
            <AddRoutine onAdd={onAdd} isOpen={isAddOpen} closeModal={() => setIsAddOpen(false)}/>
        </div>

    );
}