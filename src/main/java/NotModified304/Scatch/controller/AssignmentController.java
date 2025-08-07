package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.assignment.request.AssignmentCreateRequest;
import NotModified304.Scatch.dto.assignment.request.AssignmentUpdateRequest;
import NotModified304.Scatch.dto.assignment.response.AssignmentResponse;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assignment")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<?> createAssignment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @RequestBody AssignmentCreateRequest req) {
        Long id = assignmentService.registerAssignment(req, userDetails.getUsername());
        return ResponseEntity.ok(id);
    }

    @PutMapping
    public ResponseEntity<?> updateAssignment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @RequestBody AssignmentUpdateRequest req) {
        Long id = assignmentService.updateAssignment(userDetails.getUsername(), req);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@AuthenticationPrincipal CustomUserDetails userDetails,
                                              @PathVariable("id") Long id) {
        assignmentService.removeAssignment(userDetails.getUsername(), id);
        return ResponseEntity.ok("과제 삭제 성공");
    }

    // 특정 강좌에 속한 과제 목록 조회
    @GetMapping("/{courseId}")
    public ResponseEntity<List<AssignmentResponse>> getAssignments(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                   @PathVariable("courseId") Long courseId) {
        List<AssignmentResponse> responses = assignmentService.findAssignmentsByCourseId(userDetails.getUsername(), courseId);
        return ResponseEntity.ok(responses);
    }

    // 특정 날짜의 과제 조회
    @GetMapping("/{date}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByDate(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                         @PathVariable("date") LocalDate date) {
        List<AssignmentResponse> responses
                = assignmentService.findAssignmentsByDate(userDetails.getUsername(), date);
        return ResponseEntity.ok(responses);
    }

    // 특정 년/월 의 과제 조회
    @GetMapping("/{year}/{month}")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByMonth(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                          @PathVariable("year") Long year,
                                                                          @PathVariable("month") Long month) {
        List<AssignmentResponse> responses
                = assignmentService.findAssignmentsByYearAndMonth(userDetails.getUsername(), year, month);
        return  ResponseEntity.ok(responses);
    }
}