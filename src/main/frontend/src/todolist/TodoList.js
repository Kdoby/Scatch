import CategoryList from './CategoryList';
import TodayTodoList from './TodayTodoList';
import AddAditTodo from './AddAditTodo';
import Advice from './Advice';
import Palette from '../component/Palette';

import './TodoList.css';

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useState, useEffect } from "react";


export default function TodoList({ todayDate, fetchTodayDate, setDate }){
    const [categoryMode, setCategoryMode] = useState(true);  // true: active, inactive
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newColor, setNewColor] = useState('');
    const [allTodos, setAllTodos] = useState([]);
    const [palette, setPalette] = useState(1);

    // 팔레트 조회
    const fetchPalette = async () => {
        try {
            const res = await api.get('/member/palette');

            //alert(res.data.message + res.data.data);
            setPalette(res.data.data);
            console.log("fetchPalette 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    // 카테고리 추가
    const addCategory = async () => {
        try {
            if (!newCategory || !newColor) {
                alert("모든 필드를 입력해주세요.");
                return;
            }

            console.log(newCategory, newColor);

            // post /api/categories
            const response = await api.post('/category', {
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
        console.log("token: " + TokenStore.getToken());
        if(!todayDate) return;
        try {
            const response = await api.get('/todo/list/' + todayDate);
            setAllTodos(response.data);
            console.log(allTodos);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    useEffect(() => {
        fetchCategories(categoryMode);
    }, [categoryMode]);

    useEffect(() => {
        console.log(categoryMode);
        fetchTodos();
        fetchPalette();
    }, [todayDate]);


    return (
    <div style={{ margin: 'auto' }}>
        <div className="grid-container">
            <div className="one"
                 style={{
                    border: 'solid 1px #999999',
                    borderRadius: '15px',
                    padding: "20px"
                 }}
            >
                <h3 style={{
                        margin:'0px'
                }}>
                {categoryMode ? (<span>Active</span>) : (<span>Inactive</span>)} Category
                </h3>

                <hr style={{ marginTop: '28px' }} />

                { categoryMode ? (
                    <div>
                        <CategoryList categories={categories} fetchCategories={fetchCategories} categoryMode={categoryMode} palette={palette} />

                        <br />
                        <div>
                            <div style={{
                                    marginBottom: '15px'
                            }}>
                                add category: <input type="text"
                                                     onChange={(e) => setNewCategory(e.target.value)}
                                                     style={{ width: "100%"}}/>
                            </div>
                            <div style={{
                                    marginBottom: '15px'
                            }}>
                                color: <input type="color" defaultValue='#ffffff' onChange={(e) => setNewColor(e.target.value)} />
                                <Palette palletN={palette}/>
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
                        <CategoryList categories={categories} fetchCategories={fetchCategories} categoryMode={categoryMode} />

                        <div>
                            <button onClick={() => setCategoryMode(true)}>active cateogry list</button>
                        </div>
                    </div>
                ) }
            </div>

            <div className="two"
                 style={{
                    width: "100%",
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
                                style={{ width:"100%", margin: '0px'}}>
                        Today
                        </button>
                    </div>
                </div>

                <div>
                    <input id="inputDate 1" type="date"
                           defaultValue={todayDate}
                           onChange = {(e) => setDate(e.target.value)}
                           style={{
                                textAlign: 'center'
                           }}
                    />
                </div>

                <div>
                    <hr />
                    <TodayTodoList todayDate={todayDate} categories={categories}
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

                    <AddAditTodo todayDate={todayDate} categories={categories}
                                 categoryMode={categoryMode} fetchTodos={fetchTodos}
                    />
                </div>
            </div>
            <div className="three">
                <Advice todayDate={todayDate}/>
            </div>
        </div>
    </div>
    );
}