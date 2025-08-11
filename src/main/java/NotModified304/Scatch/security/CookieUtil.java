package NotModified304.Scatch.security;

import lombok.NoArgsConstructor;
import org.springframework.http.ResponseCookie;

@NoArgsConstructor
public class CookieUtil {

    // 배포 환경에 맞게 수정
    private static final String DEFAULT_PATH = "/";
    private static final String DEFAULT_SAMESITE = "Strict";
    private static final boolean DEFAULT_SECURE = true;

    private static ResponseCookie.ResponseCookieBuilder base(String name, String value) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(DEFAULT_SECURE)
                .sameSite(DEFAULT_SAMESITE)
                .path(DEFAULT_PATH);
        return b;
    }

    public static ResponseCookie createRefreshCookie(String value, long maxAgeSeconds) {
        return base("refreshToken", value)
                .maxAge(maxAgeSeconds)
                .build();
    }

    public static ResponseCookie deleteRefreshCookie() {
        return base("refreshToken", "")
                .maxAge(0)
                .build();
    }

    public static ResponseCookie createHttpOnlyCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }

    public static ResponseCookie deleteCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)  // 브라우저에서 즉시 삭제
                .build();
    }
}
