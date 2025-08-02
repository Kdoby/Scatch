import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Test() {
    const navigate = useNavigate();

    const doLogout = async () => {
        try {
            const res = await axios.post('/api/user/jwt/logout');

            alert(res.data);
            navigate('/login');

        } catch (err) {
            console.error('에러 발생: ', err);
            alert("로그인 실패");
        }
    };

    return(
        <div>
            success!
            <button onClick={() => {doLogout()}}>로그아웃</button>

        </div>
    );
}