import {useState} from "react";

export default function AddTimeTable ({isOpen, closeModal, onAdd}) {
    const [form, setForm] = useState({subject: "", instructor: "", times: [], color: ""});
    const [timeInput, setTimeInput] = useState({day: "", startTime: "", endTime: "", loca:""});

    const addTimeToForm = () => {
        if(!timeInput.day || !timeInput.startTime || !timeInput.endTime) return;

        setForm({
            ...form,
            times: [...form.times, timeInput]
        });

        setTimeInput({day: '', startTime: '', endTime: '', loca: ''});
    }
    const handleSubmit = (event) => {
        if(!form.subject) return;

        const newItem = {
            subject: form.subject,
            instructor: form.instructor,
            times: form.times,
            color: form.color
        }

        onAdd(newItem);
        setForm({subject: "", instructor: "", times: [], color: ""});
        setTimeInput({day: "", startTime: "", endTime: "", loca:""});
    }
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
                width: "463px",
                height: "478px",
                backgroundColor: "white",
                borderRadius: "20px",
                border: "solid 1px"
            }}>
                <div style={{padding: "50px"}}>
                    <div>
                        <h2 style={{display: "inline"}}>과목추가</h2>
                        <button onClick={closeModal} style={{ border: "none",
                                                              outline: "none",
                                                              backgroundColor: "inherit",
                                                              cursor: "pointer",
                                                              fontSize: "x-large",
                                                              marginRight: "0px"}}>X</button>
                    </div>
                     <hr/>
                     <p>subject : </p>
                     <input type="text" value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value})}></input>
                     <p>teacher : </p>
                     <input type="text" value={form.instructor}
                            onChange={(e) => setForm({ ...form, instructor: e.target.value})}></input>
                     <br /><br />
                    color :&nbsp;&nbsp;&nbsp;
                     <input type="color" value={timeInput.color} onChange={(e) => setForm({...form, color: e.target.value})} />
                    <br/>
                    <div>
                        <ul style={{listStyle: "none", padding:0}}>
                            {form.times.map((time, index) => (
                                <li key={index} style={{backgroundColor: "lightgray"}}>
                                    {time.day} {time.startTime} ~ {time.endTime} {time.loca}
                                </li>
                            ))}
                        </ul>
                     </div>
                     <div style={{border:"solid black 1px",
                                  padding: "10px",
                                  borderRadius: "10px"}}>
                            <select value={timeInput.day} onChange={(e) => setTimeInput({...timeInput, day: e.target.value})}>
                                    <option value="" selected disabled hidden>요일</option>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                            </select>
                            <input type="time" value={timeInput.startTime}
                                 onChange={(e) => setTimeInput({...timeInput, startTime: e.target.value})} />
                            ~
                            <input type="time" value={timeInput.endTime}
                                   onChange={(e) => setTimeInput({...timeInput, endTime: e.target.value})} />
                            <input type="text" value={timeInput.loca}
                                   onChange={(e) => setTimeInput({...timeInput, loca: e.target.value})} placeholder="장소/메모"/>

                         <button onClick={addTimeToForm}>ADD</button>
                     </div>

                     <br/>
                     <button onClick={handleSubmit}>submit</button>
                </div>

            </div>
        </div>
    );
}