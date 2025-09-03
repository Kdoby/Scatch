import { TokenStore } from "./TokenStore";

import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true // 기본값: 쿠키 전송 허용
});

// 새로고침 시 refresh 실행
(async () => {
  try {
    const refreshRes = await axios.post("/api/auth/refresh", {}, { withCredentials: true });

    const newAccessToken = refreshRes.data.accessToken;
    TokenStore.setToken(newAccessToken);

    console.log("🔄 새로고침 시 토큰 갱신 성공");
  } catch (e) {
    console.warn("🔄 새로고침 시 토큰 갱신 실패", e);
    TokenStore.clearToken();
  }
})();

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

let isRefreshing = false; // refresh 한 번만 되게

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 refresh 요청 중이면 그대로 reject해서 무한 반복 방지
        return Promise.reject(error);
      }

      originalRequest._retry = true; // 재시도 표시
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.accessToken;
        TokenStore.setToken(newAccessToken);

        // 실패했던 요청에 새 토큰 붙이기
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        return api(originalRequest); // 재요청
      } catch (refreshError) {
        console.error("토큰 재발급 실패", refreshError);
        TokenStore.clearToken();
        window.location.href = "/login";
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;