import "./RoutineList.css";

import {useState, useRef} from "react";
import axios from 'axios';

export default function AddRoutine({userId, onAdd, isOpen, closeModal}) {
     const [routineName, setRoutineName] = useState('');
     const [startDate, setStartDate] = useState('');
     const [endDate, setEndDate] = useState('');
     const nameRef = useRef();
     const startRef = useRef();
     const endRef = useRef();
     const [selectedDays, setSelectedDays] = useState(['1','2','3','4','5','6','7']);
     const days = [
         { label: '월', value: '2'},
         { label: '화', value: '3'},
         { label: '수', value: '4'},
         { label: '목', value: '5'},
         { label: '금', value: '6'},
         { label: '토', value: '7'},
         { label: '일', value: '1'}
     ];

     const handleCheckboxChange = (day) => {
         if(selectedDays.includes(day)) { // 선택 해제
             setSelectedDays(selectedDays.filter(d => d !== day));
         } else { // 선택 추가
             setSelectedDays([...selectedDays, day]);
         }
     };

     const handleSubmit = async (e) => {
         e.preventDefault();
         if(!routineName) {
             alert("루틴 이름을 입력해주세요.");
             nameRef.current.focus();
             return;
         }
         if (!startDate) {
             alert("시작일을 선택해주세요.");
             startRef.current.focus();
             return;
         }
         if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
             alert("종료일은 시작일 이후로 선택해주세요.");
             endRef.current.focus();
             return;
         }
         try {
             const res = await axios.post('/api/routine', {
                 userId: userId,
                 name: routineName,
                 repeatDays: selectedDays,
                 startDate: startDate,
                 endDate: endDate
             });
             if(res.data.success) {
                 alert(res.data.message);
                 const monthlyRoutine = {
                     id: res.data.data,
                     name: routineName ?? "", // null, undefined 방지
                     startDate: startDate,
                     endDate: endDate,
                     isClosed: false,
                     dates: [],
                     monthlyStatistic: 0
                 }
                 const weeklyRoutine = {
                     id: res.data.data,
                     name: routineName ?? "", // null, undefined 방지
                     startDate: startDate,
                     endDate: endDate,
                     isClosed: false,
                     days: [],
                     weeklyStatistic: 0
                 }
                 onAdd(monthlyRoutine, weeklyRoutine);
                 closeModal();
                 setRoutineName('');
                 setStartDate('');
                 setEndDate('');
                 setSelectedDays(['1','2','3','4','5','6','7']);
             }
             else {
                 console.log("루틴 등록 실패");
             }
         } catch (err) {
             if(err.response && err.response.message) {
                 alert('에러 발생: ', err.response.data.message);
             }
             else {
                 alert('루틴 등록 오류 발생');
             }
         }
     };

     return (
         <div style={{display:isOpen?"block": "none",
             position: "fixed",
             top: 0,
             left: 0,
             width: "100vw",
             height: "100vh",
             backgroundColor: "rgba(0,0,0,0.35)"}}>
             <div style={{
                 position: "absolute",
                 top: "50%",
                 left: "50%",
                 transform: "translate(-50%, -50%)",
                 width: "677px",
                 height: "498px",
                 backgroundColor: "white",
                 borderRadius: "20px",
                 border: "solid 1px"
             }}>
                 <div style={{padding: "30px"}}>
                     <img style={{ border: "none",
                         cursor: "pointer",
                         width:"40px",
                         marginLeft: "580px"
                     }} src={"./close.png"} alt={"closeModal"} onClick={closeModal}></img>

                     <form className={"AR_form"}>
                         <div>
                             <input type="text" className={"AR_routineName"} ref={nameRef} placeholder={"루틴 이름"} value={routineName} onChange={(e) => setRoutineName(e.target.value)}></input>
                         </div>
                         <div>
                             <label htmlFor="start-date" className={"AR_inputLabel"}>시작일 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                             <input type="date" ref={startRef} value={startDate} onChange={(e) => setStartDate(e.target.value)} id="start-date" name="start-date" required/>

                         </div>

                         <div>
                             <label htmlFor="end-date" className={"AR_inputLabel"}>종료일 &nbsp;&nbsp;| &nbsp;&nbsp;</label>
                             <input type="date" ref={endRef} value={endDate} onChange={(e) => setEndDate(e.target.value)} id="end-date" name="end-date" required/>
                         </div>
                         <div>
                             <span className={"AR_inputLabel"}>반복 &nbsp;&nbsp;| &nbsp;&nbsp;</span>
                             {days.map(({label, value}) => (
                                 <label key={value}>
                                     <input type="checkbox" checked={selectedDays.includes(value)} onChange={() => handleCheckboxChange(value)} />
                                     {label}
                                 </label>
                             ))}
                         </div>
                         <button className={"AR_submit"} onClick={handleSubmit}>추가</button>
                     </form>

                 </div>

             </div>
         </div>
    );
}