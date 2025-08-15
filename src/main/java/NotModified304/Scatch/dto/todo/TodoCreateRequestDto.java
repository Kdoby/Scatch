package NotModified304.Scatch.dto.todo;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoCreateRequestDto {
    private Long categoryId;
    private String title;
    private LocalDate todoDate;
}
