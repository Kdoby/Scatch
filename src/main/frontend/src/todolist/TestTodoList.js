import React, { useState } from 'react';
import axios from 'axios';

const TestTodoList = ({ allTodos, fetchTodos }) => {
    const [editingTodoId, setEditingTodoId] = useState(null); // 현재 편집 중인 투두 ID

    if (!allTodos?.data || !Array.isArray(allTodos.data)) {
        return <div>No todos available</div>;
    }

    // 투두 삭제
    const deleteTodo = async (id) => {
        try {
            const response = await axios.delete('/api/todos/' + id);

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
    const editTodo = async (id, title,checked) => {
        try {
        console.log(title, checked);
            const response = await axios.put(`/api/todos/${id}`, {
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

    return (
        <div>
            {allTodos.data.map((category) => (
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
            ))}
        </div>
    );
};

export default TestTodoList;
