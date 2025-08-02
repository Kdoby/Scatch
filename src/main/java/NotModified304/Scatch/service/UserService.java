package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Member;
import NotModified304.Scatch.dto.login.SigninRequest;
import NotModified304.Scatch.dto.login.SignupRequest;
import NotModified304.Scatch.dto.login.TokenResponse;
import NotModified304.Scatch.jwt.JwtTokenProvider;
import NotModified304.Scatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
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

        userRepository.save(user);

        return user;
    }

    private void validateDuplicationUser(SignupRequest req) {
        userRepository.findByUsername(req.getUsername())
                .ifPresent(u -> {
                    throw new IllegalArgumentException("이미 존재하는 ID 입니다.");
                });
    }

    public TokenResponse signin(SigninRequest req) {
        Optional<Member> userOpt = userRepository.findByUsername(req.getUsername());
        if(userOpt.isEmpty() || !passwordEncoder.matches(req.getPassword(), userOpt.get().getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 틀렸습니다.");
        }

        String token = jwtTokenProvider.createToken(userOpt.get().getUsername());
        return new TokenResponse(token);
    }
}
