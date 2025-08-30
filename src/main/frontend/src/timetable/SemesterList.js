import styles from './LeftList.module.css';
import Semester from "./Semester.js";
import AddTable from "./AddTable";
import {useState} from "react";
import api from '../api';

export default function SemesterList({semesterList, onUpdated, changeTable, fetchTable}) {
    /* 시간표 추가 버튼 */
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const openTableModal = () => setIsTableModalOpen(true);
    const closeTableModal = () => setIsTableModalOpen(false);

    // 시간표 추가
    const handleAddTable = (newTableName) => {
        console.log("전달받은 테이블 이름:", newTableName, typeof newTableName);

        const fetchAddTimeTable = async () => {
            try {
                const response = await api.post('/timetable', { name: newTableName });
                console.log("서버 응답:", response.data.message);

                await fetchTable();
                alert("semester 저장 완료");
                console.log("semester 저장 완료");
            } catch (e) {
                console.error("fail fetch: ", e);
                alert("semester 저장 실패");
            }
        };
        fetchAddTimeTable();
        closeTableModal();
    }

    return (
        <div className={styles.L_leftList}>
            <h2>Semester</h2>
            <hr />
            {semesterList.slice()
                .sort((a, b) => (a.isMain === true ? -1 : 1))
                .map((s)=>(
                    <Semester semester={s} onUpdated={onUpdated} key={s.id} onClick={()=>changeTable(s)} fetchTable={fetchTable} />
                ))}

            <button className={styles.L_addButton} onClick={openTableModal}>+</button>
            <AddTable isOpen={isTableModalOpen} closeModal={closeTableModal} onAdd={handleAddTable}/>
        </div>
    );
}