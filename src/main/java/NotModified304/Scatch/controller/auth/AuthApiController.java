package NotModified304.Scatch.controller.auth;

import NotModified304.Scatch.domain.member.Member;
import NotModified304.Scatch.dto.auth.request.SigninRequest;
import NotModified304.Scatch.dto.auth.request.SignupRequest;
import NotModified304.Scatch.dto.auth.response.TokenResponse;
import NotModified304.Scatch.security.CookieUtil;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthApiController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        authService.join(request);
        return ResponseEntity.ok("회원가입 성공");
    }


    /* @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(authService.signin(request));
    } */

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody SigninRequest request) {
        TokenResponse tokens = authService.signin(request);

        /*// accessToken 설정
        ResponseCookie accessTokenCookie = CookieUtil.createHttpOnlyCookie(
                "accessToken", tokens.getAccessToken(), 60 * 30
        );*/
        // refreshToken 설정
        ResponseCookie refreshTokenCookie = CookieUtil.createRefreshCookie(
                tokens.getRefreshToken(), 60 * 60 * 24 * 14
        );

        return ResponseEntity.ok()
                //.header("Set-Cookie", accessTokenCookie.toString())
                .header("Set-Cookie", refreshTokenCookie.toString())
                .body(Map.of(
                        "success", true,
                        "message", "로그인 성공",
                        // 프론트 메모리에 저장
                            "accessToken", tokens.getAccessToken()
                ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member user = userDetails.getUser();
        return ResponseEntity.ok(user);
    }

    /*
    * @PostMapping("/refresh")
        public ResponseEntity<?> refreshAccessToken(@RequestHeader("Authorization") String authHeader) {
        String refreshToken = authHeader.substring(7); // "Bearer " 제거
        String newAccessToken = authService.refreshAccessToken(refreshToken);

        return ResponseEntity.ok(newAccessToken);
    }
    * */

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@CookieValue("refreshToken") String refreshToken) {

        // 새로운 access token 발급
        String newAccessToken = authService.refreshAccessToken(refreshToken);

       /* ResponseCookie accessTokenCookie= CookieUtil.createHttpOnlyCookie(
                "accessToken", newAccessToken, 60 * 15
        );*/

        return ResponseEntity.ok()
                .body(Map.of(
                        "success", true,
                        "message", "AccessToken 재발급 완료",
                        "accessToken", newAccessToken
                ));
    }


    /* @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(userDetails.getUser());
        return ResponseEntity.ok("로그아웃 되었습니다.");
    } */

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(userDetails.getUser());

        // ResponseCookie deleteAccessTokenCookie = CookieUtil.deleteCookie("accessToken");
        ResponseCookie delRefreshTokenCookie = CookieUtil.deleteRefreshCookie();

        return ResponseEntity.ok()
                //.header("Set-Cookie", deleteAccessTokenCookie.toString())
                .header("Set-Cookie", delRefreshTokenCookie.toString())
                .body(Map.of(
                        "success", true,
                        "message","로그아웃 되었습니다."
                ));
    }

}
