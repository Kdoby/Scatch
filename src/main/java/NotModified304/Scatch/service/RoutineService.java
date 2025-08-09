package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Routine;
import NotModified304.Scatch.dto.routine.request.RoutineCreateRequest;
import NotModified304.Scatch.dto.routine.request.RoutineUpdateRequest;
import NotModified304.Scatch.repository.interfaces.RoutineRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.html.Option;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;

    public Routine findById(Long id) {
        return routineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 루틴입니다."));
    }

    // 루틴 등록
    public Long registerRoutine(String username, RoutineCreateRequest req) {

        Routine newRoutine = Routine.builder()
                .username(username)
                .name(req.getName())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();

        // 루틴 종료 날짜를 선택하지 않으면 5년 뒤로 자동 설정
        if(req.getEndDate() == null) {
            newRoutine.setEndDate(req.getStartDate().plusYears(5));
        }

        routineRepository.save(newRoutine);

        return newRoutine.getId();
    }

    // 루틴 수정
    public void updateRoutine(String username, RoutineUpdateRequest req) {

        Routine routine = findById(req.getRoutineId());

        // 수정 권한 체크
        SecurityUtil.validateOwner(routine.getUsername(), username);

        if(req.getName() != null) routine.setName(req.getName());
        if(req.getStartDate() != null) routine.setStartDate(req.getStartDate());
        if(req.getEndDate() != null) routine.setEndDate(req.getEndDate());
    }

    // 루틴 삭제
    public void removeRoutine(String username, Long routineId) {
        
        Routine routine = findById(routineId);
        
        // 삭제 권한 체크
        SecurityUtil.validateOwner(routine.getUsername(), username);
        
        routineRepository.delete(routine);
    }

    // 루틴 종료
    public void updateIsClosed(String username, Long routineId) {

        Routine routine = findById(routineId);

        SecurityUtil.validateOwner(routine.getUsername(), username);

        routine.setIsClosed(true);
    }
}
