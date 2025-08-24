import UpdateStudyLog from "./UpdateStudyLog";

import { TokenStore } from "../TokenStore";
import api from '../api';

import axios from "axios";
import {useState} from "react";

export default function StudyLog ({ selectedDate, log, onDelete, onUpdate }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    // 수정 창 열기/닫기
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const OpenUpdateModal = () => {
        setIsUpdateOpen(true);
        setIsDropdownOpen(false);
    }
    const CloseUpdateModal = () => {
        setIsUpdateOpen(false);
    }
    // 공부 기록 삭제
    const del = async (e) => {
        e.stopPropagation();
        console.log(log.id);
        if(!window.confirm(`${log.todoTitle}을 삭제하시겠습니까?`)) return;
        try {
            const response = await api.delete('/todo/log/' + log.id);
            if(response.data.success) {
                console.log(response.data.message);
                onDelete(log.id);
            }
            else {
                console.error('삭제 실패: ', response.data.message);
            }
        } catch (err) {
            console.error('에러 발생: ', err);
        }
    }

    return (
        <div className={"L_listItem"}>
            <div className={"L_flag"} style={{backgroundColor: `${log.categoryColor}`}}/>
            <div className={"L_title"}>[{log.categoryName}] - {log.todoTitle}</div>
            <span style={{marginRight: "20px"}}>{log.startTime.slice(11,16)} ~ {log.endTime.slice(11,16)}</span>
            <div className={"L_menu"} onClick={toggleDropdown}>
                <img style={{height: "15px"}} src={"images/menu.png"} alt={"menu"}/>
                {isDropdownOpen && (
                    <div className={"L_dropdown"}>
                        <div className={"L_dropdownItem"} onClick={OpenUpdateModal}>수정</div>
                        <div className={"L_dropdownItem"} onClick={del}>삭제</div>
                    </div>
                )}
                {isUpdateOpen && (
                    <UpdateStudyLog selectedDate={selectedDate} log={log} isOpen={isUpdateOpen} onClose={CloseUpdateModal} onUpdate={onUpdate}/>
                )}
            </div>
        </div>
    );
}