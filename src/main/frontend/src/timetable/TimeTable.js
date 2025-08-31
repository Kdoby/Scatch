import styles from "./TimeTable.module.css";
import StarIcon from "./StarIcon";
import UpdateTime from "./UpdateTime";

import { TokenStore } from "../TokenStore";
import api from '../api';

import axios from "axios";
import {useState} from "react";

export default function TimeTable( { curTable, timeItem, updateIsMain, setTimeItem, fetchTable, palette} ) {

    function parseTimeToFloat(timeStr) {
        const [h, m] = timeStr.split(":").map(str => parseInt(str, 10)); // 9:30 형식을 10진수로 h=9, m=30저장
        return h + (m/60); // 9 + 30/60 = 9+0.5 => 시간 단위로 계산
    }

    // timetabledetail 수정창 버튼
    const [updateItem, setUpdateItem] = useState(null);
    const [updateTime, setUpdateTime] = useState(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const openUpdateModal = (item, time) => {
        setUpdateItem(item);
        setUpdateTime(time);
        setIsUpdateOpen(true);
    };
    const closeUpdateModal = () => {
        setIsUpdateOpen(false);
    };

    // timetabledetail 삭제 버튼
    const del = async (e, deletedItem, time) => {
        e.stopPropagation();
        if(!window.confirm('subject를 삭제하시겠습니까?')) return;
        try {
            const response = await api.delete('/timetable/detail/'+ time.id);

            if (response.data.success) {
                setTimeItem(prev =>
                    prev.map(item =>
                        item.courseId === deletedItem.courseId ? {
                            ...item,
                            details: item.details.filter(t => t.id !== time.id)
                        } : item
                    )
                );
                await fetchTable();
                console.log(response.data.message);
            } else {
                console.error('삭제 실패:', response.data.message);
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    }

    return (
        <div className={styles.tableBlock} style={{height:"100%"}}>
            <div className={styles.tableHeader}>
                <h2>{curTable.name}</h2>
                <StarIcon isMain={curTable.isMain} updateIsMain={updateIsMain}></StarIcon>

            </div>
            <div className={styles.timetableGrid}>
                <div className={styles.cell}></div>
                <div className={styles.cell} key={"Mon"}>Mon</div>
                <div className={styles.cell} key={"Tue"}>Tue</div>
                <div className={styles.cell} key={"Wed"}>Wed</div>
                <div className={styles.cell} key={"Thu"}>Thu</div>
                <div className={styles.cell} key={"Fri"}>Fri</div>
                <div className={styles.cell} key={"Sat"}>Sat</div>
                <div className={styles.cell} key={"Sun"}>Sun</div>

                {[...Array(16)].map((_, rowIdx) => (
                    <>
                      <div className={styles.timeCell}>
                        {rowIdx + 9 <= 12
                          ? rowIdx + 9
                          : rowIdx + 9 - 12}
                      </div>
                      {[...Array(7)].map((_, colIdx) => (
                        <div className={styles.cell} key={`cell-${rowIdx}-${colIdx}`}></div>
                      ))}
                    </>
                ))}
                {timeItem?.map((item) =>
                    item.details?.map((time, index) => {
                        const dayIndex = time.weekday;
                        if (dayIndex === undefined || dayIndex < 0 || dayIndex > 6) {
                            console.warn("invalid weekday:", dayIndex);
                            return null;
                        }

                        const startTime = parseTimeToFloat(time.startTime);
                        const endTime = parseTimeToFloat(time.endTime);

                        // 세로 비율 (9시~18시 총 18칸)
                        const CELL_HEIGHT_PERCENT = 100 / 18;
                        const topPercent = (startTime - 9 + 1) * CELL_HEIGHT_PERCENT;  // 요일 표시부분 포함해야해서 -9에서 +1
                        const heightPercent = (endTime - startTime) * CELL_HEIGHT_PERCENT;

                        console.log("startTime: " + startTime + " endTime: " + endTime);
                        console.log("CELL_HEIGHT_PERCENT: " + CELL_HEIGHT_PERCENT + " topPercent: " + topPercent+ " heightPercent: " + heightPercent);
                        return (
                            <div key={`${item.courseId}-${time.id}`}
                                 className={styles.timeBlock}
                                 style={{ top: `calc(${topPercent}%)`,  // 2px는 보정값임.
                                          left: `calc(50px + 100px * ${dayIndex})`,
                                          height: `${heightPercent}%`, width: `100px`,
                                          position: "absolute",
                                          backgroundColor: item.color,
                                          border: "1px solid #999",
                                          padding: "4px",
                                          boxSizing: "border-box",
                                          fontSize: "10px",
                                         display: "flex",
                                         justifyContent: "space-between",
                                         paddingLeft: "15px"
                                 }}
                            >
                                <div className={styles.timeContent}>
                                    {item.title}<br />{item.instructor}<br />{time.location}
                                </div>
                                <div className={styles.L_menu}>
                                    <img
                                        style={{ height: "15px", cursor: "pointer", margin: "5px 0px"}}
                                        src="images/menu.png"
                                        alt="menu"
                                    />

                                    <ul className={styles.setting}>
                                        <li className={styles.L_dropdownItem} onClick={() => openUpdateModal(item, time)}>수정</li>
                                        <li className={styles.L_dropdownItem} onClick={(e) => del(e, item, time)}>삭제</li>
                                     </ul>
                              {isUpdateOpen && updateItem && updateTime && (
                                  <UpdateTime isOpen={isUpdateOpen} closeModal={closeUpdateModal} item={updateItem} time={updateTime} palette={palette} fetchTable={fetchTable}/>
                              )}

                          </div>

                      </div>
                    );
                  })
                )}

            </div>

        </div>
    );
}