import styles from './LeftList.module.css';
import Subject from "./Subject.js";
import AddTimeTable from "./AddTimeTable";
import {useState} from "react";
import api from '../api';

export default function SubjectList({ subjectList, selectedTable, fetchTable, palette }) {
    /* 시간표 subject 추가 버튼 */
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const openSubModal = () => setIsSubModalOpen(true);
    const closeSubModal = () => setIsSubModalOpen(false);

    // 세부 시간표 등록
    const handleAddItem = async (newItem) => {
        try {
            // 1. 과목 생성
            const courseRes = await api.post('/timetable/course', {
                title: newItem.subject,
                instructor: newItem.instructor,
                color: newItem.color
            });

            const course_id = courseRes.data.data;

            // 2. 시간 블록 생성
            for(const time of newItem.times){
                const dayIndex = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(time.day);
                const response = await api.post('/timetable/detail', {
                    courseId: course_id,
                    timeTableId: selectedTable.id,
                    weekday: dayIndex,
                    location: time.loca,
                    startTime: time.startTime,
                    endTime: time.endTime
                });
                console.log("시간 블록 저장 응답:", response.data);
            }

            // 3. 시간 블록 재조회
            await fetchTable();
            closeSubModal();
            alert(`${newItem.subject}가 등록되었습니다.`);
        } catch (e) {
            console.error("fail fetch: ", e);
            alert("시간표 저장 실패");
        }
    }
    return (
        <div className={styles.L_leftList}>
            <h2>Subject</h2>
            <hr />
            {subjectList.slice().map((s)=>(
                <Subject subject={s} key={s.id} />
            ))}

            <button className={styles.L_addButton} onClick={openSubModal}>+</button>
            <AddTimeTable isOpen={isSubModalOpen} closeModal={closeSubModal} onAdd={handleAddItem} palette={palette}/>
        </div>
    );
}