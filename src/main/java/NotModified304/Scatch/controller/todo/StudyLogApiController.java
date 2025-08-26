package NotModified304.Scatch.controller.todo;

import NotModified304.Scatch.dto.todo.request.StudyLogCreateRequest;
import NotModified304.Scatch.dto.todo.response.StudyLogResponse;
import NotModified304.Scatch.dto.todo.request.StudyLogUpdateRequest;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.todo.StudyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class StudyLogApiController {

    private final StudyLogService studyLogService;

    // 공부 기록 등록
    @PostMapping("/todo/log")
    public ResponseEntity<?> createStudyLog(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @RequestBody StudyLogCreateRequest request) {

        studyLogService.registerStudyLog(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "공부 기록 등록 성공"
        ));
    }

    // 공부 기록 수정
   @PutMapping("/todo/log/{id}")
    public ResponseEntity<Map<String, Object>> updateStudyLog(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                              @PathVariable("id") Long id,
                                                              @RequestBody StudyLogUpdateRequest request) {

        studyLogService.updateStudyLog(userDetails.getUsername(), id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "공부 기록 수정 성공"
        ));
    }

    // 공부 기록 삭제
    @DeleteMapping("/todo/log/{id}")
    public ResponseEntity<?> deleteStudyLog(@AuthenticationPrincipal CustomUserDetails userDetails,
                                            @PathVariable("id") Long id) {

        studyLogService.removeStudyLog(userDetails.getUsername(), id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "공부 기록 삭제 성공"
        ));
    }

    // 특정 날짜의 공부 기록 조회
    @GetMapping("/todo/log/{date}")
    public ResponseEntity<List<StudyLogResponse>> getStudyLogList(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @PathVariable("date") LocalDate date) {

        return ResponseEntity.ok(studyLogService.getStudyLogsByDate(userDetails.getUsername(), date));
    }
}
