package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.lesson.LessonCreateRequest;
import NotModified304.Scatch.dto.lesson.LessonResponse;
import NotModified304.Scatch.dto.lesson.LessonUpdateRequest;
import NotModified304.Scatch.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LessonApiController {
    private final LessonService lessonService;

    // lesson 등록
    @PostMapping("/todo/lesson")
    public ResponseEntity<?> createLesson(@RequestBody LessonCreateRequest request) {
        Long result = lessonService.registerLesson(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "lesson 등록 성공",
                "lessonId", result
        ));
    }

    // lesson 수정
    @PutMapping("/todo/lesson/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable("id") Long id,
                                          @RequestBody LessonUpdateRequest request) {
        lessonService.updateLesson(id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "lesson 수정 성공"
        ));
    }

    // lesson 삭제
    @DeleteMapping("/todo/lesson/{id}")
    public ResponseEntity<?> deleteLesson(@PathVariable("id") Long id) {
        lessonService.removeLesson(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "lesson 삭제 성공"
        ));
    }

    // lesson 조회
    // http://localhost:8080/todo/lesson/dodam/2025-07-31
    @GetMapping("/todo/lesson/{userId}/{date}")
    public ResponseEntity<LessonResponse> getLesson(@PathVariable("userId") String userId,
                                                    @PathVariable("date") LocalDate date) {
        return ResponseEntity.ok(lessonService.getLessonByDate(userId, date));
    }
}
