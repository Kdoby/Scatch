package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Routine;
import NotModified304.Scatch.dto.routine.request.RoutineCreateRequest;
import NotModified304.Scatch.dto.routine.request.RoutineUpdateRequest;
import NotModified304.Scatch.repository.interfaces.RoutineRepository;
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
    public Long registerRoutine(RoutineCreateRequest dto) {
        Routine newRoutine = Routine.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();

        // 루틴 종료 날짜를 선택하지 않으면 5년 뒤로 자동 설정
        if(dto.getEndDate() == null) {
            newRoutine.setEndDate(dto.getStartDate().plusYears(5));
        }

        routineRepository.save(newRoutine);
        return newRoutine.getId();
    }

    // 루틴 수정
    public void updateRoutine(RoutineUpdateRequest dto) {
        Routine routine = findById(dto.getRoutineId());

        if(dto.getName() != null) routine.setName(dto.getName());
        if(dto.getStartDate() != null) routine.setStartDate(dto.getStartDate());
        if(dto.getEndDate() != null) routine.setEndDate(dto.getEndDate());
    }

    // 루틴 삭제
    public void removeRoutine(Long routineId) {
        Routine routine = findById(routineId);
        routineRepository.delete(routine);
    }

    // 루틴 종료
    public void updateIsClosed(Long routineId) {
        Routine routine = findById(routineId);
        routine.setIsClosed(true);
    }
}
