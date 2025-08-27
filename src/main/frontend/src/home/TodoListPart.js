import TodayTodoList from '../todolist/TodayTodoList';

import api from '../api';

import React, { useState, useEffect } from "react";

export default function TodoListPart( { todayDate } ){
    const [categories, setCategories] = useState([]);
    const [allTodos, setAllTodos] = useState([]);

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
        console.log("todayDate: " + todayDate);
        if(!todayDate) return;
        try {
            const response = await api.get('/todo/list/' + todayDate);
            setAllTodos(response.data);
            console.log(allTodos);
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

    useEffect(() => {
        fetchTodos();
    }, [todayDate]);

    useEffect(() => {
        fetchCategories(true);
    }, []);

    return (
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
                                            type = 'checkbox'
                                            defaultChecked={todo.isDone}
                                            onChange={(e) => {
                                                editTodo(todo.id, null, e.target.checked);
                                            }}
                                            style={{
                                                background: '#999999',
                                            }}
                                        />

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
    );
}