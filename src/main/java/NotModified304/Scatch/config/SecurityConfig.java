package NotModified304.Scatch.config;

import NotModified304.Scatch.jwt.JwtAuthenticationFilter;
import NotModified304.Scatch.jwt.JwtTokenProvider;
import NotModified304.Scatch.repository.interfaces.MemberRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtEntryPoint())
                        .accessDeniedHandler(jwtAccessDeniedHandler())
                )
                // auth 로 시작하는 모든 요청 허용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        // 그 외 모든 요청은 인증 처리
                        .anyRequest().authenticated()
                )
                // 요청을 가로채는 JWT 필터 -> JwtAuthenticationFilter 가 모든 요청을 검사함
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, memberRepository), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // 인증 없이 보호 리소스 접근 시, 무조건 401 Unauthorized
    @Bean
    AuthenticationEntryPoint jwtEntryPoint() {
        return ((request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":\"UNAUTHORIZED\",\"message\":\"Authentication required\"}");
        });
    }

    // 인증은 됐지만, 권한이 부족 -> 403 Forbidden
    @Bean
    AccessDeniedHandler jwtAccessDeniedHandler() {
        return ((request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":\"FORBIDDEN\",\"message\":\"Access denied\"}");
        });
    }
}
