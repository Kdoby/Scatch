import './Signup.css';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";


export default function Signup() {
    const navigate = useNavigate();

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [email, setEmail] = useState('');


    const doSignup = async () => {
        if( !checkID() ){ return; }

        console.log(id, pw, pwConfirm, email);
        try {
            const res = await axios.post('/api/auth/signup', {  // '/auth/login' 으로 요청
                username: id,
                password: pw,
                email
            });

            // JWT 토큰 저장
            const { accessToken, refreshToken } = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            alert("회원가입 성공");
            navigate('/login');

        } catch (err) {
            console.error('에러 발생: ', err);
            alert("로그인 실패");
        }
    };

    const checkID = () => {
        if (!id) {
            alert("아이디를 입력하세요.");
            return false;
        }

        if(pw !== pwConfirm){
            alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            return false;
        }

        if (!email) {
            alert("이메일을 입력하세요.");
            return false;
        }

        return true;
    };

    return (
        <div className="login_pg">
            <div className="logbox">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    doSignup();
                }}>
                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="id">ID</label>
                        <br />

                        <input onChange={(e) => setId(e.target.value)}
                               style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}
                        />
                    </div>

                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="pw">PASSWORD</label>
                        <br />

                        <input onChange={(e) => setPw(e.target.value)}
                               style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}
                        />
                    </div>

                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="pwConfirm">PASSWORD CHECK</label>
                        <br />

                        <input onChange={(e) => setPwConfirm(e.target.value)}
                               style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}
                        />
                    </div>

                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="email">E-MAIL</label>
                        <br />

                        <input onChange={(e) => setEmail(e.target.value)}
                               style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}
                        />
                    </div>

                    <div>
                        <input type="submit" value="SIGN UP" />
                    </div>
                </form>
            </div>
        </div>
    );
}

/*
<div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="id">ID</label>
                        <br />

                        <input style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}></input>
                        <button type="button" onClick={checkID}>Duplicate Check</button>
                    </div>

                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="pw">PASSWORD</label>
                        <br />

                        <input style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}></input>
                    </div>

                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="pwConfirm">PASSWORD CHECK</label>
                        <br />

                        <input style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}></input>
                    </div>

                    <div style={{ width:"100%", margin:"50px 0" }}>
                        <label htmlFor="email">E-MAIL</label>
                        <br />

                        <input style={{ height:"40px", width:"100%", border:"2px solid black", borderRadius:"10px", margin:"20px 0"}}></input>
                    </div>

                    <div>
                        <input type="submit" value="SIGN UP" />
                    </div>
*/
