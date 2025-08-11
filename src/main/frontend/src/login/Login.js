import { TokenStore as TokenStore } from '../TokenStore';

import './Login.css';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Login() {
    const [id, setId] = useState('');  // 로그인 창에 작성한 id
    const [pw, setPw] = useState('');  // 로그인 창에 작성한 pw
    const navigate = useNavigate();

    const doLogin = async () => {
        if (!id || !pw) {
            alert("ID와 PASSWORD를 모두 입력하세요.");
            return;
        }

        try {
            const res = await axios.post('/api/auth/login', {
                username: id,
                password: pw
            });
            console.log(res.data);
            TokenStore.setToken(res.data.accessToken);

            alert("로그인 성공");
            console.log("로그인 성공");
            navigate('/');

        } catch (err) {
            console.error('에러 발생: ', err);
            alert("로그인 실패");
        }
    };



    return (
        <div className="login_pg">
            <div className="logbox">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    doLogin();
                }}>
                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <div style={{textAlign: "left", fontSize: "50px", fontWeight: "bold"}}>Hello!</div>
                        <br />

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
                        <input type="submit"
                               value="LOG-IN"
                        />
                        <div style={{ margin:"15px"}}>
                            <Link to="/signup">SIGN-UP</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
