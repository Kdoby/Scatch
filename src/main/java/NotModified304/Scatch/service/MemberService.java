package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Member;
import NotModified304.Scatch.repository.interfaces.MemberRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public void updatePaletteNumber(String username, Integer number) {

        memberRepository.updatePalette(username, number);
    }
}
