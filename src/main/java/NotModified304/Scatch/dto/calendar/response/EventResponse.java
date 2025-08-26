package NotModified304.Scatch.dto.calendar.response;

import NotModified304.Scatch.domain.calendar.Event;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@NoArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String color;
    private String memo;

    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    private String repeat;
    private LocalDateTime repeatEndDateTime;

    public static EventResponse from(Event e) {
        return new EventResponse(
                e.getId(),
                e.getTitle(),
                e.getColor(),
                e.getMemo(),
                LocalDateTime.of(e.getStartDate(), e.getStartTime()),
                LocalDateTime.of(e.getEndDate(), e.getEndTime()),
                e.getRepeat(),
                e.getRepeatEndDate() != null && e.getRepeatEndTime() != null
                        ? LocalDateTime.of(e.getRepeatEndDate(), e.getRepeatEndTime())
                        : null
        );
    }

    public EventResponse(Long id, String title, String color, String memo,
                         LocalDateTime startDateTime, LocalDateTime endDateTime,
                         String repeat, LocalDateTime repeatEndDateTime) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.memo = memo;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.repeat = repeat;
        this.repeatEndDateTime = repeatEndDateTime;
    }
}