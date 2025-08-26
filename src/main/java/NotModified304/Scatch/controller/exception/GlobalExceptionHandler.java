package NotModified304.Scatch.controller.exception;

import NotModified304.Scatch.security.CookieUtil;
import NotModified304.Scatch.service.auth.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    // refresh token 만료 에러 보냄
    @ExceptionHandler(AuthService.RefreshTokenExpiredException.class)
    public ResponseEntity<Map<String, Object>> handleExpired(HttpServletResponse resp) {
        // refresh token 쿠키 즉시 제거
        resp.addHeader("Set-Cookie", CookieUtil.deleteRefreshCookie().toString());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "code", "REFRESH_TOKEN_EXPIRED",
                        "message", "Refresh token expired"));
    }

    @ExceptionHandler(AuthService.RefreshTokenInvalidException.class)
    public ResponseEntity<Map<String, Object>> handleInvalid(HttpServletResponse resp) {
        resp.addHeader("Set-Cookie", CookieUtil.deleteRefreshCookie().toString());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("code", "REFRESH_TOKEN_INVALID",
                            "message", "Invalid refresh token"));
    }
}