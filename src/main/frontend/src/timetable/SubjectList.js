import styles from './LeftList.module.css';
import Subject from "./Subject.js";

export default function SubjectList({subjectList}) {
    return (
        <div className={styles.L_leftList}>
            <h2>Subject</h2>
            <hr />
            {subjectList.slice().map((s)=>(
                <Subject subject={s} key={s.id}/>
            ))}
        </div>
    );
}