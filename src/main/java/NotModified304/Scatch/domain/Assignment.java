package NotModified304.Scatch.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "assignment")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "course_title")
    private String courseTitle;

    @Column(name = "color")
    private String color;

    @Column(name = "title")
    private String title;

    @Column(name = "memo")
    private String memo;

    @Column(name = "deadline")
    private LocalDateTime deadline;
}
