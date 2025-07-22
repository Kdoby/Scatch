import {useState} from "react";

export default function AddTimeTable ({isOpen, closeModal, onAdd}) {
    const [tableName, setTableName] = useState("");

    const handleSubmit = (event) => {
        if(!tableName) return;

        event.preventDefault();

        onAdd(tableName);
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
                        <h2 style={{display: "inline"}}>테이블추가</h2>
                        <button onClick={closeModal} style={{ border: "none",
                                                              outline: "none",
                                                              backgroundColor: "inherit",
                                                              cursor: "pointer",
                                                              fontSize: "x-large",
                                                              marginRight: "0px"}}>X</button>
                    </div>
                     <hr/>
                     <p>table name : </p>
                     <input type="text" value={tableName}
                            onChange={(e) => setTableName(e.target.value)}></input>
                     <br/>
                     <button onClick={handleSubmit}>submit</button>
                </div>

            </div>
        </div>
    );
}