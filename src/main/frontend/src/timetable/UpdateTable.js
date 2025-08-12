import { TokenStore } from "../TokenStore";
import api from '../api';

import {useState} from "react";
import axios from "axios";

export default function UpdateTable ({isOpen, closeModal, selectedTable, onUpdated}) {
    const [table, setTable] = useState(selectedTable);

    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchTable = async () => {
            try {
                const res = await api.put(`/timetable/${table.id}`, {
                    name: table.name,
                    isMain: table.isMain
                });
                if(res.data.success){
                    console.log(res.data.message);
                    onUpdated(table);
                    alert('수정되었습니다.');
                    closeModal();
                } else {
                    console.log("수정 실패:", res.data.message);
                }
            } catch (error) {
                console.error("에러 발생:", error);
            }
        };
        fetchTable();
    }
    return (
        <div style={{ display:isOpen?"block": "none",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.35)",
                      zIndex:"100" }}>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "463px",
                backgroundColor: "white",
                borderRadius: "20px",
                border: "solid 1px"
            }}>
                <div style={{padding: "50px"}}>
                    <div>
                        <h2 style={{display: "inline"}}>테이블수정</h2>
                        <img src="/close.png"
                             onClick={closeModal}
                             style={{ float: "right",
                                      border: "none",
                                      outline: "none",
                                      backgroundColor: "inherit",
                                      cursor: "pointer",
                                      fontSize: "x-large",
                                      marginRight: "0px",
                                      height: "20px"}}
                        />
                    </div>
                    <hr/>
                    <p>table name : </p>
                    <input type="text" value={table.name}
                           onChange={(e) => setTable( {...table, name: e.target.value})}
                           style={{ width: "100%"}} />
                    <br/>
                    <p>Main: </p>
                    <input type={"checkbox"} checked={table.isMain} onChange={(e) => {
                        if(table.isMain) {
                            alert("이미 메인 시간표입니다.");
                            return;
                        }
                        setTable({...table, isMain: e.target.checked});
                    }} />
                    <button onClick={handleSubmit}>submit</button>
                </div>

            </div>
        </div>
    );
}