package NotModified304.Scatch.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Builder
@Data
@DynamicInsert
@Table(name = "repeat_days")
@NoArgsConstructor
@AllArgsConstructor
public class RepeatDays {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "routine_id")
    private Long routineId;

    @Column(name = "week_of_day", nullable = false)
    private Integer weekOfDay;
}
