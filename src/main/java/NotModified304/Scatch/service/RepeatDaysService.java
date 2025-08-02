package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.RepeatDays;
import NotModified304.Scatch.dto.routine.request.RoutineCreateRequest;
import NotModified304.Scatch.repository.interfaces.RepeatDaysRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RepeatDaysService {
    private final RepeatDaysRepository repeatDaysRepository;

    public void registerRepeatDays(Long routineId, List<Integer> days) {
        for(Integer day : days) {
            repeatDaysRepository.save(RepeatDays.builder()
                    .routineId(routineId)
                    .weekOfDay(day)
                    .build());
        }
    }

    // 반복 요일 삭제
    public void removeRepeatDays(Long routineId) {
        repeatDaysRepository.deleteByRoutineId(routineId);
    }
}
