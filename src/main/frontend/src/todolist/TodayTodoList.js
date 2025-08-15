import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestTodoList = ({ todayDate, categories, allTodos, setAllTodos }) => {
    const [editingTodoId, setEditingTodoId] = useState(null); // 현재 편집 중인 투두 ID

    // 특정 일자 todo fetch
    const fetchTodos = async () => {
        // console.log("todayDate: " + todayDate);

        if(todayDate) {
            try {
                const response = await api.get('/todo/list/' + todayDate);
                setAllTodos(response.data);
                console.log(allTodos);
            } catch (e) {
                console.error("fail fetch: ", e);
            }
        }

    };

    // 투두 삭제
    const deleteTodo = async (id) => {
        try {
            const response = await api.delete('/todo/' + id);

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

    /*날짜가 바뀔때 마다 바꾸기*/
    useEffect(() => {
        fetchTodos();
    }, []);

    /* 카테고리에 무언가 변경 사항이 있으면 투두를 새로고침함. */
    useEffect(() => {
        fetchTodos();
    }, [categories]);

    /*날짜가 바뀔때 마다 바꾸기*/
    useEffect(() => {
        fetchTodos();
    }, [todayDate]);


    return (
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
                                marginLeft: '20px',
                            }}
                        >
                            {category.todos.map((todo) => (
                                <div key={todo.id}>
                                    <input
                                        type = 'checkbox'
                                        defaultChecked={todo.isDone}
                                        onChange={(e) => {
                                            editTodo(todo.id, null, e.target.checked);
                                        }}
                                        style={{
                                            background: '#999999',
                                        }}
                                    />
                                    {editingTodoId === todo.id ? ( // 특정 투두가 편집 중인지 확인
                                        <input
                                            defaultValue={todo.title}

                                            // 포커스 해제 시 편집 종료
                                            onBlur={() => setEditingTodoId(null)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") { // Enter 키를 눌렀을 때
                                                    editTodo(todo.id, e.target.value, null);
                                                }
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onDoubleClick={() => {
                                            setEditingTodoId(todo.id);
                                        }}>
                                            {todo.title}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        style={{
                                            float: 'right',
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TestTodoList;
