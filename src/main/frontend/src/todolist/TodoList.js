import TestCategoryList from './TestCategoryList';
import TodayTodoList from './TodayTodoList';
import AddAditTodo from './AddAditTodo';
import Advice from './Advice';
import './TodoList.css';

import React, { useState, useEffect } from "react";
import axios from 'axios';


export default function TodoList({ userName, todayDate, fetchTodayDate, setDate }){
    const [categoryMode, setCategoryMode] = useState(true);  // true: active, inactive
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newColor, setNewColor] = useState('');
    const [allTodos, setAllTodos] = useState([]);

    // 카테고리 추가
    const addCategory = async () => {
        try {
            if (!userName || !newCategory || !newColor) {
                alert("모든 필드를 입력해주세요.");
                return;
            }

            console.log(userName, newCategory, newColor);

            // post /api/categories
            const response = await axios.post('/api/categories', {
                userId: userName,
                name: newCategory,
                color: newColor,
                isActive: true
            });

            if(response.data.success){
                alert(response.data.message);
                fetchCategories(categoryMode);
            }else {
                console.log('error');
            }
        } catch (error) {
            alert("카테고리 생성 중 오류가 발생했습니다.");
            console.log(error);
        }
    };

    const fetchCategories = async (isActive) => {
        console.log(userName);
        try {
            const response = await axios.get('/api/categories/' + userName, {
                params: { is_active: isActive }
            });
            setCategories(response.data);
            console.log(categories);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    const fetchTodos = async () => {
        console.log("userName: " + userName + ", todayDate: " + todayDate);
        try {
            const response = await axios.post('/api/todos/list', {
                userId: userName,
                todoDate: todayDate
            });
            setAllTodos(response.data);
            console.log(allTodos);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    useEffect(() => {
        console.log("이름 변경됨.")
        fetchCategories(categoryMode);
    }, [userName]);

    useEffect(() => {
        fetchCategories(categoryMode);
    }, [categoryMode]);


    return (
    <div style={{
            width: '80%',
            margin: 'auto'
    }}>
        <h1>TodoList</h1>

        <div className="grid-container">
            <div className="one"
                 style={{
                    border: 'solid 1px #999999',
                    borderRadius: '15px',
                    padding: "20px"
            }}>
                <h3 style={{
                        margin:'0px'
                }}>
                {categoryMode ? (<span>Active</span>) : (<span>Inactive</span>)} Category
                </h3>

                <hr style={{marginTop:'28px'}} />

                { categoryMode ? (
                    <div>
                        <TestCategoryList categories={categories} fetchCategories={fetchCategories} categoryMode={categoryMode} />

                        <br />
                        <div>
                            <div style={{
                                    marginBottom: '15px'
                            }}>
                                add category: <input type="text"  onChange={(e) => setNewCategory(e.target.value)}/>
                            </div>
                            <div style={{
                                    marginBottom: '15px'
                            }}>
                                color: <input type="color" defaultValue='#ffffff' onChange={(e) => setNewColor(e.target.value)}></input>
                            </div>

                            <button onClick={addCategory}>add</button>
                        </div>

                        <br />

                        <div>
                            <button onClick={() => setCategoryMode(false)}>inactive cateogry list</button>
                        </div>
                    </div>
                ):(
                    <div>
                        <TestCategoryList categories={categories} fetchCategories={fetchCategories} categoryMode={categoryMode} />

                        <div>
                            <button onClick={() => setCategoryMode(true)}>active cateogry list</button>
                        </div>
                    </div>
                ) }
            </div>

            <div className="two"
                 style={{
                    border: 'solid 1px #999999',
                    borderRadius: '15px',
                    padding: "20px",

                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '20px'
            }}>
                <div>
                    <h3 style={{
                            float: 'left',
                            margin:'0px'
                    }}>
                    Todo List
                    </h3>

                    <div style={{float: 'right'}}>
                        <button onClick={fetchTodayDate}
                                style={{
                                    margin: '0px'
                        }}>
                        Today
                        </button>
                    </div>
                </div>

                <div>
                    <input id="inputDate 1" type="date"
                           defaultValue={todayDate}
                           onChange = {(e) => setDate(e.target.value)}
                           style={{
                                width: '100%',
                                textAlign: 'center'
                           }}
                    />
                </div>

                <div>
                    <hr />
                    <TodayTodoList userName={userName} todayDate={todayDate} categories={categories}
                                   allTodos={allTodos} setAllTodos={setAllTodos}/>
                </div>

                <div style={{
                        border: 'solid 1px #999999',
                        borderRadius: '15px',
                        padding: "20px"
                }}>
                    <h3 style={{
                            margin:'0px'
                    }}>
                    Add / Edit
                    </h3>

                    <br />

                    <AddAditTodo userName={userName} todayDate={todayDate} categories={categories}
                                 categoryMode={categoryMode} fetchTodos={fetchTodos}
                    />
                </div>
            </div>
            <div className="three">
                <Advice userName={userName} todayDate={todayDate}/>
            </div>
        </div>
    </div>
    );
}