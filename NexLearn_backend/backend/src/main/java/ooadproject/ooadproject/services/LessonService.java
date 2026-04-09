package ooadproject.ooadproject.services;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ooadproject.ooadproject.models.Lessons;
import ooadproject.ooadproject.repository.LessonRepository;
import java.util.List;
@Service
public class LessonService {
    @Autowired private LessonRepository lessonRepository;
    public Lessons getLessonById(String id) { return lessonRepository.findById(id).orElse(null); }
    public List<Lessons> getLessonsByCourseId(String courseId) {
        return lessonRepository.findByCourseIdObj(new ObjectId(courseId));
    }
    public String createLesson(Lessons lesson) { return lessonRepository.save(lesson).getId(); }
    public void deleteLesson(String id) { lessonRepository.deleteById(id); }
    public Lessons updateLesson(Lessons lesson) { return lessonRepository.save(lesson); }
}
