import { TokenStore } from "./TokenStore";

import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true // 기본값: 쿠키 전송 허용
});

// 요청 시 Access Token 붙이기
api.interceptors.request.use(cfg => {
    // 로그인 요청은 쿠키 전송 안 함
    if (cfg.url === "/auth/login") {
        cfg.withCredentials = false;
        return cfg;
    }

    const token = TokenStore.getToken();
    if (token) {
        cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});

// 응답 에러 처리 (토큰 만료 시 자동 갱신)
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      try {
        // Refresh Token으로 Access Token 재발급
        const refreshRes = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.accessToken;
        TokenStore.setToken(newAccessToken);

        // 실패했던 요청에 새 토큰 붙여서 재요청
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (refreshError) {
        console.error("토큰 재발급 실패", refreshError);
        TokenStore.clearToken();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;