package NotModified304.Scatch.dto.timeTable.response;

import NotModified304.Scatch.domain.timeTable.TimeTable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TimeTableResponse {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isMain;

    // Entity to DTO
    public TimeTableResponse(TimeTable tt) {
        this.id = tt.getId();
        this.name = tt.getName();
        this.createdAt = tt.getCreatedAt();
        this.updatedAt = tt.getUpdatedAt();
        this.isMain = tt.getIsMain();
    }
}
