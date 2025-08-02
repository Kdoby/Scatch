package NotModified304.Scatch.controller;

import NotModified304.Scatch.domain.Course;
import NotModified304.Scatch.domain.TimeTable;
import NotModified304.Scatch.dto.course.CourseRequestDto;
import NotModified304.Scatch.dto.timeTable.TimeTableRequestDto;
import NotModified304.Scatch.dto.timeTable.TimeTableUpdateDto;
import NotModified304.Scatch.dto.timeTableDetail.TimeTableDetailRequestDto;
import NotModified304.Scatch.dto.timeTableWithCourse.TimeTableWithCourseRequestDto;
import NotModified304.Scatch.dto.timeTableWithCourse.TimeTableWithCourseUpdateDto;
import NotModified304.Scatch.service.CourseService;
import NotModified304.Scatch.service.TimeTableDetailService;
import NotModified304.Scatch.service.TimeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TimeTableApiController {
    private final TimeTableService timeTableService;
    private final CourseService courseService;
    private final TimeTableDetailService timeTableDetailService;

    // 시간표 생성
    @PostMapping("/timetable")
    public ResponseEntity<?> createTimeTable(@RequestBody TimeTableRequestDto request) {
        timeTableService.saveTimeTable(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 생성 성공"
                )
        );
    }

    // 유저의 시간표 목록 조회
    @GetMapping("/timetable/{userId}")
    public ResponseEntity<?> getAllTimeTables(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 조회 성공",
                "data", timeTableService.findTimeTableList(userId)
                )
        );
    }

    // 시간표 수정 : is_main 관리 - is_main 을 수정할 경우, 기존 is_main 을 false 로 바꾼 뒤 업데이트
    @PutMapping("/timetable/{id}")
    public ResponseEntity<?> updateTimeTable(@PathVariable("id") Long id,
                                             @RequestBody TimeTableUpdateDto request) {
        timeTableService.updateTimeTable(id, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 수정 성공"
        ));
    }

    // 시간표 삭제
    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<?> deleteTimeTable(@PathVariable("id") Long id) {
        timeTableService.deleteTimeTable(id);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTable 삭제 성공"
        ));
    }

    @PostMapping("/timetable/course")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequestDto request) {
        Long courseId = courseService.saveCourse(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Course 등록 성공",
                "data", courseId
        ));
    }

    // 세부 시간표 등록
    @PostMapping("/timetable/detail")
    public ResponseEntity<?> createTimeTableDetail(@RequestBody TimeTableDetailRequestDto request) {
        timeTableDetailService.saveTimeTableDetail(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTableDetail 생성 성공"
        ));
    }

    // 세부 시간표 목록 조회
    @GetMapping("/timetable/detail/{id}")
    public ResponseEntity<?> getAllTimeTableDetail(@PathVariable("id") Long id) {
        return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "세부 시간표 목록 조회 성공",
                        "data", timeTableDetailService.findAllTimeTableDetails(id)
                )
        );
    }

    // 세부 시간표 수정 : course 정보 수정 주의 (title, instructor, color)
    // TimeTableDetailUpdateDto, CourseUpdateDto
    @PutMapping("/timetable/detail")
    public ResponseEntity<?> updateTimeTableDetail(@RequestBody TimeTableWithCourseUpdateDto request) {
        timeTableDetailService.updateTimeTableDetail(request.getTableDetailDto());
        courseService.updateCourse(request.getCourseDto());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTableDetail 수정 성공"
        ));
    }

    // 세부 시간표 삭제 : 선 삭제 후, 해당 course_id를 참조하는 튜플이 없는 경우, course 도 삭제
    @DeleteMapping("/timetable/detail/{id}")
    public ResponseEntity<?> deleteTimeTableDetail(@PathVariable("id") Long id) {
        Long courseId = timeTableDetailService.deleteTimeTableDetail(id);
        // 해당 강좌를 참조하는 세부 시간표가 없으면 그 강좌도 함께 삭제
        if(timeTableDetailService.findByCourseId(courseId) == 0) {
            courseService.deleteCourse(courseId);
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "timeTableDetail 삭제 성공"
        ));
    }
}
