package NotModified304.Scatch.service.member;

import NotModified304.Scatch.domain.member.Member;
import NotModified304.Scatch.repository.interfaces.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member findMember(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자 입니다."));
    }

    public Integer findPaletteNumber(String username) {

        Member member = findMember(username);

        return member.getPaletteNumber();
    }

    public void updatePaletteNumber(String username, Integer number) {

        memberRepository.updatePalette(username, number);
    }
}
