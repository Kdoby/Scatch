package NotModified304.Scatch.service.todo;

import NotModified304.Scatch.domain.todo.StudyLog;
import NotModified304.Scatch.domain.todo.Todo;
import NotModified304.Scatch.dto.todo.request.StudyLogCreateRequest;
import NotModified304.Scatch.dto.todo.response.StudyLogResponse;
import NotModified304.Scatch.dto.todo.request.StudyLogUpdateRequest;
import NotModified304.Scatch.repository.interfaces.todo.StudyLogRepository;
import NotModified304.Scatch.repository.interfaces.todo.TodoRepository;
import NotModified304.Scatch.security.SecurityUtil;
import NotModified304.Scatch.util.CustomDateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class StudyLogService {

    private final StudyLogRepository studyLogRepository;
    private final TodoRepository todoRepository;

    public StudyLog findStudyLog(Long id) {

        return studyLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 기록입니다."));
    }

    // 공부 기록 저장
    public List<Long> registerStudyLog(String username, StudyLogCreateRequest req) {

        LocalDateTime start = req.getStartTime();
        LocalDateTime end = req.getEndTime();

        if(start.isAfter(end)) {
            throw new IllegalArgumentException("시잔 시간이 종료 시간보다 늦을 수 없습니다.");
        }

        // 범위 유효성 체크
        if(req.getIsManual() && !CustomDateUtils.isWithinCustomDay(start, end)) {
            throw new IllegalArgumentException("수동 기록은 하루(06:00~다음날 05:59) 범위 내여야 합니다.");
        }

        // 수동 등록 시, 중복 기록 존재 여부 체크
        if(req.getIsManual() && studyLogRepository.existOverlap(username, CustomDateUtils.getCustomLogDate(start), start, end)) {
            throw new IllegalArgumentException("이미 해당 시간대에 공부 기록이 존재합니다.");
        }

        // 존재하지 않는 todo 에 대해서는 새로운 공부 기록을 등록할 수 없음
        Todo todo = todoRepository.findById(req.getTodoId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 todo 입니다."));

        // todo 접근 권한 체크
        SecurityUtil.validateOwner(todo.getUsername(), username);

        String categoryName = todo.getCategory() != null ? todo.getCategory().getName() : null;
        String categoryColor = todo.getCategory() != null ? todo.getCategory().getColor() : null;

        List<Long> savedIds = new ArrayList<>();

        while(start.isBefore(end)) {

            // 다음날 오전 6시가 경계 기준
            LocalDateTime nextSplit = CustomDateUtils.getCustomDayStart(start).plusDays(1);
            // end 가 다음날 오전 6시를 넘어간 경우(즉, 다음 날이 넘어서까지 공부한 경우), 다음 start 는 nextSplit 이 됨
            LocalDateTime splitEnd = end.isBefore(nextSplit) ? end : nextSplit;

            // 초단위로 기록 저장
            int durationSeconds = (int) Duration.between(start, splitEnd).toSeconds();

            StudyLog studyLog = StudyLog.builder()
                    .username(username)
                    .todoId(req.getTodoId())
                    .todoTitle(todo.getTitle())
                    .categoryName(categoryName)
                    .categoryColor(categoryColor)
                    .startTime(start)
                    .endTime(splitEnd)
                    .logDate(CustomDateUtils.getCustomLogDate(start))
                    .duration(durationSeconds)
                    .isManual(req.getIsManual())
                    .build();

            // 해당 todo 의 total_duration 업데이트
            Integer newDuration = todo.getTotalDuration() + durationSeconds;
            todo.setTotalDuration(newDuration);

            studyLogRepository.save(studyLog);
            savedIds.add(studyLog.getId());

            start = splitEnd;
        }

        return savedIds;
    }

    // 공부 기록 수정 -> 하루 이내의 범위에서만 수정 가능
    public Long updateStudyLog(String username, Long id, StudyLogUpdateRequest req) {

        LocalDate logDate = req.getLogDate();
        LocalDateTime start = req.getStart();
        LocalDateTime end = req.getEnd();

        StudyLog studyLog = findStudyLog(id);

        // 수정 권한 체크
        SecurityUtil.validateOwner(studyLog.getUsername(), username);

        if(start.isAfter(end)) {
            throw new IllegalArgumentException("시작 시간이 종료 시간보다 늦을 수 없습니다.");
        }

        if(!CustomDateUtils.isWithinCustomDay(start, end)) {
            throw new IllegalArgumentException("공부 기록은 하루(06:00~다음날 05:59) 범위 내여야 합니다.");
        }

        // 자기 자신을 제외하고 겹치는 로그가 있는지 검사
        boolean hasOverlap = studyLogRepository.existOverlapExcludeMe(id, username, logDate, start, end);
        if(hasOverlap) {
            throw new IllegalArgumentException("이미 해당 시간대에 공부 기록이 존재합니다.");
        }

        int originalDuration = studyLog.getDuration();
        int newDuration = (int) Duration.between(start, end).getSeconds();

        // todo 누적 시간 변경
        todoRepository.findById(studyLog.getTodoId()).ifPresent(t -> {
            t.setTotalDuration(t.getTotalDuration() - originalDuration + newDuration);
        });

        studyLog.setStartTime(start);
        studyLog.setEndTime(end);
        studyLog.setDuration(newDuration);
        studyLog.setLogDate(CustomDateUtils.getCustomLogDate(start));

        return studyLog.getId();
    }

    // 공부 기록 삭제
    public void removeStudyLog(String username, Long id) {

        StudyLog studyLog = findStudyLog(id);

        SecurityUtil.validateOwner(studyLog.getUsername(), username);

        // todo 누적 시간 변경
        todoRepository.findById(studyLog.getTodoId()).ifPresent(t -> {
            t.setTotalDuration(t.getTotalDuration() - studyLog.getDuration());
        });

        studyLogRepository.delete(studyLog);
    }

    // 특정 날짜의 공부 기록 조회
    public List<StudyLogResponse> getStudyLogsByDate(String username, LocalDate date) {

        return studyLogRepository.findByDate(username, date)
                .stream().map(StudyLogResponse::from)
                .toList();
    }
}
