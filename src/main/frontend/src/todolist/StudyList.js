import {useState} from "react";
import AddStudyLog from "./AddStudyLog";
import StudyLog from "./StudyLog";
import './StudyLog.css'

export default function StudyList ({userId, list, selectedDate, onAdd, onDelete, onUpdate}) {
    // 루틴 추가 창 출력 여부
    const [isAddOpen, setIsAddOpen] = useState(false);

    return (
        <div className={"L_leftList"}>
            {list.map((item) => (
                <StudyLog userId={userId} selectedDate={selectedDate} log={item} key={item.id} onDelete={onDelete} onUpdate={onUpdate}/>
            ))}
            <button className={"AddStudyLogButton"} onClick={() => setIsAddOpen(true)}>+</button>
            {isAddOpen && (
                <AddStudyLog userId={userId} selectedDate={selectedDate} onAdd={onAdd} isOpen={isAddOpen} closeModal={() => setIsAddOpen(false)}/>
                )}
        </div>

    );
}