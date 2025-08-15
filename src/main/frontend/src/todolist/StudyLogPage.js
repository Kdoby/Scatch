import './StudyLog.css';
import StudyTable from "./StudyTable";
import {useEffect, useRef, useState} from "react";
import StudyList from "./StudyList";
import axios from "axios";

export default function StudyLogPage () {
    const [userId, setUserId] = useState('');
    const [studyList, setStudyList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateInputRef = useRef(null);

    // studyList 받아오기
    const fetchStudyList = async () => {
        try {
            const res = await axios.get(`/api/todo/log/${userId}/${selectedDate.toISOString().slice(0,10)}`);
            setStudyList(res.data);
            console.log("studylist 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }
    useEffect(() => {
        if (!userId || !selectedDate) {
            return;
        }
        fetchStudyList();
    }, [userId, selectedDate]);

    // 날짜 이동 함수
    const handlePrev = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };
    const handleNext = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    // add 후 화면 반영
    const handleAdd = () => {
        fetchStudyList();
    }

    // delete 후 화면 반영
    const handleDelete = (id) => {
        setStudyList(prev => prev.filter(s => s.id !== id));
    }

    // update 후 화면 반영
    const handleUpdate = (updatedlog) => {
        fetchStudyList();
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height:"100vh"}}>
            <div className={"SL_wrapper"}>
                <div className={"SL_Header"}>
                    <h2 style={{flex: 6, paddingLeft: "30px"}}>STUDY LOG</h2>
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)}></input>
                    <button className={"CurrentDate"} onClick={() => setSelectedDate(new Date())}>현재 날짜로 이동</button>
                    <div className={"DateNavigator"} >
                        <button className={"DateNavButton"} onClick={handlePrev}><img className={"DateNavImg"} src={"./left.png"} alt={"leftButton"}/></button>
                        <div>
                            <h2 className={"DateNavLabel"} onClick={() => {
                                if (dateInputRef.current?.showPicker) { // showPicker 지원하는 브라우저인 경우
                                    dateInputRef.current.showPicker();
                                }
                                else {
                                    dateInputRef.current?.click();
                                }
                            }}>{selectedDate.toISOString().slice(0, 10)}</h2>
                            <input ref={dateInputRef} type="date" id="hiddenDateInput" value={selectedDate.toISOString().slice(0, 10)} onChange={(e) => {
                                setSelectedDate(new Date(e.target.value));
                            }} style={{opacity: 0, width: 0, height: 0, pointerEvents: "none"}}/>
                        </div>
                        <button className={"DateNavButton"} onClick={handleNext}><img className={"DateNavImg"} src={"./right.png"} alt={"rightButton"}/></button>
                    </div>
                </div>
                <hr />
                <div className={"SL_Body"}>
                    <StudyList userId={userId} list={studyList} selectedDate={selectedDate} onAdd={handleAdd} onDelete={handleDelete} onUpdate={handleUpdate} />
                    <StudyTable list={studyList}/>
                </div>
            </div>
        </div>
    );
}