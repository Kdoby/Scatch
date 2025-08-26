package NotModified304.Scatch.domain.todo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

@Data
@Entity
@Table(name = "category")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert  // default 값이 자동으로 들어가도록
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "name")
    private String name;

    @Column(name = "color")
    private String color = "#FFFFFF";

    @Column(name = "is_active")
    private Boolean isActive = true;
}
