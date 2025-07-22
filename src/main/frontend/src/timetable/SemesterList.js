import styles from './LeftList.module.css';
import Semester from "./Semester.js";

export default function SemesterList({semesterList, changeTable, fetchTable}) {
    return (
        <div className={styles.L_leftList}>
            <h2>Semester</h2>
            <hr />
            {semesterList.slice()
                .sort((a, b) => (a.isMain === true ? -1 : 1))
                .map((s)=>(
                    <Semester semester={s} key={s.id} onClick={()=>changeTable(s)} fetchTable={fetchTable}/>
                ))}
        </div>
    );
}