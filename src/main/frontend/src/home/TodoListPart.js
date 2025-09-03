import TodayTodoList from '../todolist/TodayTodoList';

import api from '../api';

import React, { useState, useEffect } from "react";
import StudyTable from "../studylog/StudyTable";

export default function TodoListPart( { todayDate } ){
    const [categories, setCategories] = useState([]);
    const [allTodos, setAllTodos] = useState([]);
    const [studyTime, setStudyTime] = useState('');

    const fetchCategories = async (isActive) => {
        try {
            const response = await api.get('/category/list', {
                params: { is_active: isActive }
            });
            setCategories(response.data);
            console.log(categories);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    const fetchTodos = async () => {
        if(!todayDate) return;
        try {
            const response = await api.get('/todo/list/' + todayDate);
            console.log(response.data);
            setAllTodos(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    // 투두 수정
    const editTodo = async (id, title, checked) => {
        try {
            console.log(title, checked);
            const response = await api.put('/todo/' + id, {
                title,
                isDone: checked
            });

            if (response.data.success) {
                alert(response.data.message);
                fetchTodos();
            } else {
                alert("response error");
            }
        } catch (error) {
            alert(error);
        }
    };

    const calStudyTime = async (data) => {
        // response가 없거나 data가 배열이 아니면 초기값 반환
        if (!data) return { hours: 0, minutes: 0, seconds: 0 };


        let totalSeconds = 0;

        console.log(data);
        data.forEach(category => {
            if (Array.isArray(category.todos)) {
                category.todos.forEach(todo => {
                    totalSeconds += (todo.totalHours || 0) * 3600
                                  + (todo.totalMinutes || 0) * 60
                                  + (todo.totalSeconds || 0);
                });
            }
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        console.log(hours, minutes, seconds );
        setStudyTime(hours + ":" + minutes + ":" + seconds);
    }

    useEffect(() => {
        fetchCategories(true);
        fetchTodos();
    }, [todayDate]);

    useEffect(() => {
        if(!allTodos){ return; }

        calStudyTime(allTodos.data);
    }, [allTodos]);

    useEffect(() => {
        fetchCategories(true);
        fetchTodos();
        fetchStudyList();
    }, []);

    // studylog 불러오기
    // 특정 날짜의 공부 기록 조회
    const [studyList, setStudyList] = useState([]);
    const fetchStudyList = async () => {
        if(!todayDate) return;

        try {
            const res = await api.get('/todo/log/' + (todayDate));

            setStudyList(res.data);
            console.log("studylist 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }
    useEffect(() => {
        if (!todayDate) return;

        fetchStudyList();
    }, [todayDate]);

    return (
        <>
            <div style={{ padding: "15px 20px", fontSize: "20px", fontWeight: "bold" }}>
                Todo List

                <span style={{ float:"right" }}>
                    {studyTime}
                </span>
            </div>
            <div style={{display: "flex", height: "75%"}}>
                <div style={{ height:"100%", flex: 7}}>
                    <div style={{ width: "100%", height: "100%", overflowX: "hidden", overflowY: "scroll" }}>
                        <div>
                            {!allTodos?.data || !Array.isArray(allTodos.data) ? (
                                <div>No todos available</div>
                            ) : (
                                allTodos.data.map((category) => (
                                    <div
                                        key={category.categoryId}
                                        style={{
                                            margin: '20px 0px',
                                            fontSize: '20px',
                                            textAlign: 'left'
                                        }}
                                    >
                                    <span
                                        className="categoryColor"
                                        style={{
                                            backgroundColor: category.categoryColor,
                                            display: 'inline-block',
                                            width: '5px',
                                            height: '30px',
                                            marginRight: '10px',
                                            verticalAlign: 'middle',
                                        }}
                                    ></span>
                                        <span>
                                        <b>{category.categoryName}</b>
                                    </span>

                                    <div
                                        style={{
                                            margin: '5px 0px 10px 30px',
                                        }}
                                    >
                                        {category.todos.map((todo) => (
                                            <div key={todo.id}
                                                 style={{marginBottom: "8px"}}
                                            >
                                                <input
                                                    id="todoCheck"
                                                    type = 'checkbox'
                                                    defaultChecked={todo.isDone}
                                                    onChange={(e) => {
                                                        editTodo(todo.id, null, e.target.checked);
                                                    }}
                                                    style={{
                                                        background: '#999999',
                                                    }}
                                                />
                                                <label htmlFor="todoCheck"></label>

                                                    <span style={{marginLeft: "7px"}}
                                                    >
                                                    {todo.title}
                                                </span>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div style={{overflow: "hidden"}}>
                    <StudyTable list={studyList}/>
                </div>
            </div>

        </>
    );
}