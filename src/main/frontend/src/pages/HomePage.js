import { TokenStore } from "../TokenStore";
import api from '../api';

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage(){
    const navigate = useNavigate();

    const doLogout = async () => {
        try {
            await api.post('/auth/logout'); // axios -> api 로 변경

            alert("로그아웃 성공");
            console.log("로그아웃 성공");
            TokenStore.clearToken(); // clearAccessToken()이 아니라 TokenStore에서 정의한 이름 사용

            navigate('/login');
        } catch (err) {
            console.error('에러 발생:', err);
            console.log('에러 메시지:', err.message);
            console.log('응답 객체:', err.response);
            console.log('요청 객체:', err.request);
            alert("로그아웃 실패");
        }
    };

    return (
        <div>
            <button onClick={doLogout}>로그아웃</button>
        </div>
    );
}
