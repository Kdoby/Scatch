package NotModified304.Scatch.service.todo;

import NotModified304.Scatch.domain.todo.Lesson;
import NotModified304.Scatch.dto.todo.request.LessonCreateRequest;
import NotModified304.Scatch.dto.todo.response.LessonResponse;
import NotModified304.Scatch.dto.todo.request.LessonUpdateRequest;
import NotModified304.Scatch.repository.interfaces.todo.LessonRepository;
import NotModified304.Scatch.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;

    public Lesson findLesson(Long id) {

        return lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 격언입니다."));
    }

    // 격언 등록
    public Long registerLesson(String username, LessonCreateRequest req) {

        Lesson lesson = Lesson.builder()
                .username(username)
                .content(req.getContent())
                .contentWriter(req.getContentWriter())
                .lessonDate(req.getLessonDate())
                .build();

        lessonRepository.save(lesson);

        return lesson.getId();
    }
    
    // 격언 수정
    public void updateLesson(String username, Long id, LessonUpdateRequest req) {

        Lesson lesson = findLesson(id);

        SecurityUtil.validateOwner(lesson.getUsername(), username);

        if(req.getContent() != null) lesson.setContent(req.getContent());
        if(req.getContentWriter() != null) lesson.setContentWriter(req.getContentWriter());
    }

    // 격언 삭제
    public void removeLesson(String username, Long id) {

        Lesson lesson = findLesson(id);

        SecurityUtil.validateOwner(lesson.getUsername(), username);

        lessonRepository.delete(lesson);
    }

    public LessonResponse getLessonByDate(String username, LocalDate date) {

        return LessonResponse.from(lessonRepository.findByDate(username, date));
    }
}
