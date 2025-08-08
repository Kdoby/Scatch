package NotModified304.Scatch.dto.timeTable.tt;

import NotModified304.Scatch.domain.TimeTable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TimeTableResponseDto {
    private Long id;
    private String userId;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isMain;

    // Entity to DTO
    public TimeTableResponseDto(TimeTable tt) {
        this.id = tt.getId();
        this.userId = tt.getUserId();
        this.name = tt.getName();
        this.createdAt = tt.getCreatedAt();
        this.updatedAt = tt.getUpdatedAt();
        this.isMain = tt.getIsMain();
    }
}
