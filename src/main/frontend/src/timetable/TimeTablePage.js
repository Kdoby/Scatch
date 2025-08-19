import AddTable from "./AddTable";
import TimeTable from "./TimeTable";
import SemesterList from "./SemesterList";
import SubjectList from "./SubjectList";
import AddTimeTable from "./AddTimeTable";

import { TokenStore } from "../TokenStore";
import api from '../api';

import {useEffect, useState} from "react";
import axios from "axios";

export default function TimeTablePage() {
    const [selectedTable, setSelectedTable] = useState({id: "", name: "", isMain: ""});  // semester 목록
    const [tableList, setTableList] = useState([]);
    const [timeItem, setTimeItem] = useState([]);


    // 시간표 선택
    const changeTable = (table) => {
        console.log("table 클릭됨: ", table);
        setSelectedTable({id: table.id, name: table.name, isMain: table.isMain});
    }


    // 테이블 리스트 조회
    const fetchTimeTable = async () => {
        try {
            const response = await api.get('/timetable');
            const tables = response.data.data;
            setTableList(tables);
            console.log("테이블 리스트 조회: ", tables);

            // is_main이 true인 테이블을 기본 selectedTable로 설정
            const mainTable = tables.find(t => t.isMain === true);
            if (mainTable) {
                setSelectedTable(mainTable);
            }

        } catch (e) {
            console.error("fail fetch: ", e);

            if (e.response) {
                console.log("Status:", e.response.status);
                console.log("Data:", e.response.data);
            }
        }
    };

    // 세부 시간표 리스트 조회
    const fetchTimeItem = async () => {
        try {
            const timeItemRes = await api.get('/timetable/detail/' + selectedTable.id);
            setTimeItem(timeItemRes.data.data);
            console.log(timeItemRes.data.message);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };


    useEffect(() => {
        fetchTimeTable();
    }, [])

    useEffect(() => {
        if(!selectedTable) return;
        fetchTimeItem();
    }, [selectedTable])

//    useEffect(()=> {
//        if(!selectedTable) return;
//        console.log("선택된 테이블: ", selectedTable);
//
//        fetchTimeItem();
//    }, [selectedTable]);

    /* 시간표 추가 버튼 */
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const openTableModal = () => setIsTableModalOpen(true);
    const closeTableModal = () => setIsTableModalOpen(false);

    /* 시간표 subject 추가 버튼 */

    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const openSubModal = () => setIsSubModalOpen(true);
    const closeSubModal = () => setIsSubModalOpen(false);

    // 시간표 추가
    const handleAddTable = (newTableName) => {
        console.log("전달받은 테이블 이름:", newTableName, typeof newTableName);

        const fetchAddTimeTable = async () => {
            try {
                const response = await api.post('/timetable', { name: newTableName });
                console.log("서버 응답:", response.data.message);

                alert("semester 저장 완료");
                console.log("semester 저장 완료");
            } catch (e) {
                console.error("fail fetch: ", e);
                alert("semester 저장 실패");
            }
        };

        fetchAddTimeTable();
    }

    // 시간표 수정(isMain 변경)
    const updateIsMain = (newIsMain) => {
        console.log("기존 isMain: ", selectedTable.isMain, " -> 새 isMain값: ", newIsMain);
        const fetchUpdateIsMain = async () => {
            try {
                const updateRes = await api.put('/timetable/' + selectedTable.id, {
                    name: selectedTable.name,
                    isMain: newIsMain
                });

                console.log("시간표 isMain 수정: ", updateRes.data.message);
                setSelectedTable((prev) => ({...prev, isMain: newIsMain}));
                fetchTimeTable();
            } catch (e) {
                console.error("fail fetch: ", e);
            }
        }
        fetchUpdateIsMain();
        alert("설정 완료");
    };
    // 세부 시간표 등록
    const handleAddItem = (newItem) => {
        const fetchTimeTableDetail = async () => {
            try {
                const courseRes = await api.post('/timetable/course', {
                    title: newItem.subject,
                    instructor: newItem.instructor,
                    color: newItem.color
                });

                const course_id = courseRes.data.data;

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
                alert("시간표 저장 완료");
            } catch (e) {
                console.error("fail fetch: ", e);
                alert("시간표 저장 실패");
            }
        };
        fetchTimeTableDetail();
        setIsSubModalOpen(false);
        alert(`${newItem.subject}가 등록되었습니다.`);
    }

    return (
        <div style={{display:"flex", height:"100%"}}>
            <div>
            <button onClick={openTableModal}>+</button> // semester 추가버튼
            </div>
            <SemesterList semesterList={tableList} changeTable={changeTable} fetchTable={fetchTimeTable}/>
            <AddTable isOpen={isTableModalOpen} closeModal={closeTableModal} onAdd={handleAddTable}/>

            <SubjectList subjectList={timeItem}/>
            <div>
            <button onClick={openSubModal}>+</button> // subject 추가버튼
            </div>
            <TimeTable curTable={selectedTable} timeItem={timeItem} updateIsMain={updateIsMain} setTimeItem={setTimeItem}/>
            <AddTimeTable isOpen={isSubModalOpen} closeModal={closeSubModal} onAdd={handleAddItem}/>
        </div>
    );
}