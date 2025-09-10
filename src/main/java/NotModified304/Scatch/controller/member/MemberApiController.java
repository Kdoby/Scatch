package NotModified304.Scatch.controller.member;

import NotModified304.Scatch.dto.member.request.ProfileUpdateRequest;
import NotModified304.Scatch.dto.member.response.ProfileResponse;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.member.MemberDeleteService;
import NotModified304.Scatch.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MemberApiController {

    private final MemberService memberService;

    @GetMapping("/member/palette")
    public ResponseEntity<Map<String, Object>> getPaletteColor(@AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "팔레트 색상 조회 성공",
                "data", memberService.findPaletteNumber(userDetails.getUsername())
        ));
    }

    @PutMapping("/member/palette")
    public ResponseEntity<String> updatePaletteColor(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestParam("number") Integer paletteNumber) {

        memberService.updatePaletteNumber(userDetails.getUsername(), paletteNumber);

        return ResponseEntity.ok("팔레트 색상 변경 완료");
    }

    // 유저 정보(프로필) 조회
    @GetMapping("/member/profile")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return ResponseEntity.ok( memberService.findMemberProfile(userDetails.getUsername()));
    }

    @PutMapping("/member/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                           @RequestBody ProfileUpdateRequest request) {

        memberService.updateMemberProfile(userDetails.getUsername(), request);

        return ResponseEntity.ok("사용자 프로필 수정 완료");
    }

    @PostMapping("/member/profile/upload")
    public ResponseEntity<String> updateProfileImage(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                     @RequestParam("file") MultipartFile file) {

        memberService.updateProfileImage(userDetails.getUsername(), file);

        return ResponseEntity.ok("프로필 사진 변경 완료");
    }

    @PutMapping("/member/profile/reset")
    public ResponseEntity<String> resetProfileImage(@AuthenticationPrincipal CustomUserDetails userDetails) {

        memberService.resetProfileImage(userDetails.getUsername());

        return ResponseEntity.ok("기본 프로필 사진으로 변경 완료");
    }
}
