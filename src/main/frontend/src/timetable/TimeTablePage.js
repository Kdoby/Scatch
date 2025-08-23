import TimeTable from "./TimeTable";
import SemesterList from "./SemesterList";
import SubjectList from "./SubjectList";

import { TokenStore } from "../TokenStore";
import api from '../api';

import {useEffect, useState} from "react";
import axios from "axios";

export default function TimeTablePage() {
    const [selectedTable, setSelectedTable] = useState({id: "", name: "", isMain: ""});  // semester 목록
    const [tableList, setTableList] = useState([]);
    const [timeItem, setTimeItem] = useState([]);
    const [palette, setPalette] = useState(1);


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

    // 팔레트 조회
    const fetchPalette = async () => {
        try {
            const res = await api.get('/member/palette');

            alert(res.data.message + res.data.data);
            setPalette(res.data.data);
            console.log("fetchPalette 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    useEffect(() => {
        fetchPalette();
    }, []);

    return (
        <div style={{display:"flex", height:"100%"}}>
            <SemesterList semesterList={tableList} changeTable={changeTable} fetchTable={fetchTimeTable}/>
            <SubjectList subjectList={timeItem} selectedTable={selectedTable} fetchTable={fetchTimeItem} palette={palette}/>

            <TimeTable curTable={selectedTable} timeItem={timeItem} updateIsMain={updateIsMain} setTimeItem={setTimeItem}
                       fetchTable={fetchTimeItem} palette={palette}/>

        </div>
    );
}