package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.lesson.LessonCreateRequest;
import NotModified304.Scatch.dto.lesson.LessonResponse;
import NotModified304.Scatch.dto.lesson.LessonUpdateRequest;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LessonApiController {

    private final LessonService lessonService;

    // lesson 등록
    @PostMapping("/todo/lesson")
    public ResponseEntity<?> createLesson(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @RequestBody LessonCreateRequest request) {

        Long result = lessonService.registerLesson(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "lesson 등록 성공",
                "lessonId", result
        ));
    }

    // lesson 수정
    @PutMapping("/todo/lesson/{id}")
    public ResponseEntity<?> updateLesson(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @PathVariable("id") Long id,
                                          @RequestBody LessonUpdateRequest request) {

        lessonService.updateLesson(userDetails.getUsername(), id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "lesson 수정 성공"
        ));
    }

    // lesson 삭제
    @DeleteMapping("/todo/lesson/{id}")
    public ResponseEntity<?> deleteLesson(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @PathVariable("id") Long id) {

        lessonService.removeLesson(userDetails.getUsername(), id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "lesson 삭제 성공"
        ));
    }

    // lesson 조회
    // http://localhost:8080/todo/lesson/dodam/2025-07-31
    @GetMapping("/todo/lesson/{date}")
    public ResponseEntity<LessonResponse> getLesson(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @PathVariable("date") LocalDate date) {

        return ResponseEntity.ok(lessonService.getLessonByDate(userDetails.getUsername(), date));
    }
}
