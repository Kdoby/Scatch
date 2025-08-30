import TestCategoryListSelectBox from './TestCategoryListSelectBox';

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddAditTodo({ todayDate, categories, categoryMode, fetchTodos, all }){
    const [newTodoDate, setNewTodoDate] = useState(todayDate);  // 투두 만들때 필요한 날짜
    const [categoryIdToMakeNewTodo, setCategoryIdToMakeNewTodo] = useState('');
    const [newTodo, setNewTodo] = useState('');

    // 새로운 todo 등록
    const addTodo = async () => {
        if(!newTodoDate || !categoryIdToMakeNewTodo || !newTodo){
            alert("Error: 모든 필드를 선택하세요");
        }
        else{
             try {
                const response = await api.post('/todo', {
                    categoryId: Number(categoryIdToMakeNewTodo),
                    title: newTodo,
                    todoDate: newTodoDate
                });


                if(response.data.success){
                    alert(response.data.message);
                    fetchTodos();
                }else {
                    alert("response error");
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        setNewTodoDate(todayDate);
        document.getElementById("inputDate 2").value = todayDate;

        console.log(todayDate + " " + newTodoDate);
    }, []);

    useEffect(() => {
        setNewTodoDate(todayDate);
        document.getElementById("inputDate 2").value = todayDate;
    }, [todayDate]);

    return (
        <div>
            <div style={{ display:"grid", gridTemplateColumns:'1fr 3fr', gridTemplateRows:'35px', gap:'15px',
                          textAlign:"left", alignItems:"center"}}>
                <div>
                    Date
                </div>
                <div>
                    <input id="inputDate 2" type="date"
                           defaultValue={newTodoDate}
                           onChange = {(e) => setNewTodoDate(e.target.value)}
                           style={{
                                textAlign: 'center', padding:"5px"
                           }}
                    />
                </div>
                <div>
                    Category
                </div>
                <div>
                    <TestCategoryListSelectBox
                        categories={categories}
                        onChange = {(e) => setCategoryIdToMakeNewTodo(e.target.value)}
                    />
                </div>
                <div>
                    Todo
                </div>
                <div>
                    <input type="text"
                           style={{ width:"100%", margin: "0", padding: "5px", height:"30px" }}
                           onChange = {(e) => setNewTodo(e.target.value)}/>
                </div>
            </div>
            <br /><br /><br /><br />

            <div>
                <button disabled={!categoryMode} onClick={addTodo}>add / edit</button>
            </div>
        </div>
    );
}