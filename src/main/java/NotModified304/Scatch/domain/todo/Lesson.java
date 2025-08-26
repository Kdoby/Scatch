package NotModified304.Scatch.domain.todo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "lesson")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "content")
    private String content;

    @Column(name = "content_writer")
    private String contentWriter;

    @Column(name = "lesson_date", nullable = false)
    private LocalDate lessonDate;
}
