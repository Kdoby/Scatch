package NotModified304.Scatch.service.member;

import NotModified304.Scatch.domain.member.Member;
import NotModified304.Scatch.domain.routine.Routine;
import NotModified304.Scatch.repository.interfaces.routine.RepeatDaysRepository;
import NotModified304.Scatch.repository.interfaces.routine.RoutineLogRepository;
import NotModified304.Scatch.repository.interfaces.routine.RoutineRepository;
import NotModified304.Scatch.repository.interfaces.todo.CategoryRepository;
import NotModified304.Scatch.repository.interfaces.todo.LessonRepository;
import NotModified304.Scatch.repository.interfaces.todo.StudyLogRepository;
import NotModified304.Scatch.service.auth.AuthService;
import NotModified304.Scatch.service.calendar.EventService;
import NotModified304.Scatch.service.timeTable.TimeTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.File;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberDeleteService {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    private final TimeTableService timeTableService;

    private final EventService eventService;

    private final CategoryRepository categoryRepository;
    private final StudyLogRepository studyLogRepository;
    private final LessonRepository lessonRepository;

    private final RoutineRepository routineRepository;
    private final RoutineLogRepository routineLogRepository;
    private final RepeatDaysRepository repeatDaysRepository;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    public void deleteAllOfMember(String username, String password) {

        Member member = memberService.findMember(username);

        // 탈퇴 전, 비밀번호 체크
        if(!passwordEncoder.matches(password, member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 저장된 프로필 사진 삭제
        String storedFileName = member.getStoredFileName();
        if(storedFileName != null && !storedFileName.equals("basic.png")) {
            File file = new File(UPLOAD_DIR + storedFileName);
            if(file.exists()) {
                file.delete();
            }
        }

        // 시간표 삭제
        timeTableService.deleteAll(username);
        // 캘린더 일정 삭제
        eventService.deleteAll(username);

        // category / todo / study log / lesson 삭제
        categoryRepository.deleteByUsername(username);
        studyLogRepository.deleteByUsername(username);
        lessonRepository.deleteByUsername(username);

        // routine 관련 삭제
        List<Routine> routines = routineRepository.findByUsername(username);

        for(Routine routine : routines) {
            routineLogRepository.deleteByRoutineId(routine.getId());
            repeatDaysRepository.deleteByRoutineId(routine.getId());
            routineRepository.deleteById(routine.getId());
        }

        memberService.remove(member.getId());
    }
}
