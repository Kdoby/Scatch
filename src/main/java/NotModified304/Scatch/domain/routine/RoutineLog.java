package NotModified304.Scatch.domain.routine;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@Table(name = "routine_log")
public class RoutineLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "routine_id")
    private Long routineId;

    @Column(name = "log_date")
    private LocalDate date;

    @Column(name = "is_completed")
    private Boolean isCompleted;
}
