import './RoutineList.css';
import UpdateRoutine from "./UpdateRoutine";

import { TokenStore } from "../TokenStore";
import api from '../api';

import {useState} from "react";
import axios from "axios";

export default function Routine({routine, onDelete, onClose, onUpdate}) {
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
    // 루틴 삭제
    const del = async (e) => {
        e.stopPropagation();
        if(!window.confirm(`${routine.name}을 삭제하시겠습니까?`)) return;
        try {
            onDelete(routine.id);
            const response = await api.delete(`/routine/${routine.id}`);
            if(response.data.success) {
                console.log(response.data.message);
            }
            else {
                console.error('삭제 실패: ', response.data.message);
            }
        } catch (err) {
            console.error('에러 발생: ', err);
        }
    }
    // 루틴 종료
    const clo = async (e) => {
        e.stopPropagation();
        if (!window.confirm(`${routine.name} 루틴 진행을 종료하시겠습니까?`)) return;
        try {
            onClose(routine.id);
            const response = await api.put(`/routine/close/${routine.id}`);
            if (response.data.success) {
                console.log(response.data.message);
                alert('루틴을 종료하였습니다.');
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
            <div className={"L_flag"} />
            <div className={"L_title"}>{routine.name}</div>
            {routine.isClosed === false && ( /* 종료된 루틴은 수정 종료 삭제 불가 */
                <div className={"L_menu"} onClick={toggleDropdown}>
                    <img style={{height: "15px"}} src={"./menu.png"} alt={"menu"}/>
                    {isDropdownOpen && (
                        <div className={"L_dropdown"}>
                            <div className={"L_dropdownItem"} onClick={OpenUpdateModal}>수정</div>
                            <div className={"L_dropdownItem"} onClick={clo}> 종료</div>
                            <div className={"L_dropdownItem"} onClick={del}>삭제</div>
                        </div>
                    )}
                    {isUpdateOpen && (
                        <UpdateRoutine routine={routine} isOpen={isUpdateOpen} onClose={CloseUpdateModal} onUpdate={onUpdate}/>
                    )}
                </div>
            )}
        </div>
    );
}