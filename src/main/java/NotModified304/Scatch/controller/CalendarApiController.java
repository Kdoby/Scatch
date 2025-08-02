package NotModified304.Scatch.controller;

import NotModified304.Scatch.dto.event.EventCreateRequest;
import NotModified304.Scatch.dto.event.EventResponse;
import NotModified304.Scatch.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CalendarApiController {

    private final EventService eventService;

    // 일정 등록 (@RequestBody 누락)
    @PostMapping("/calendar")
    public ResponseEntity<?> createEvent(@RequestBody EventCreateRequest request) {
        eventService.registerEvent(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "일정 등록 성공"
            )
        );
    }
    
    // 특정 년, 월에 해당하는 모든 일정 조회
    // http://localhost:8080/calendar/user123?year=2025&month=07
    @GetMapping("/calendar/{userId}")
    public List<EventResponse> getEventsByYearAndMonth(@PathVariable("userId") String userId,
                                                          @RequestParam("year") Long year,
                                                          @RequestParam("month") Long month) {
        return eventService.findByYearAndMonth(userId, year, month);
    }

    // 특정 날짜의 일정 조회
    // localhost:8080/calendar/event/user123?date=2025-07-20
    @GetMapping("/calendar/event/{userId}")
    public List<EventResponse> getOneEvent(@PathVariable("userId") String userId,
                                              @RequestParam("date") LocalDate date) {
        return eventService.findByDate(userId, date);
    }
    
    // 일정 업데이트
    @PutMapping("/calendar/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable("id") Long id,
                                         @RequestBody Map<String, Object> updates) {
        eventService.updateEventById(id, updates);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "일정 업데이트 성공."
        ));
    }

    // 일정 삭제
    @DeleteMapping("/calendar/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable("id") Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "일정 삭제 성공"
        ));
    }
}
