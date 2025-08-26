package NotModified304.Scatch.controller.timeTable;

import NotModified304.Scatch.dto.timeTable.request.CourseRequest;
import NotModified304.Scatch.dto.timeTable.request.TimeTableRequest;
import NotModified304.Scatch.dto.timeTable.request.TimeTableUpdate;
import NotModified304.Scatch.dto.timeTable.request.TimeTableDetailRequest;
import NotModified304.Scatch.dto.timeTable.request.TimeTableWithCourseUpdate;
import NotModified304.Scatch.security.CustomUserDetails;
import NotModified304.Scatch.service.timeTable.CourseService;
import NotModified304.Scatch.service.timeTable.TimeTableDetailService;
import NotModified304.Scatch.service.timeTable.TimeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TimeTableApiController {
    private final TimeTableService timeTableService;
    private final CourseService courseService;
    private final TimeTableDetailService timeTableDetailService;

    // 시간표 생성
    @PostMapping("/timetable")
    public ResponseEntity<?> createTimeTable(@AuthenticationPrincipal CustomUserDetails userDetails,
                                             @RequestBody TimeTableRequest request) {

        timeTableService.saveTimeTable(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 생성 성공"
                )
        );
    }

    // 유저의 시간표 목록 조회
    @GetMapping("/timetable")
    public ResponseEntity<?> getAllTimeTables(@AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 조회 성공",
                "data", timeTableService.findTimeTableList(userDetails.getUsername())
                )
        );
    }

    // 시간표 수정 : is_main 관리 - is_main 을 수정할 경우, 기존 is_main 을 false 로 바꾼 뒤 업데이트
    @PutMapping("/timetable/{id}")
    public ResponseEntity<?> updateTimeTable(@AuthenticationPrincipal CustomUserDetails userDetails,
                                             @PathVariable("id") Long id,
                                             @RequestBody TimeTableUpdate request) {

        timeTableService.updateTimeTable(userDetails.getUsername(), id, request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 수정 성공"
        ));
    }

    // 시간표 삭제
    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<?> deleteTimeTable(@AuthenticationPrincipal CustomUserDetails userDetails,
                                             @PathVariable("id") Long id) {

        timeTableService.deleteTimeTable(userDetails.getUsername(), id);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 삭제 성공"
        ));
    }

    // 강좌 등록
    @PostMapping("/timetable/course")
    public ResponseEntity<?> createCourse(@AuthenticationPrincipal CustomUserDetails userDetails,
                                          @RequestBody CourseRequest request) {

        Long courseId = courseService.saveCourse(userDetails.getUsername(), request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Course 등록 성공",
                "data", courseId
        ));
    }

    // 세부 시간표 등록
    @PostMapping("/timetable/detail")
    public ResponseEntity<?> createTimeTableDetail(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @RequestBody TimeTableDetailRequest request) {
        timeTableDetailService.saveTimeTableDetail(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTableDetail 생성 성공"
        ));
    }

    // 세부 시간표 수정 : course 정보 수정 주의 (title, instructor, color)
    // TimeTableDetailUpdateDto, CourseUpdateDto
    @PutMapping("/timetable/detail")
    public ResponseEntity<?> updateTimeTableDetail(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @RequestBody TimeTableWithCourseUpdate request) {

        timeTableDetailService.updateTimeTableDetail(userDetails.getUsername(), request.getTableDetailDto());
        courseService.updateCourse(userDetails.getUsername(), request.getCourseDto());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTableDetail 수정 성공"
        ));
    }

    // 세부 시간표 삭제 : 선 삭제 후, 해당 course_id를 참조하는 튜플이 없는 경우, course 도 삭제
    @DeleteMapping("/timetable/detail/{id}")
    public ResponseEntity<?> deleteTimeTableDetail(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @PathVariable("id") Long id) {
        timeTableDetailService.deleteTimeTableDetail(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTableDetail 삭제 성공"
        ));
    }

    // 세부 시간표 목록 조회
    @GetMapping("/timetable/detail/{id}")
    public ResponseEntity<?> getAllTimeTableDetail(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                   @PathVariable("id") Long timeTableId) {
        return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "세부 시간표 목록 조회 성공",
                        "data", timeTableDetailService.findAllTimeTableDetails(userDetails.getUsername(), timeTableId)
                )
        );
    }

    @GetMapping("/timetable/detail/course")
    public ResponseEntity<Map<String, Object>> getCourseInMain(@AuthenticationPrincipal CustomUserDetails userDetails) {

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "메인 시간표 강좌 목록 조회 성공",
                "data", timeTableDetailService.findCoursesByTimeTableId(userDetails.getUsername())
        ));
    }
}
