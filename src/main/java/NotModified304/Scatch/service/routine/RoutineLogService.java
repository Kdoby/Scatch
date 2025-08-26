package NotModified304.Scatch.service.routine;

import NotModified304.Scatch.domain.routine.Routine;
import NotModified304.Scatch.domain.routine.RoutineLog;
import NotModified304.Scatch.dto.routine.request.LogUpdateRequest;
import NotModified304.Scatch.dto.routine.request.RoutineUpdateRequest;
import NotModified304.Scatch.repository.interfaces.routine.RoutineLogRepository;
import NotModified304.Scatch.security.SecurityUtil;
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
    private final RoutineService routineService;

    // log 등록
    public void registerRoutineLog(String username, LogUpdateRequest req) {

        // 루틴 접근 권한 체크
        Routine routine = routineService.findById(req.getRoutineId());
        SecurityUtil.validateOwner(routine.getUsername(), username);

        Optional<RoutineLog> logOpt = routineLogRepository.findLog(req.getRoutineId(), req.getDate());

        // 기존 로그가 있으면 달성 여부만 변경
        if(logOpt.isPresent()) {
            RoutineLog log = logOpt.get();
            log.setIsCompleted(req.getIsCompleted());
        }
        // 기존 로그가 없으면 새로 등록
        else {
            RoutineLog log = RoutineLog.builder()
                    .routineId(req.getRoutineId())
                    .date(req.getDate())
                    .isCompleted(req.getIsCompleted())
                    .build();

            routineLogRepository.save(log);
        }
    }

    // 루틴 로그 수정 (루틴 수정 시, 함께 수정됨)
    public void updateRoutineLog(String username, RoutineUpdateRequest req) {

        // 루틴 접근 권한 체크
        Routine routine = routineService.findById(req.getRoutineId());
        SecurityUtil.validateOwner(routine.getUsername(), username);

        Long routineId = req.getRoutineId();
        LocalDate startDate = req.getStartDate();
        LocalDate endDate = req.getEndDate();

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
    public void removeRoutineLog(String username, Long routineId) {

        // 루틴 접근 권한 체크
        Routine routine = routineService.findById(routineId);
        SecurityUtil.validateOwner(routine.getUsername(), username);

        routineLogRepository.deleteByRoutineId(routineId);
    }
}
