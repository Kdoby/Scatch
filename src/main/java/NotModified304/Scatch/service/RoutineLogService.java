package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.RoutineLog;
import NotModified304.Scatch.dto.routine.request.LogUpdateRequest;
import NotModified304.Scatch.dto.routine.request.RoutineUpdateRequest;
import NotModified304.Scatch.repository.interfaces.RoutineLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RoutineLogService {
    private final RoutineLogRepository routineLogRepository;

    // log 등록
    public void registerRoutineLog(LogUpdateRequest dto) {
        Optional<RoutineLog> logOpt = routineLogRepository.findLog(dto.getRoutineId(), dto.getDate());

        // 기존 로그가 있으면 달성 여부만 변경
        if(logOpt.isPresent()) {
            RoutineLog log = logOpt.get();
            log.setIsCompleted(dto.getIsCompleted());
        }
        // 기존 로그가 없으면 새로 등록
        else {
            RoutineLog log = RoutineLog.builder()
                    .routineId(dto.getRoutineId())
                    .date(dto.getDate())
                    .isCompleted(dto.getIsCompleted())
                    .build();
            routineLogRepository.save(log);
        }
    }

    // 루틴 로그 수정
    public void updateRoutineLog(RoutineUpdateRequest dto) {
        Long routineId = dto.getRoutineId();
        LocalDate startDate = dto.getStartDate();
        LocalDate endDate = dto.getEndDate();

        if(startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("시작일자는 종료일자보다 이전이어야 합니다.");
        }

        if(startDate != null) {
            routineLogRepository.deleteByRoutineIdAndDateBefore(routineId, startDate);
        }
        if(endDate != null) {
            routineLogRepository.deleteByRoutineIdAndDateAfter(routineId, endDate);
        }
    }

    // 루틴 로그 삭제
    public void removeRoutineLog(Long routineId) {
        routineLogRepository.deleteByRoutineId(routineId);
    }
}
