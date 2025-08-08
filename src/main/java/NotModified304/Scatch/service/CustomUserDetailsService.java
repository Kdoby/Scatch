package NotModified304.Scatch.service;


import NotModified304.Scatch.domain.Member;
import NotModified304.Scatch.repository.interfaces.MemberRepository;
import NotModified304.Scatch.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member user = memberRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        // 해당하는 User의 데이터가 존재하면 UserDetails 객체로 만들어서 return
        return new CustomUserDetails(user);
    }
}
