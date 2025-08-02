package NotModified304.Scatch.controller;

import NotModified304.Scatch.domain.Member;
import NotModified304.Scatch.dto.login.SigninRequest;
import NotModified304.Scatch.dto.login.SignupRequest;
import NotModified304.Scatch.dto.login.TokenResponse;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        userService.join(request);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(userService.signin(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Member user = userDetails.getUser();
        return ResponseEntity.ok(user);
    }
}
