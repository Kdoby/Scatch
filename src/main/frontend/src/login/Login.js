import './Login.css';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Login() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

const doLogin = async () => {
    if (!id || !pw) {
        alert("ID와 PASSWORD를 모두 입력하세요.");
        return;
    }

    console.log(id, pw);
    try {
        const res = await axios.post('/api/auth/login', {  // '/auth/login' 으로 요청
            username: id,
            password: pw
        });

        // JWT 토큰 저장
        const { accessToken, refreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        alert("로그인 성공");
        navigate('/');

    } catch (err) {
        console.error('에러 발생: ', err);
        alert("로그인 실패");
    }
};



    return (

        <div>
            <div className="login_pg">
                <div className="logbox">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        doLogin();
                    }}>
                        <div style={{ width:"100%", margin:"50px 0" }}>
                            <label htmlFor="id">ID</label>
                            <br />

                            <input style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}
                                   type="text"
                                   id="id"
                                   name="id"
                                   value={id}
                                   onChange={(e) => setId(e.target.value)}
                            ></input>
                        </div>

                        <div style={{ width:"100%", margin:"50px 0" }}>
                            <label htmlFor="pw">PASSWORD</label>
                            <br />

                            <input style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}
                                   type="password"
                                   id="pw"
                                   name="pw"
                                   value={pw}
                                   onChange={(e) => setPw(e.target.value)}
                            ></input>
                        </div>

                        <div>
                            <input type="submit" value="LOG-IN" />
                            <div style={{ margin:"10px"}}>
                                <a href="/signup"><Link to="/signup">SIGN-UP</Link></a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
