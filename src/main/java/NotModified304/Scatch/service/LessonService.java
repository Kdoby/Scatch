package NotModified304.Scatch.service;

import NotModified304.Scatch.domain.Lesson;
import NotModified304.Scatch.dto.lesson.LessonCreateRequest;
import NotModified304.Scatch.dto.lesson.LessonResponse;
import NotModified304.Scatch.dto.lesson.LessonUpdateRequest;
import NotModified304.Scatch.repository.interfaces.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public Lesson findById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 격언입니다."));
    }

    // 격언 등록
    public Long registerLesson(LessonCreateRequest dto) {
        Lesson lesson = Lesson.builder()
                .userId(dto.getUserId())
                .content(dto.getContent())
                .contentWriter(dto.getContentWriter())
                .lessonDate(dto.getLessonDate())
                .build();

        lessonRepository.save(lesson);

        return lesson.getId();
    }
    
    // 격언 수정
    public void updateLesson(Long id, LessonUpdateRequest dto) {
        Lesson lesson = findById(id);

        if(dto.getContent() != null) lesson.setContent(dto.getContent());
        if(dto.getContentWriter() != null) lesson.setContentWriter(dto.getContentWriter());
    }

    // 격언 삭제
    public void removeLesson(Long id) {
        Lesson lesson = findById(id);

        lessonRepository.delete(lesson);
    }

    public LessonResponse getLessonByDate(String userId, LocalDate date) {
        return LessonResponse.from(lessonRepository.findByDate(userId, date));
    }
}
