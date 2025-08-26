package NotModified304.Scatch;

import NotModified304.Scatch.repository.interfaces.routine.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class RoutineScheduler {

    private final RoutineRepository routineRepository;

    @Scheduled(cron = "0 0 6 * * *")
    @Transactional
    public void closeExpiredRoutines() {
        int updatedCount = routineRepository.closedExpiredRoutines(LocalDate.now());
        System.out.println("[스케줄러] 종료된 루틴 자동 마감: " + updatedCount + "건");
    }
}
