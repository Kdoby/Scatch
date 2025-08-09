import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function HomePage(){
    const navigate = useNavigate();

    const doLogout = async () => {
        try {
            const res = await axios.post('/api/auth/logout', { withCredentials: true });

            alert("로그아웃 성공");
            navigate('/login');

        } catch (err) {
            console.error('에러 발생: ', err);
            alert("로그인 실패");
        }
    };

    return (
        <div>
            <button onClick={() => {doLogout()}}>로그아웃</button>
        </div>
    );
}