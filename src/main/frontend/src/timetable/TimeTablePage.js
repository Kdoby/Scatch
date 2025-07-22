import AddTable from "./AddTable";
import TimeTable from "./TimeTable";
import SemesterList from "./SemesterList";
import SubjectList from "./SubjectList";
import AddTimeTable from "./AddTimeTable";
import {useEffect, useState} from "react";
import axios from "axios";

export default function TimeTablePage() {
    const [userName, setUserName] = useState("");
    const [selectedTable, setSelectiveTable] = useState({id: "", name: "", isMain: ""});
    // 시간표 선택
    const changeTable = (table) => {
        console.log("table 클릭됨: ", table);
        setSelectiveTable({id: table.id, name: table.name, isMain: table.isMain});
    }
    const [tableList, setTableList] = useState([]);
    const [timeItem, setTimeItem] = useState([]);

    // 테이블 리스트 조회
    const fetchTimeTable = async () => {
        try {
            const response = await axios.get('http://localhost:8080/timetable/' + userName);
            setTableList(response.data.data);
            console.log(response.data.message);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };
    useEffect(() => {
        if(!userName) return;
        console.log("userName:", userName);
            fetchTimeTable();
            console.log("semester: ", tableList);
    }, [userName]);

    useEffect(()=> {
        if(!userName || !selectedTable) return;
        console.log("userName:", userName, "선택된 테이블: ", selectedTable);
        // 세부 시간표 리스트 조회
        const fetchTimeItem = async () => {
            try {
                const timeItemRes = await axios.get('http://localhost:8080/timetable/detail/' + selectedTable.id);
                setTimeItem(timeItemRes.data.data);
                console.log(timeItemRes.data.message);
            } catch (e) {
                console.error("fail fetch: ", e);
            }
        };
        fetchTimeItem();
        console.log("timeitem: ", timeItem);
    }, [selectedTable]);

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
        console.log("유저이름", userName);
        const AddTimeTable = async () => {
            try {
                const response = await axios.post('http://localhost:8080/timetable', {
                    userId: userName,
                    name: newTableName
                });
                console.log("서버 응답:", response.data.message);
                if(response.data.success) {
                    alert("semester 저장 완료");
                }
            } catch (e) {
                console.error("fail fetch: ", e);
                alert("semester 저장 실패");
            }
        };
        AddTimeTable();
    }

    // 시간표 수정(isMain 변경)
    const updateIsMain = (newIsMain) => {
        if (!userName) return; // userName이 없으면 요청 막기

        console.log("기존 isMain: ", selectedTable.isMain, " -> 새 isMain값: ", newIsMain);
        const fetchUpdateIsMain = async () => {
            try {
                const updateRes = await axios.put('http://localhost:8080/timetable/' + selectedTable.id, {
                    name: selectedTable.name,
                    isMain: newIsMain
                });
                console.log("시간표 isMain 수정: ", updateRes.data.message);
                setSelectiveTable((prev) => ({...prev, isMain: newIsMain}));
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
                    const courseRes = await axios.post('http://localhost:8080/timetable/course', {
                        userId: userName,
                        title: newItem.subject,
                        instructor: newItem.instructor,
                        color: newItem.color
                    });

                    const course_id = courseRes.data.data;

                    for(const time of newItem.times){
                        const dayIndex = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(time.day);
                        const response = await axios.post('http://localhost:8080/timetable/detail', {
                            userId: userName,
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
        <div style={{display:"flex"}}>
            <input type="text"  onChange={(e) => {
                setUserName(e.target.value);
            }} />
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