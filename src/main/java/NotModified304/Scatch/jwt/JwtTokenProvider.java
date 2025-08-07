package NotModified304.Scatch.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
// JWT Util : 토근 생성 및 검증
public class JwtTokenProvider {
    // secret key
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 15;    // 15분
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 14;     // 2주

    // 로그인 성공 시, 토큰 발급
    public String createToken(String username) {
        // JWT 내부에 사용자 정보 저장
        Claims claims = Jwts.claims().setSubject(username);

        // 발급 시간
        Date now = new Date();
        // 만료 시간
        Date validity = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                // 서명 생성
                .signWith(key)
                // 최종 문자열 토큰 생성
                .compact();
    }

    // JWT 토큰을 파싱해서 사용자 ID를 알아냄
    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // JWT 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            // parseClaimsJws : 서명 + 만료 유효성 검사
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String createRefreshToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + (REFRESH_TOKEN_EXPIRE_TIME));    // 14일

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }
}
