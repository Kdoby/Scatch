import styles from './LeftList.module.css';
import {useState} from "react";
import axios from "axios";

export default function Subject({subject: s}) {
    // 드롭다운 메뉴
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [subject, setSubject] = useState(s);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // timetabledetail 수정창
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const toggleUpdate = () => {
        setIsUpdateOpen(!isUpdateOpen);
    };
    /*
    const update = async (e) => {
        e.stopPropagation();

    }
     */
    /*
    // course 삭제
    const del = async (e) => {
        e.stopPropagation();
        if(!window.confirm('subject를 삭제하시겠습니까?')) return;
        try {
            const response = await axios.delete(`/api/timetable/detail/${subject.details.courseId}`);
            if (response.data.success) {
                setSubject({id: 0});
                setIsDropdownOpen(false);
                console.log(response.data.message);
            } else {
                console.error('삭제 실패:', response.data.message);
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }
    if(subject.id === 0) {
        return null;
    }
     */
    return (
        <div className={styles.L_listItem}>
            <div className={styles.L_flag}
                 style={{ backgroundColor: subject.color }}
            />
            <div className={styles.L_title}>{subject.title}</div>
            <div className={styles.L_menu} onClick={toggleDropdown}>
                <img style={{height:"15px"}} src={"/menu.png"} alt={"menu"} />
                {isDropdownOpen && (
                    <div className={styles.L_dropdown}>
                        <div className={styles.L_dropdownItem} onClick={toggleUpdate}>수정</div>
                        <div className={styles.L_dropdownItem} >삭제</div>
                    </div>
                )}
            </div>
        </div>
    );
}