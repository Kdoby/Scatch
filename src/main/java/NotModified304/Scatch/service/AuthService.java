package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Member;
import NotModified304.Scatch.dto.login.SigninRequest;
import NotModified304.Scatch.dto.login.SignupRequest;
import NotModified304.Scatch.dto.login.TokenResponse;
import NotModified304.Scatch.jwt.JwtTokenProvider;
import NotModified304.Scatch.repository.interfaces.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public Member join(SignupRequest req) {
        validateDuplicationUser(req);
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        Member user = Member.builder()
                .username(req.getUsername())
                .password(encodedPassword)
                .email(req.getEmail())
                .build();

        memberRepository.save(user);

        return user;
    }

    // 로그인
    public TokenResponse signin(SigninRequest req) {
        Optional<Member> userOpt = memberRepository.findByUsername(req.getUsername());
        if(userOpt.isEmpty() || !passwordEncoder.matches(req.getPassword(), userOpt.get().getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 틀렸습니다.");
        }

        String username = userOpt.get().getUsername();

        // access token 발급
        String accessToken = jwtTokenProvider.createToken(username);
        // refresh token 발급
        String refreshToken = jwtTokenProvider.createRefreshToken(username);
        String hashedRefreshToken = hashWithSHA256(refreshToken);

        // refresh token DB에 저장
        userOpt.get().setRefreshToken(hashedRefreshToken);
        userOpt.get().setRefreshTokenExpiry(LocalDateTime.now().plusDays(14));
        memberRepository.save(userOpt.get());

        return new TokenResponse(accessToken, refreshToken);
    }

    public String refreshAccessToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            String hashedToken = hashWithSHA256(refreshToken);
            // 만료되었거나 위조된 경우 db에서 삭제
            memberRepository.findByRefreshToken(hashedToken)
                    .ifPresent(user -> {
                        user.setRefreshToken(null);
                        user.setRefreshTokenExpiry(null);
                        memberRepository.save(user);
                    });
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        String username = jwtTokenProvider.getUsername(refreshToken);

        // (선택) DB에서 사용자 확인 - 이 과정을 통해 탈퇴 유저의 토큰도 막을 수 있음
        Member user = memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if(!hashWithSHA256(refreshToken).equals(user.getRefreshToken())) {
            throw new IllegalArgumentException("저장된 토큰과 일치하지 않습니다.");
        }

        return jwtTokenProvider.createToken(username);
    }

    private void validateDuplicationUser(SignupRequest req) {
        memberRepository.findByUsername(req.getUsername())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("이미 존재하는 ID 입니다.");
                });
    }

    // refresh token 해싱
    public String hashWithSHA256(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not supported");
        }
    }

    public void logout(Member user) {
        user.setRefreshToken(null);
        user.setRefreshTokenExpiry(null);
        memberRepository.save(user);
    }
}
