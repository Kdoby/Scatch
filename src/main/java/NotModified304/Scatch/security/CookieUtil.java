package NotModified304.Scatch.security;

import org.springframework.http.ResponseCookie;

public class CookieUtil {
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
