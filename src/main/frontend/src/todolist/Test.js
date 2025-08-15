import TestCategoryList from './TestCategoryList';
import TestTodoList from './TestTodoList';
import TestCategoryListSelectBox from './TestCategoryListSelectBox';
import TimeAttackMain from './TimeAttackMain';

import React, {useState, useEffect} from 'react';
import axios from 'axios';


export default function Test(){
    const [newCategory, setNewCategory] = useState('');
    const [userName, setUserName] = useState('');
    const [categories, setCategories] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [categoryIdToMakeNewTodo, setCategoryIdToMakeNewTodo] = useState('');
    const [allTodos, setAllTodos] = useState([]);
    const [todayDate, setDate] = useState('');  // 투두 전체적인 것에 대한 날짜
    const [newTodoDate, setNewTodoDate] = useState('');  // 투우 만들때 필요한 날짜
    const [newColor, setNewColor] = useState('');
    const [categoryMode, setCategoryMode] = useState(true);  // true: active, inactive

    const fetchTodayDate = async () => {
        const today = new Date();
        const formatted = today
            .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/\. /g, '-')
            .replace('.', '');

        document.getElementById("inputDate 1").value = formatted;
        setNewTodoDate(formatted);
        setDate(formatted);
    }

    const fetchCategories = async (isActive) => {
        try {
            const response = await axios.get('/api/categories/' + userName, {
                params: { is_active: isActive }
            });
            setCategories(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    const fetchTodos = async () => {
            try {
                const response = await axios.post('/api/todos/list', {
                    userId: userName,
                    todoDate: todayDate
                });
                setAllTodos(response.data);
            } catch (e) {
                console.error("fail fetch: ", e);
            }
        };

    /* 카테고리에 무언가 변경 사항이 있으면 투두를 새로고침함. */
    useEffect(() => {
        fetchTodos();
    }, [categories]);

    /*유저 이름 바뀔때 마다 바꾸기*/
    useEffect(() => {
        if (userName && categoryMode) {
            fetchCategories(categoryMode);
            fetchTodos();
        }
    }, [userName]);

    /*날짜가 바뀔때 마다 바꾸기*/
    useEffect(() => {
        if (userName) {
            fetchTodos();
        }
    }, [todayDate]);

    /*처음 화면 켰을때, 카테고리, 투두, 오늘 날짜 fetch*/
    useEffect(() => {
        fetchTodayDate();
    }, []);

    useEffect(() => {
        if(userName){
            fetchCategories(categoryMode);
        }
    }, [categoryMode]);


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

    const addTodo = async () => {
        try {
            // console.log(userName, categoryIdToMakeNewTodo, newTodo, newTodoDate);

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
    };

    return(
    <div style={{
            width: '80%',
            margin: 'auto'
    }}>

        <button>up</button>
        <h1>TodoList</h1>

        <div>
            UserName : <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </div>

        <div style={{
                display:"grid",
                gridTemplateColumns:"1fr 3fr",
                gap:"20px",
                marginTop: '30px'
        }}>

            <div style={{
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

            <div style={{
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

                    <div style={{
                            float: 'right'
                    }}>
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
                    <TestTodoList allTodos={allTodos} fetchTodos={fetchTodos} />
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

                    <div>
                        <div style={{
                                marginBottom: '15px'
                        }}>
                            Date : <input id="inputDate 2" type="date"
                                       defaultValue={todayDate}
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
                </div>
            </div>
        </div>
    </div>
    );
}