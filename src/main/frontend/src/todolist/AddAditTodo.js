import TestCategoryListSelectBox from './TestCategoryListSelectBox';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddAditTodo({ userName, todayDate, categories, categoryMode, fetchTodos, all }){
    const [newTodoDate, setNewTodoDate] = useState(todayDate);  // 투두 만들때 필요한 날짜
    const [categoryIdToMakeNewTodo, setCategoryIdToMakeNewTodo] = useState('');
    const [newTodo, setNewTodo] = useState('');

    const addTodo = async () => {
        if(!newTodoDate || !categoryIdToMakeNewTodo || !newTodo){
            alert("Error: 모든 필드를 선택하세요");
        }
        else{
             try {
                const response = await axios.post('/api/todos', {
                    userId: userName,
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
            <div style={{
                    marginBottom: '15px'
            }}>
                Date : <input id="inputDate 2" type="date"
                           defaultValue={newTodoDate}
                           onChange = {(e) => setNewTodoDate(e.target.value)}
                           style={{
                                width: '100%',
                                textAlign: 'center'
                           }}
                        />
            </div>
            <div style={{
                    marginBottom: '15px'
            }}>
                Category : <TestCategoryListSelectBox
                                    categories={categories}
                                    onChange = {(e) => setCategoryIdToMakeNewTodo(e.target.value)}
                           />
            </div>
            <div style={{
                    marginBottom: '15px'
            }}>
                Todo : <input type="text" onChange = {(e) => setNewTodo(e.target.value)}/>
            </div>

            <br />

            <div>
                <button disabled={!categoryMode} onClick={addTodo}>add</button>
            </div>
        </div>
    );
}