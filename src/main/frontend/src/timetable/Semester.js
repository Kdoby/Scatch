import styles from './LeftList.module.css';
import {useState} from "react";
import axios from "axios";
import UpdateTable from "./UpdateTable";

export default function Semester({semester: s, onClick, fetchTable}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [semester, setSemester] = useState(s);
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    // 테이블 수정
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const openUpdateModal = () => {
        setIsUpdateOpen(true);
        setIsDropdownOpen(false);
    };
    const closeUpdateModal = () => {
        setIsUpdateOpen(false);
    };
    // 테이블 삭제
    const del = async (e) => {
        e.stopPropagation();
        if (!window.confirm('table을 삭제하시겠습니까?')) return;
        try {
            const response = await axios.delete(`http://localhost:8080/timetable/${semester.id}`);
            if(response.data.success) {
                setSemester({id: 0});
                setIsDropdownOpen(false);
                console.log(response.data.message);
            }
            else {
                console.error('삭제 실패:', response.data.message);
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }

    if(semester.id === 0) {
        return null;
    }
    return (
        <div className={styles.L_listItem} onClick={onClick}>
            <div className={styles.L_flag} />
            <div className={styles.L_title}>{semester.name}</div>
            <div className={styles.L_menu} onClick={toggleDropdown}>
                <img style={{height: "15px"}} src={"/menu.png"} alt={"menu"}/>
                {isDropdownOpen && (
                    <div className={styles.L_dropdown}>
                        <div className={styles.L_dropdownItem} onClick={openUpdateModal}>수정</div>
                        <div className={styles.L_dropdownItem} onClick={del}>삭제</div>
                    </div>
                )}
                {isUpdateOpen && (
                    <UpdateTable isOpen={isUpdateOpen} closeModal={closeUpdateModal} selectedTable={semester} onUpdated={(updated) => {
                        setSemester((prev) =>
                            prev.id === updated.id ? {
                                ...prev, name: updated.name, isMain: updated.isMain
                            } : prev
                        );
                        fetchTable();
                    }}/>
                )}
            </div>
        </div>
    );
}