package NotModified304.Scatch.service.routine;

import NotModified304.Scatch.domain.routine.RepeatDays;
import NotModified304.Scatch.domain.routine.Routine;
import NotModified304.Scatch.repository.interfaces.routine.RepeatDaysRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RepeatDaysService {

    private final RepeatDaysRepository repeatDaysRepository;
    private final RoutineService routineService;

    public void registerRepeatDays(String username, Long routineId, List<Integer> days) {

        // 루틴 접근 권한 체크
        Routine routine = routineService.findById(routineId);
        SecurityUtil.validateOwner(routine.getUsername(), username);

        for(Integer day : days) {
            repeatDaysRepository.save(RepeatDays.builder()
                    .routineId(routineId)
                    .weekOfDay(day)
                    .build());
        }
    }

    // 반복 요일 삭제
    public void removeRepeatDays(String username, Long routineId) {

        // 루틴 접근 권한 체크
        Routine routine = routineService.findById(routineId);
        SecurityUtil.validateOwner(routine.getUsername(), username);

        repeatDaysRepository.deleteByRoutineId(routineId);
    }
}
