package NotModified304.Scatch.service.member;

import NotModified304.Scatch.domain.member.Member;
import NotModified304.Scatch.dto.member.request.ProfileUpdateRequest;
import NotModified304.Scatch.dto.member.response.ProfileResponse;
import NotModified304.Scatch.repository.interfaces.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
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

    // 사용자 정보 조회 (in myPage)
    public ProfileResponse findMemberProfile(String username) {
        Member member = findMember(username);
        String profileImagePath = null;

        if(member.getStoredFileName() != null) {
            // 실제 저장 경로
            profileImagePath = "http://localhost:8080/uploads/" + member.getStoredFileName();
        }

        return ProfileResponse.builder()
                .paletteNumber(member.getPaletteNumber())
                .nickname(member.getNickname())
                .intro(member.getIntro())
                .profileImagePath(profileImagePath)
                .build();
    }

    // 사용자 정보 업데이트 (in myPage)
    public void updateMemberProfile(String username, ProfileUpdateRequest req) {

        // 닉네임 중복 체크 (본인 제외)
        boolean duplication = memberRepository.existsByNicknameAndUsernameNot(req.getNickname(), username);
        if(duplication) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        memberRepository.updateMemberInfo(username, req.getPaletteNumber(), req.getNickname(), req.getIntro());
    }

    // 프로필 사진 업데이트
    public Long updateProfileImage(String username, MultipartFile file) {

        if(file.isEmpty()) {
            throw new IllegalArgumentException("업로드된 파일이 없습니다.");
        }

        Member member = findMember(username);
        
        String oldFileName = member.getStoredFileName();
        
        // 기존 프로필 이미지가 존재할 경우, 삭제 (기본 이미지는 제외)
        if(oldFileName != null && !oldFileName.equals("basic.png")) {
            // 기존 프로필 이미지가 저장된 경로에서 이미지 파일을 가져옴
            File oldFile = new File(UPLOAD_DIR + oldFileName);
            if(oldFile.exists()) {
                oldFile.delete();
            }
        }

        // 새 파일 생성
        String originalFileName = file.getOriginalFilename();
        String storedFileName = UUID.randomUUID() + "_" + originalFileName;
        // 파일 저장 경로
        String fullPath = UPLOAD_DIR + storedFileName;

        try {
            File dest = new File(fullPath);
            dest.getParentFile().mkdirs();
            // 업로드된 파일을 서버의 원하는 경로에 저장
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }

        member.setOriginalFileName(originalFileName);
        member.setStoredFileName(storedFileName);

        return member.getId();
    }

    // 회원 탈퇴
    public void remove(Long id) {

        memberRepository.deleteById(id);
    }
}
