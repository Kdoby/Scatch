// components/ProtectedRoute.js
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    console.log(!token, token);
    if (!token) {
        // 로그인 안 돼 있으면 /login으로 리디렉션
        navigate('/login');
    }

    // 로그인 돼 있으면 자식 컴포넌트 렌더
    return children;
}