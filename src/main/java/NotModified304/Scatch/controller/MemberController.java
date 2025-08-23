package NotModified304.Scatch.controller;

import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MemberController {

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
}
