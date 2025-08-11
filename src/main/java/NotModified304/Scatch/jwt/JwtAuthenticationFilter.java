package NotModified304.Scatch.jwt;

import NotModified304.Scatch.repository.interfaces.MemberRepository;
import NotModified304.Scatch.security.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// 한 요청당 한 번만 실행되는 필터
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    @Override
    // 필터의 핵심 로직
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        // String token = resolveToken(request);

        // 요청에서 JWT 추출
        String token = resolveToken(request);

        // JWT 유효성 검사
        /* 1. 토큰이 존재하는지
        *  2. 서명이 위조되지 않았는지
        *  3. 만료되지 않았는지 */
        if(token != null) {

            // 토큰 만료 상태 확인
            JwtTokenProvider.TokenStatus status = jwtTokenProvider.validateToken(token);

            if (status == JwtTokenProvider.TokenStatus.VALID) {

                // JWT 안에 저장된 사용자 식별자(subject)를 꺼냄
                String username = jwtTokenProvider.getUsername(token);

                // 유저 조회 및 인증 객체 생성
                memberRepository.findByUsername(username).ifPresent(user -> {
                    CustomUserDetails userDetails = new CustomUserDetails(user);

                    // Spring Security 가 인식할 수 있도록 UsernamePasswordAuthentication 을 만들어 등록
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });

                // 이 필터가 인증을 다 마친 후, 다음 필터(또는 컨트롤러)로 요청을 넘겨줌
                filterChain.doFilter(request, response);
                return;
            }

            // 액세스 토큰 만료
            if(status == JwtTokenProvider.TokenStatus.EXPIRED) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":\"ACCESS_TOKEN_EXPIRED\",\"message\":\"Access token expired\"}");
                return;
            }

            // INVALID -> jwtEntryPoint 가 처리 또는 여기서 직접 내림
        }

        filterChain.doFilter(request, response);
    }

    // cookie 에서 accessToken 꺼내기
    private String resolveTokenFromCookie(HttpServletRequest request) {
        if(request.getCookies() == null) return null;
        for(Cookie cookie : request.getCookies()) {
            if("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        
        return null;
    }

    private String resolveToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
