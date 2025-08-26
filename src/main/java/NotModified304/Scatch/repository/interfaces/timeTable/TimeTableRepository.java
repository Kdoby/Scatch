package NotModified304.Scatch.repository.interfaces.timeTable;

import NotModified304.Scatch.domain.timeTable.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    List<TimeTable> findByUsername(String username);
    Optional<TimeTable> findByUsernameAndIsMain(String username, Boolean isMain);
    List<TimeTable> findByUsernameOrderByCreatedAtDesc(String username);
}
