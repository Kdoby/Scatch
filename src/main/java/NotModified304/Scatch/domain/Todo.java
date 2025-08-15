package NotModified304.Scatch.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "todo")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "title")
    private String title;

    @Column(name = "is_done")
    private Boolean isDone = false;

    @Column(name = "todo_date")
    private LocalDate todoDate;

    @Column(name = "total_duration")
    private Integer totalDuration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", foreignKey = @ForeignKey(ConstraintMode.CONSTRAINT))
    private Category category;
}
